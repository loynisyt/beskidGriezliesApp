import React, { useState, useEffect, useRef } from "react";
import DeleteTrainingModal from "./modals/DeleteTrainingModal";
import EditTrainingModal from "./modals/EditTrainingModal";
import AddTrainingModal from "./modals/AddTrainingModal";
import ParticipantsModal from "./modals/ParticipantsModal";

import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import "./Trainings.css";
import OutdatedWorkouts from "./OutdatedWorkouts";

import TrainingsCalendar from "./TrainingsCalendar";

const Trainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [outdatedTrainings, setOutdatedTrainings] = useState([]);
  const [participationStatus, setParticipationStatus] = useState({});
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [participantsList, setParticipantsList] = useState([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [newTraining, setNewTraining] = useState({
    title: "",
    date: "",
    time: "",
    description_html: "",
    season: 1,
    created_by: user.id,
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [trainingToEdit, setTrainingToEdit] = useState(null);
  const [trainingToDelete, setTrainingToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("lastModified");
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [showOutdated, setShowOutdated] = useState(true);
  const [centerIndex, setCenterIndex] = useState(0);
  const containerRef = useRef(null);

  const [calendarView, setCalendarView] = useState(true);

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/workouts/workouts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        const now = new Date();
        const upcoming = data.filter((t) => new Date(t.date) >= now);
        const outdated = data.filter((t) => new Date(t.date) < now);
        setTrainings(upcoming);
        setOutdatedTrainings(outdated);
        if (user && user.id) {
          const participationStatuses = {};
          await Promise.all(
            upcoming.map(async (workout) => {
              const res = await fetch(
                `http://localhost:5000/api/participant/workouts/${workout.id}/participants`
              );
              if (res.ok) {
                const participants = await res.json();
                participationStatuses[workout.id] = participants.some(
                  (p) => p.user_id === user.id
                );
              } else {
                participationStatuses[workout.id] = false;
              }
            })
          );
          setParticipationStatus(participationStatuses);
        }
      } else {
        setTrainings([]);
        setOutdatedTrainings([]);
      }
    } catch (error) {
      setTrainings([]);
      setOutdatedTrainings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const children = Array.from(container.children);
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      children.forEach((child, index) => {
        const rect = child.getBoundingClientRect();
        const childCenter = rect.top + rect.height / 2;
        const distance = Math.abs(containerCenter - childCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setCenterIndex(closestIndex);
    };

    container.addEventListener("scroll", handleScroll);
    // Initial call
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, [trainings, sortOption, selectedSeason]);

  const handleEditTraining = (training) => {
    setTrainingToEdit(training);
    setEditModalOpen(true);
  };
  const handleDeleteTraining = (id) => {
    setTrainingToDelete(id);
    setDeleteModalOpen(true);
  };
  const confirmDeleteTraining = async () => {
    if (trainingToDelete) {
      try {
        const token = localStorage.getItem("token");
        await fetch(
          `http://localhost:5000/api/workouts/workouts/${trainingToDelete}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTrainings(trainings.filter((t) => t.id !== trainingToDelete));
        setDeleteModalOpen(false);
      } catch {}
    }
  };

  const toggleParticipation = async (workoutId) => {
    try {
      const token = localStorage.getItem("token");
      if (participationStatus[workoutId]) {
        // Unparticipate
        const response = await fetch(
          `http://localhost:5000/api/participant/workouts/${workoutId}/participants/${user.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          setParticipationStatus((prev) => ({ ...prev, [workoutId]: false }));
        }
      } else {
        // Participate
        const response = await fetch(
          `http://localhost:5000/api/participant/workouts/${workoutId}/participants`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId: user.id }),
          }
        );
        if (response.ok) {
          setParticipationStatus((prev) => ({ ...prev, [workoutId]: true }));
        }
      }
    } catch (error) {
      console.error("Error toggling participation:", error);
    }
  };

  const openParticipantsModal = async (workoutId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/participant/workouts/${workoutId}/participants`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const participants = await response.json();
        setParticipantsList(participants);
        setSelectedWorkoutId(workoutId);
        setParticipantsModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const formatDateTime = (dateString, time) => {
    let dateObj;
    try {
      if (dateString.includes("T")) dateObj = new Date(dateString);
      else if (time) dateObj = new Date(`${dateString}T${time}`);
      else dateObj = new Date(dateString);
    } catch {
      return "Invalid Date";
    }
    if (isNaN(dateObj)) return "Invalid Date";
    const formattedDate = dateObj.toLocaleDateString("en-GB");
    const formattedTime = dateObj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${formattedDate} ${formattedTime}`;
  };

  const filteredTrainings = trainings.filter(
    (t) => t.season === selectedSeason
  );
  const sortedTrainings = [...filteredTrainings].sort((a, b) => {
    switch (sortOption) {
      case "lastModified":
        return new Date(b.updated_at) - new Date(a.updated_at);
      case "newest":
        return new Date(b.date) - new Date(a.date);
      case "oldest":
        return new Date(a.date) - new Date(b.date);
      case "title":
        return a.title.localeCompare(b.title);
      case "upcoming":
        return new Date(a.date) - new Date(b.date);
      default:
        return 0;
    }
  });

  const getOpacity = (index) => {
    const distance = Math.abs(index - centerIndex);
    if (distance === 0) return 1;
    if (distance === 1) return 0.7;
    if (distance === 2) return 0.4;
    return 0.2;
  };

  return (
    <div className="container">
      {!calendarView && (
        <>
          <div className="field">
            <label className="label">Season:</label>
            <div className="control">
              <div className="select">
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                >
                  <option value={1}>Season 1</option>
                  <option value={2}>Season 2</option>
                  <option value={3}>Season 3</option>
                  <option value={4}>Season 4</option>
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Sort By:</label>
            <div className="control">
              <div className="select">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="lastModified">Last Modified</option>
                  <option value="newest">Date: Newest</option>
                  <option value="oldest">Date: Oldest</option>
                  <option value="title">Title</option>
                  <option value="upcoming">First Upcoming</option>
                </select>
              </div>
            </div>
          </div>
          <button
            className="button is-info mb-3"
            onClick={() => setShowOutdated(!showOutdated)}
          >
            {showOutdated ? "Hide" : "Show"} Outdated Workouts
          </button>
        </>
      )}

      <button
        className="button is-primary is-sticky "
        onClick={() => setCalendarView(!calendarView)}
      >
        {calendarView ? "Switch to List View" : "Switch to Calendar View"}
      </button>

      {calendarView ? (
        <TrainingsCalendar />
      ) : (
        <div>
          <button
            className="button is-primary is-sticky mt-3"
            onClick={() => setAddModalOpen(true)}
          >
            Add Workout
          </button>
          <h2 className="title is-2 has-text-centered my-5">Workouts List</h2>
          <div
            className="trainings-container scrollable-container"
            ref={containerRef}
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
            {sortedTrainings.map((training, index) => (
              <div
                key={training.id}
                className="training-item mt-5"
                style={{ opacity: getOpacity(index) }}
              >
                <div className="box">
                  <h4 className="title is-5 has-text-weight-bold">
                    {training.title}
                  </h4>
                  <p className="label has-text-centered">
                    {formatDateTime(training.date, training.time)}
                  </p>
                  <p
                    className="label"
                    dangerouslySetInnerHTML={{
                      __html: training.description_html,
                    }}
                  />

                  <div className="buttonContainer">
                    <button
                      onClick={() => handleEditTraining(training)}
                      className="button is-warning"
                    >
                      Edit
                    </button>
                    {user.role === "admin" && (
                      <button
                        onClick={() => handleDeleteTraining(training.id)}
                        className="button is-danger"
                      >
                        Delete
                      </button>
                    )}
                    <button
                      onClick={() => toggleParticipation(training.id)}
                      className={`button  ${
                        participationStatus[training.id]
                          ? "is-danger"
                          : "is-success"
                      }`}
                    >
                      {participationStatus[training.id]
                        ? "Unparticipate"
                        : "Participate"}
                    </button>
                    <button
                      onClick={() => openParticipantsModal(training.id)}
                      className="button is-info  ml-2"
                    >
                      Participants
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {addModalOpen && (
              <AddTrainingModal
                onClose={() => setAddModalOpen(false)}
                onAdd={(newTraining) => {
                  setTrainings([...trainings, newTraining]);
                  setAddModalOpen(false);
                }}
              />
            )}
          </div>

          {showOutdated && (
            <>
              <h2 className="title is-3 has-text-centered my-5">
                Outdated Workouts
              </h2>
              <OutdatedWorkouts
                trainings={outdatedTrainings.filter(
                  (t) => t.season === selectedSeason
                )}
              />
            </>
          )}

          {participantsModalOpen && (
            <ParticipantsModal
              participants={participantsList}
              onClose={() => setParticipantsModalOpen(false)}
            />
          )}
          {editModalOpen && (
            <EditTrainingModal
              training={trainingToEdit}
              onClose={() => setEditModalOpen(false)}
              onUpdate={fetchTrainings}
            />
          )}
          {deleteModalOpen && (
            <DeleteTrainingModal
              training={trainings.find((t) => t.id === trainingToDelete)}
              onClose={() => setDeleteModalOpen(false)}
              onConfirm={confirmDeleteTraining}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Trainings;
