import React, { useState, useEffect } from 'react';

const TrainingModal = ({ training, onClose, onRefresh }) => {
  const [updatedTraining, setUpdatedTraining] = useState(training);

  useEffect(() => {
    setUpdatedTraining(training);
  }, [training]);

  const handleUpdateTraining = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/workouts/${training.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedTraining)
      });

      if (response.ok) {
        onRefresh();
        onClose();
      } else {
        const data = await response.json();
        console.error(data.message || 'Error updating training');
      }
    } catch (error) {
      console.error('Error updating training:', error);
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        <div className="box">
          <h1 className="title">Edit Training</h1>
          <form onSubmit={handleUpdateTraining}>
            <div className="field">
              <label className="label">Title</label>
              <input
                className="input"
                type="text"
                value={updatedTraining.title}
                onChange={(e) => setUpdatedTraining({ ...updatedTraining, title: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label className="label">Date</label>
              <input
                className="input"
                type="date"
                value={updatedTraining.date}
                onChange={(e) => setUpdatedTraining({ ...updatedTraining, date: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label className="label">Time</label>
              <input
                className="input"
                type="time"
                value={updatedTraining.time}
                onChange={(e) => setUpdatedTraining({ ...updatedTraining, time: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label className="label">Description</label>
              <textarea
                className="textarea"
                value={updatedTraining.description}
                onChange={(e) => setUpdatedTraining({ ...updatedTraining, description: e.target.value })}
                required
              />
            </div>
            <button className="button is-primary" type="submit">Update Training</button>
          </form>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
    </div>
  );
};

export default TrainingModal;