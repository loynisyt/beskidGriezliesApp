import React, { useEffect, useState } from "react";

const WorkoutShortcut = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/workouts/workouts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          const now = new Date();
          const upcoming = data
            .filter((w) => new Date(w.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);
          setWorkouts(upcoming);
        }
      } catch (e) {
        setWorkouts([]);
      }
    };
    fetchWorkouts();
  }, []);

  // Helper to format date as YYYY-MM-DD and time as HH:MM
  const formatDateTime = (date, time) => {
    if (!date) return "";
    // Handles both "YYYY-MM-DD" and "YYYY-MM-DDTHH:MM:SSZ"
    const datePart = date.split("T")[0];
    const timePart = time ? time.slice(0, 5) : "";
    return `${datePart}${timePart ? " " + timePart : ""}`;
  };

  return (
    <div className="box has-text-centered is-size-4">
      <h3 className="title is-3">Najbliższe Treningi</h3>
      {workouts.length === 0 && <p>Brak treningów</p>}
      <ul>
        {workouts.map((w) => (
          <li key={w.id} className="mb-2">
            <strong>{w.title}</strong> — {formatDateTime(w.date, w.time)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutShortcut;
