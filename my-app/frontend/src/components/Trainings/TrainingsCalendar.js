import React, { useState, useEffect } from "react";
import "./Trainings.css";

import AddTrainingModal from "./modals/AddTrainingModal";
import DeleteTrainingModal from "./modals/DeleteTrainingModal";
import ParticipantsModal from "./modals/ParticipantsModal";
import BeginWorkoutModal from "./modals/BeginWorkoutModal";
import EditTrainingModal from "./modals/EditTrainingModal";

const TrainingsCalendar = () => {
  const [trainings, setTrainings] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'menu', 'add', 'inspect', 'delete', 'edit', 'begin', 'participants', 'view'
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [beginWorkoutModalOpen, setBeginWorkoutModalOpen] = useState(false);

  const [trainingsForMenu, setTrainingsForMenu] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "admin";

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
        setTrainings(data);
      } else {
        setTrainings([]);
      }
    } catch (error) {
      setTrainings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const startOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const daysInMonth = (date) => endOfMonth(date).getDate();

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  const prevYear = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1)
    );
  const nextYear = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1)
    );

  const formatDate = (date) => date.toISOString().split("T")[0];

  const getTrainingsForDay = (dateStr) =>
    trainings.filter((t) => {
      const tDate = t.date ? t.date.split("T")[0] : "";
      return tDate === dateStr;
    });

  // When clicking a day, open menu modal with all trainings for that day
  const handleDayClick = (date) => {
    const dateStr = formatDate(date);
    setSelectedDay(dateStr);
    const dayTrainings = getTrainingsForDay(dateStr);
    setTrainingsForMenu(dayTrainings);

    if (isAdmin) {
      setModalType("menu");
      setModalOpen(true);
      setSelectedTraining(null);
    } else if (dayTrainings.length > 0) {
      setSelectedTraining(dayTrainings[0]);
      setModalType("view");
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setSelectedTraining(null);
    setSelectedDay(null);
    setParticipantsModalOpen(false);
    setBeginWorkoutModalOpen(false);
  };

  // Admin menu modal for a day
  const renderMenuModal = () => (
    <div className="modal is-active">
      <div className="modal-background" onClick={closeModal}></div>
      <div className="modal-content">
        <div className="box">
          <h2 className="title is-4">Opcje na dzien {selectedDay}</h2>
          <button
            className="button is-primary mb-2"
            onClick={() => setModalType("add")}
          >
            Dodaj nowy trening
          </button>
          {trainingsForMenu.length > 0 && (
            <>
              <h1 className="subtitle ml-2 mt-3">Treningi: </h1>
              <ul>
                {trainingsForMenu.map((training) => (
                  <li
                    className="ml-2"
                    key={training.id}
                    style={{ marginBottom: "0.5rem" }}
                  >
                    <span className="has-text-weight-bold">
                      {training.title}
                    </span>
                    <span>
                      {" "}
                      ({training.time ? training.time.slice(0, 5) : ""})
                    </span>
                    <div className="buttons mt-1">
                      <button
                        className="button is-info is-small"
                        onClick={() => {
                          setSelectedTraining(training);
                          setModalType("inspect");
                        }}
                      >
                        Inspekcja
                      </button>
                      <button
                        className="button is-warning is-small"
                        onClick={() => {
                          setSelectedTraining(training);
                          setModalType("edit");
                        }}
                      >
                        Edytuj
                      </button>
                      <button
                        className="button is-danger is-small"
                        onClick={() => {
                          setSelectedTraining(training);
                          setModalType("delete");
                        }}
                      >
                        Usuń
                      </button>
                      <button className="button " onClick={closeModal}>
                        Zamknij
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={closeModal}
      ></button>
    </div>
  );

  // User view modal for a day (shows workout data only)
  const renderUserViewModal = () => (
    <div className="modal is-active">
      <div className="modal-background" onClick={closeModal}></div>
      <div className="modal-content">
        <div className="box">
          <h2 className="title is-4">{selectedTraining?.title}</h2>
          <p>
            <strong>Data:</strong> {selectedTraining?.date?.split("T")[0]}
          </p>
          <p>
            <strong>Godzina:</strong> {selectedTraining?.time?.slice(0, 5)}
          </p>
          <div
            dangerouslySetInnerHTML={{
              __html: selectedTraining?.description_html,
            }}
          />
          <button className="button mt-3" onClick={closeModal}>
            Zamknij
          </button>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={closeModal}
      ></button>
    </div>
  );

  // Inspect modal: choose to view participants or begin workout (admin only)
  const renderInspectModal = () => (
    <div className="modal is-active">
      <div className="modal-background" onClick={closeModal}></div>
      <div className="modal-content">
        <div className="box">
          <h2 className="title is-4">Inspekcja: {selectedTraining?.title}</h2>
          <div className="buttons">
            <button
              className="button is-info"
              onClick={() => setParticipantsModalOpen(true)}
            >
              Uczestnicy
            </button>
            <button
              className="button is-success"
              onClick={() => setBeginWorkoutModalOpen(true)}
            >
              Obecność
            </button>
            <button className="button" onClick={closeModal}>
              Zamknij
            </button>
          </div>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={closeModal}
      ></button>
    </div>
  );

  // Calendar rendering
  const renderCalendar = () => {
    const startDay = startOfMonth(currentDate).getDay();
    const adjustedStartDay = (startDay + 6) % 7;
    const daysInCurrentMonth = daysInMonth(currentDate);

    const weeks = [];
    let dayCounter = 1 - adjustedStartDay;

    for (let week = 0; week < 6; week++) {
      const days = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          dayCounter
        );
        const dateStr = formatDate(date);
        const isCurrentMonth = date.getMonth() === currentDate.getMonth();
        const dayTrainings = getTrainingsForDay(dateStr);

        let bgColor = "";
        if (dayTrainings.length > 0) bgColor = "has-background-link-light";

        days.push(
          <td
            key={day}
            className={`calendar-day ${bgColor} ${
              isCurrentMonth ? "" : "has-text-grey-light"
            }`}
            style={{
              cursor: "pointer",
              verticalAlign: "top",
              padding: "0.5rem",
              minWidth: "100px",
              height: "100px",
            }}
            onClick={() => handleDayClick(date)}
          >
            <div className="has-text-weight-bold">{date.getDate()}</div>
            {dayTrainings.map((training, idx) => (
              <div key={idx} className="training-entry">
                <span>
                  {training.title || "No Title"} (
                  {training.time ? training.time.slice(0, 5) : ""})
                </span>
              </div>
            ))}
          </td>
        );
        dayCounter++;
      }
      weeks.push(<tr key={week}>{days}</tr>);
    }

    return (
      <table className="table is-fullwidth is-bordered is-hoverable is-striped">
        <thead>
          <tr>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
            <th>Sun</th>
          </tr>
        </thead>

        <tbody>{weeks}</tbody>
      </table>
    );
  };

  return (
    <div className="calendar-container" style={{ padding: "1rem" }}>
      <div className="level mb-3">
        <div className="level-left">
          <button className="button" onClick={prevYear}>
            &laquo; Year
          </button>
          <button className="button" onClick={prevMonth}>
            &lsaquo; Month
          </button>
        </div>
        <div className="level-item has-text-weight-bold is-size-4">
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </div>
        <div className="level-right">
          <button className="button" onClick={nextMonth}>
            Month &rsaquo;
          </button>
          <button className="button" onClick={nextYear}>
            Year &raquo;
          </button>
        </div>
      </div>
      {loading ? <p>Loading...</p> : renderCalendar()}

      {/* Admin-only modals */}
      {isAdmin && modalOpen && modalType === "menu" && renderMenuModal()}
      {isAdmin && modalOpen && modalType === "add" && (
        <AddTrainingModal
          onClose={closeModal}
          onAdd={() => {
            fetchTrainings();
            closeModal();
          }}
          initialDate={selectedDay}
        />
      )}
      {isAdmin && modalOpen && modalType === "inspect" && renderInspectModal()}
      {isAdmin && modalOpen && modalType === "edit" && selectedTraining && (
        <EditTrainingModal
          training={selectedTraining}
          onClose={closeModal}
          onUpdate={fetchTrainings}
        />
      )}
      {isAdmin && modalOpen && modalType === "delete" && selectedTraining && (
        <DeleteTrainingModal
          training={selectedTraining}
          onClose={closeModal}
          onConfirm={async () => {
            try {
              const token = localStorage.getItem("token");
              const response = await fetch(
                `http://localhost:5000/api/workouts/workouts/${selectedTraining.id}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (response.ok) {
                setTrainings(
                  trainings.filter((t) => t.id !== selectedTraining.id)
                );
                closeModal();
              }
            } catch (error) {
              console.error("Error deleting training:", error);
            }
          }}
        />
      )}

      {/* User-only view modal */}
      {!isAdmin && modalOpen && modalType === "view" && renderUserViewModal()}

      {/* Participants Modal (both admin and user can see) */}
      {participantsModalOpen && selectedTraining && (
        <ParticipantsModal
          participants={selectedTraining.participants || []}
          onClose={() => setParticipantsModalOpen(false)}
        />
      )}

      {/* Begin Workout Modal (admin only) */}
      {isAdmin && beginWorkoutModalOpen && selectedTraining && (
        <BeginWorkoutModal
          workoutId={selectedTraining.id}
          onClose={() => setBeginWorkoutModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TrainingsCalendar;
