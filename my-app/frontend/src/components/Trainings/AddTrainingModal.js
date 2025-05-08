import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import ReactQuill styles

const AddTrainingModal = ({ onClose, onAdd }) => {
    const [newTraining, setNewTraining] = useState({
        title: '',
        date: '',
        time: '',
        description_html: '', // Changed to description_html
        season: 1, // Default season 1
    });
    const quillRef = useRef(null);

    const handleAddTraining = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user')); // Get user info
        const createdBy = user ? user.id : null; // Get the user ID

        if (!createdBy) {
            console.error('User ID is not available');
            return; // Exit if user ID is not available
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/workouts/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...newTraining,
                    created_by: createdBy, // Include created_by in the request
                }),
            });
            const data = await response.json();
            if (response.ok) {
                onAdd(data); // Pass the new training data back to the parent
                onClose(); // Close the modal
                setNewTraining({ title: '', date: '', time: '', description_html: '', season: 1 }); // Reset form
            } else {
                console.error(data.message || 'Error adding training');
            }
        } catch (error) {
            console.error('Error adding training:', error);
        }
    };

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-content">
                <div className="box">
                    <h3 className="title is-4 has-text-centered">Create New Training</h3>
                    <form onSubmit={handleAddTraining}>
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
                                min="07:00"
                                max="22:00"
                                value={newTraining.time}
                                onChange={(e) => setNewTraining({ ...newTraining, time: e.target.value })}
                                required
                            />
                        </div>
                        <div className="field">
                            <label className="label">Season</label>
                            <div className="control">
                                <div className="select">
                                    <select
                                        value={newTraining.season}
                                        onChange={(e) => setNewTraining({ ...newTraining, season: parseInt(e.target.value) })}
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
                                ref={quillRef}
                                value={newTraining.description_html}
                                onChange={(description_html) => setNewTraining({ ...newTraining, description_html })}
                                theme="snow"
                            />
                        </div>
                        <button type="submit" className="button is-primary is-fullwidth">Add Workout</button>
                    </form>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
        </div>
    );
};

export default AddTrainingModal;
