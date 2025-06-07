const express = require("express");
const router = express.Router();
const pool = require("../db");

// endpoint: Add a participant to a workout
router.post("/workouts/:id/participants", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const newParticipant = await pool.query(
      "INSERT INTO participants (workout_id, user_id) VALUES ($1, $2) RETURNING *",
      [id, userId]
    );
    res.json(newParticipant.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// endpoint: Remove a participant from a workout
router.delete("/workouts/:id/participants/:userId", async (req, res) => {
  const { id, userId } = req.params;
  try {
    const deleteResult = await pool.query(
      "DELETE FROM participants WHERE workout_id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ message: "Participant not found" });
    }
    res.json({ message: "Participant removed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// endpoint: Get participant count for a workout
router.get("/workouts/:id/participants/count", async (req, res) => {
  const { id } = req.params;
  try {
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM participants WHERE workout_id = $1",
      [id]
    );
    res.json({ count: parseInt(countResult.rows[0].count) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// endpoint: Get all participants for a workout
router.get("/workouts/:id/participants", async (req, res) => {
  const { id } = req.params;
  try {
    const participants = await pool.query(
      "SELECT p.user_id, u.username, u.first_name, u.last_name FROM participants p JOIN users u ON p.user_id = u.id WHERE p.workout_id = $1",
      [id]
    );
    res.json(participants.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// New endpoint: Get attendance percentage for all users optionally filtered by season
router.get("/attendance", async (req, res) => {
  const { season } = req.query;

  try {
    let totalWorkoutsQuery = "SELECT COUNT(*) FROM workouts";
    let totalWorkoutsParams = [];
    if (season) {
      totalWorkoutsQuery += " WHERE season = $1";
      totalWorkoutsParams.push(season);
    }
    const totalResult = await pool.query(
      totalWorkoutsQuery,
      totalWorkoutsParams
    );
    const totalWorkouts = parseInt(totalResult.rows[0].count);

    if (totalWorkouts === 0) {
      return res.json([]);
    }

    let participationQuery = `
            SELECT u.id as user_id, u.username, u.first_name, u.last_name, COUNT(DISTINCT p.workout_id) as participated_workouts
            FROM users u
            LEFT JOIN participants p ON u.id = p.user_id
            LEFT JOIN workouts w ON p.workout_id = w.id
        `;
    let whereClauses = [];
    let params = [];
    if (season) {
      whereClauses.push("w.season = $1");
      params.push(season);
    }
    if (whereClauses.length > 0) {
      participationQuery += " WHERE " + whereClauses.join(" AND ");
    }
    participationQuery += " GROUP BY u.id ORDER BY u.first_name, u.last_name";

    const participationResult = await pool.query(participationQuery, params);

    const attendanceData = participationResult.rows.map((row) => ({
      user_id: row.user_id,
      username: row.username,
      first_name: row.first_name,
      last_name: row.last_name,
      participated_workouts: parseInt(row.participated_workouts),
      attendance_percentage:
        totalWorkouts > 0
          ? ((row.participated_workouts / totalWorkouts) * 100).toFixed(2)
          : "0.00",
    }));

    res.json(attendanceData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// New endpoint: Get participation stats for a user
router.get("/users/:userId/participation", async (req, res) => {
  const { userId } = req.params;
  const { season, month } = req.query;

  try {
    let totalWorkoutsQuery = "SELECT COUNT(*) FROM workouts";
    let totalWorkoutsParams = [];
    let whereClauses = [];

    if (season) {
      whereClauses.push("season = $" + (totalWorkoutsParams.length + 1));
      totalWorkoutsParams.push(season);
    }
    if (month) {
      whereClauses.push(
        "to_char(date, 'YYYY-MM') = $" + (totalWorkoutsParams.length + 1)
      );
      totalWorkoutsParams.push(month);
    }
    if (whereClauses.length > 0) {
      totalWorkoutsQuery += " WHERE " + whereClauses.join(" AND ");
    }

    let participatedQuery = `
            SELECT COUNT(DISTINCT p.workout_id) FROM participants p
            JOIN workouts w ON p.workout_id = w.id
            WHERE p.user_id = $1
        `;
    let participatedParams = [userId];
    if (season) {
      participatedQuery += " AND w.season = $2";
      participatedParams.push(season);
    }
    if (month) {
      participatedQuery += season
        ? " AND to_char(w.date, 'YYYY-MM') = $3"
        : " AND to_char(w.date, 'YYYY-MM') = $2";
      participatedParams.push(month);
    }

    const totalResult = await pool.query(
      totalWorkoutsQuery,
      totalWorkoutsParams
    );
    const participatedResult = await pool.query(
      participatedQuery,
      participatedParams
    );

    const total = parseInt(totalResult.rows[0].count);
    const participated = parseInt(participatedResult.rows[0].count);
    const percentage = total > 0 ? (participated / total) * 100 : 0;

    res.json({
      userId,
      totalWorkouts: total,
      participatedWorkouts: participated,
      participationPercentage: percentage.toFixed(2),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
