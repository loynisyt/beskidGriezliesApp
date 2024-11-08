import React, { useEffect, useState } from 'react';
import './Trainings.css';
import ParticipantsModal from './ParticipantsModal';
import DeleteTrainingModal from './DeleteTrainingModal'; // Import the delete modal

const Trainings = ({ user }) => {
    const [trainings, setTrainings] = useState([]);
    const [newTraining, setNewTraining] = useState({
        title: '',
        date: '',
        time: '',
        description: ''
    });
    const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [currentParticipants, setCurrentParticipants] = useState([]);
    const [trainingToDelete, setTrainingToDelete] = useState(null);
    const [userParticipating, setUserParticipating] = useState({}); // Track user participation

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/workouts', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                const trainingsWithParticipants = await Promise.all(data.map(async (training) => {
                    const participants = await fetchParticipants(training.id); // Fetch participants
                    return { ...training, participants }; // Add participants to training
                }));
                setTrainings(trainingsWithParticipants);
            } else {
                console.error('Expected an array but got:', data);
                setTrainings([]);
            }
        } catch (error) {
            console.error('Error fetching trainings:', error);
        }
    };

    const fetchParticipants = async (trainingId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/workouts/${trainingId}/participants`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json(); // Return participants
        } catch (error) {
            console.error('Error fetching participants:', error);
            return []; // Return an empty array if there's an error
        }
    };

    const handleAddTraining = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/workouts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newTraining)
            });

            if (response.ok) {
                setNewTraining({
                    title: '',
                    date: '',
                    time: '',
                    description: ''
                });
                fetchTrainings(); // Refresh the trainings list
            } else {
                const data = await response.json();
                console.error(data.message || 'Error creating training');
            }
        } catch (error) {
            console.error('Error creating training:', error);
        }
    };

    const handleParticipate = async (trainingId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/workouts/${trainingId}/participate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setUserParticipating(prev => ({ ...prev, [trainingId]: true })); // Update participation status
                alert('Successfully joined the training!');
                fetchTrainings(); // Refresh the trainings list
            } else {
                const data = await response.json();
                console.error(data.message || 'Error joining training');
            }
        } catch (error) {
            console.error('Error joining training:', error);
        }
    };

    const handleUnparticipate = async (trainingId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/workouts/${trainingId}/unparticipate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setUserParticipating(prev => ({ ...prev, [trainingId]: false })); // Update participation status
                alert('Successfully left the training!');
                fetchTrainings(); // Refresh the trainings list
            } else {
                const data = await response.json();
                console.error(data.message || 'Error leaving training');
            }
        } catch (error) {
            console.error('Error leaving training:', error);
        }
    };

    const handleDeleteTraining = async (trainingId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/workouts/${trainingId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                fetchTrainings(); // Refresh the trainings list after deletion
                setDeleteModalOpen(false); // Close the delete modal
            } else {
                const data = await response.json();
                console.error(data.message || 'Error deleting training');
            }
        } catch (error) {
            console.error('Error deleting training:', error);
        }
    };

    const handleShowParticipants = (participants) => {
        setCurrentParticipants(participants);
        setParticipantsModalOpen(true);
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString(undefined, options);
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return { formattedDate, formattedTime };
    };

    return (
        <div className="container">
            <h2 className="title is-2 has-text-centered my-5">Manage Trainings</h2>

            <div className="trainings-container">
                {user.role === 'admin' && (
                    <form onSubmit={handleAddTraining} className="training-form">
                        <h3 className="title is-4">Create New Training</h3>
                        <div className="field">
                            <label className="label">Title</label>
                            <input
                                className="input"
                                type="text"
                                value={newTraining.title}
                                onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="field">
                            <label className="label">Date</label>
                            <input
                                className="input"
                                type="date"
                                value={newTraining.date}
                                onChange={(e) => setNewTraining({ ...newTraining, date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="field">
                            <label className="label">Time</label>
                            <input
                                className="input"
                                type="time"
                                value={newTraining.time}
                                onChange={(e) => setNewTraining({ ...newTraining, time: e.target.value })}
                                required
                            />
                        </div>
                        <div className="field">
                            <label className="label">Description</label>
                            <textarea
                                className="textarea"
                                value={newTraining.description}
                                onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })}
                                required
                            />
                        </div>
                        <button className="button is-primary" type="submit">Create Training</button>
                    </form>
                )}

                <div className="trainings-list">
                    < h3 className="title is-4">Available Trainings</h3>
                    {trainings.map(training => {
                        const { formattedDate, formattedTime } = formatDateTime(training.date);
                        const isParticipating = userParticipating[training.id] || false; // Check if user is participating
                        return (
                            <div key={training.id} className="training-item">
                                <h4 className="title is-5">{training.title}</h4>
                                <p>{training.description}</p>
                                <div className="date-time-block" style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                                    <p>{formattedDate}</p>
                                    <p>{formattedTime}</p>
                                </div>
                                <br></br>
                                <button className="button is-success" onClick={() => isParticipating ? handleUnparticipate(training.id) : handleParticipate(training.id)}>
                                    {isParticipating ? 'Unparticipate' : 'Participate'}
                                </button>
                                <button className="button is-info" onClick={() => handleShowParticipants(training.participants)}>Show Participants</button>
                                {user.role === 'admin' && (
                                    <button className="button is-danger" onClick={() => { setTrainingToDelete(training); setDeleteModalOpen(true); }}>Delete Training</button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {participantsModalOpen && (
                <ParticipantsModal participants={currentParticipants} onClose={() => setParticipantsModalOpen(false)} />
            )}

            {deleteModalOpen && (
                <DeleteTrainingModal 
                    training={trainingToDelete} 
                    onClose={() => setDeleteModalOpen(false)} 
                    onConfirm={() => handleDeleteTraining(trainingToDelete.id)} 
                />
            )}
        </div>
    );
};

export default Trainings;