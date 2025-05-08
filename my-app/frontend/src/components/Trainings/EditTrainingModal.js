// src/components/Trainings/EditTrainingModal.js
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import ReactQuill styles

const EditTrainingModal = ({ training, onClose, onUpdate }) => {
    const [updatedTraining, setUpdatedTraining] = useState({
        title: '',
        date: '',
        time: '',
        description_html: '', // Change to description_html
        season: 1, // Default season 1
    });

    useEffect(() => {
        if (training) {
            setUpdatedTraining({
                title: training.title,
                date: training.date.split('T')[0], // Format date for input
                time: training.time,
                description_html: training.description_html, // Change to description_html
                season: training.season || 1,
            });
        }
    }, [training]);

    const handleUpdateTraining = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/workouts/workouts/${training.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title: updatedTraining.title,
                    date: updatedTraining.date,
                    time: updatedTraining.time,
                    description_html: updatedTraining.description_html, // Ensure this matches the backend
                    season: updatedTraining.season,
                })
            });

            if (response.ok) {
                onUpdate();
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
                    <h1 className="title">{training ? 'Edit Training' : 'Create Training'}</h1>
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
                                min="07:00"
                                max="22:00"
                                value={updatedTraining.time}
                                onChange={(e) => setUpdatedTraining({ ...updatedTraining, time: e.target.value })}
                                required
                            />
                        </div>
                        <div className="field">
                            <label className="label">Season</label>
                            <div className="control">
                                <div className="select">
                                    <select
                                        value={updatedTraining.season}
                                        onChange={(e) => setUpdatedTraining({ ...updatedTraining, season: parseInt(e.target.value) })}
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
                            <label className="label">Description</label>
                            <ReactQuill
                                className="react-quill"
                                value={updatedTraining.description_html}
                                onChange={(description_html) => setUpdatedTraining({ ...updatedTraining, description_html })}
                                required
                            />
                        </div>

                        <button className="button is-primary" type="submit">Save Training</button>
                    </form>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
        </div>
    );
};

export default EditTrainingModal;
