import React, { useState, useEffect } from "react";

const BeginWorkoutModal = ({ workoutId, onClose }) => {
  const [users, setUsers] = useState([]);
  const [participants, setParticipants] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsersAndParticipants = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        // Fetch all users
        const usersRes = await fetch("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await usersRes.json();

        // Fetch participants for this workout
        const participantsRes = await fetch(
          `http://localhost:5000/api/participant/workouts/${workoutId}/participants`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const participantsData = await participantsRes.json();

        setUsers(usersData);
        setParticipants(new Set(participantsData.map((p) => p.user_id)));
      } catch (error) {
        console.error("Error fetching users or participants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndParticipants();
  }, [workoutId]);

  const toggleParticipant = (userId) => {
    setParticipants((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const saveParticipants = async () => {
    try {
      const token = localStorage.getItem("token");
      // For simplicity, delete all participants and re-add from current set
      await fetch(
        `http://localhost:5000/api/participant/workouts/${workoutId}/participants`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      for (const userId of participants) {
        await fetch(
          `http://localhost:5000/api/participant/workouts/${workoutId}/participants`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId }),
          }
        );
      }
      onClose();
    } catch (error) {
      console.error("Error saving participants:", error);
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div
        className="modal-content"
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <div className="box">
          <h1 className="title">Begin Workout - Manage Participants</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <ul>
                {users.map((user) => (
                  <li key={user.id}>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={participants.has(user.id)}
                        onChange={() => toggleParticipant(user.id)}
                      />{" "}
                      {user.first_name} {user.last_name}
                    </label>
                  </li>
                ))}
              </ul>
              <div className="buttons mt-4">
                <button
                  className="button is-primary"
                  onClick={saveParticipants}
                >
                  Save
                </button>
                <button className="button" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default BeginWorkoutModal;
