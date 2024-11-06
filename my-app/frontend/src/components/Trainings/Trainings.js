// src/components/Trainings/Trainings.js
import React, { useEffect, useState } from 'react';
import TrainingModal from './TrainingModal';
import './Trainings.css';

const Trainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [participatedWorkouts, setParticipatedWorkouts] = useState([]);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    // Fetch trainings from your API
    // For now, we'll use example data
    const exampleTrainings = [
      { id: 1, name: 'Morning Practice', date: '2023-06-15', time: '08:00', description: 'Focus on shooting drills' },
      { id: 2, name: 'Evening Scrimmage', date: '2023-06-16', time: '18:00', description: 'Full court scrimmage' },
    ];
    setTrainings(exampleTrainings);
  };

  const openModal = (training) => {
    setSelectedTraining(training);
    setModalOpen(true);
  };

  const handleAttendance = (trainingId) => {
    // Here you would typically make an API call to record attendance
    setParticipatedWorkouts([...participatedWorkouts, trainingId]);
    setModalOpen(false);
  };

  return (
    <div className="container">
      <h2 className="title is-2 has-text-centered my-5">Trainings</h2>
      <div className="columns is-multiline">
        {trainings.map(training => (
          <div key={training.id} className="column is-half">
            <div className={`box has-background-primary-light ${participatedWorkouts.includes(training.id) ? 'participated' : ''}`}>
              <article className="media">
                <div className="media-left">
                  <figure className="image is-64x64">
                    <img src="/path-to-basketball-icon.png" alt="Basketball icon" />
                  </figure>
                </div>
                <div className="media-content">
                  <div className="content">
                    <p>
                      <strong>{training.name}</strong> 
                      <br />
                      <small>{training.date} at {training.time}</small>
                      <br />
                      {training.description}
                    </p>
                  </div>
                  <nav className="level is-mobile">
                    <div className="level-left">
                      <button 
                        className={`button ${participatedWorkouts.includes(training.id) ? 'is-success' : 'is-info'}`} 
                        onClick={() => openModal(training)}
                      >
                        {participatedWorkouts.includes(training.id) ? 'Participated' : 'Participate'}
                      </button>
                    </div>
                  </nav>
                </div>
              </article>
            </div>
          </div>
        ))}
      </div>
      <TrainingModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={() => handleAttendance(selectedTraining?.id)} 
        training={selectedTraining}
      />
    </div>
  );
};

export default Trainings;