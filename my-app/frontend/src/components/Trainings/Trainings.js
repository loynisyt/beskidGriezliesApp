import React, { useEffect, useState } from 'react';
import TrainingModal from './TrainingModal';
import './Trainings.css';

const Trainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    // Przykładowe dane - tutaj powinno być API
    const exampleTrainings = [
      { id: 1, name: 'Trening 1', date: '2024-10-15' },
      { id: 2, name: 'Trening 2', date: '2024-10-20' },
    ];
    setTrainings(exampleTrainings);
  };

  const openModal = (training) => {
    setSelectedTraining(training);
    setModalOpen(true);
  };

  const handleAttendance = () => {
    // Logika do zaznaczania obecności
    alert(`Zaznaczyłeś obecność na treningu ${selectedTraining.name}`);
    setModalOpen(false);
  };

  return (
    <div className="trainings-container">
      <h2>Treningi</h2>
      <ul>
        {trainings.map(training => (
          <li key={training.id}>
            {training.name} - {training.date}
            <button className="button is-small is-info" onClick={() => openModal(training)}>
              Wezmę udział
            </button>
          </li>
        ))}
      </ul>
      <TrainingModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={handleAttendance} 
      />
    </div>
  );
};

export default Trainings;
