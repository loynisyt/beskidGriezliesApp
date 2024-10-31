// src/components/AdminPanel/AdminPanel.js
import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
    const [players, setPlayers] = useState([]);
    const [newPlayer, setNewPlayer] = useState({ name: '', position: '' });
    const [newWorkout, setNewWorkout] = useState({ title: '', date: '', description: '' });

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        // Fetch players from your API
        // setPlayers(fetchedPlayers);
    };

    const handleAddPlayer = async (e) => {
        e.preventDefault();
        // Add new player logic
        // After adding, fetch players again
        fetchPlayers();
    };

    const handleEditPlayer = async (id, updatedData) => {
        // Edit player logic
        // After editing, fetch players again
        fetchPlayers();
    };

    const handleAddWorkout = async (e) => {
        e.preventDefault();
        // Add new workout logic
    };

    return (
        <div className="container">
            <h2 className="title is-2">Admin Panel</h2>
            
            <div className="columns">
                <div className="column">
                    <h3 className="title is-4">Players</h3>
                    <form onSubmit={handleAddPlayer}>
                        <div className="field">
                            <input
                                className="input"
                                type="text"
                                placeholder="Name"
                                value={newPlayer.name}
                                onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                            />
                        </div>
                        <div className="field">
                            <input
                                className="input"
                                type="text"
                                placeholder="Position"
                                value={newPlayer.position}
                                onChange={(e) => setNewPlayer({...newPlayer, position: e.target.value})}
                            />
                        </div>
                        <button className="button is-primary" type="submit">Add Player</button>
                    </form>
                    
                    <table className="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Position</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map(player => (
                                <tr key={player.id}>
                                    <td>{player.name}</td>
                                    <td>{player.position}</td>
                                    <td>
                                        <button className="button is-small is-info" onClick={() => handleEditPlayer(player.id)}>Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="column">
                    <h3 className="title is-4">Create Workout</h3>
                    <form onSubmit={handleAddWorkout}>
                        <div className="field">
                            <input
                                className="input"
                                type="text"
                                placeholder="Title"
                                value={newWorkout.title}
                                onChange={(e) => setNewWorkout({...newWorkout, title: e.target.value})}
                            />
                        </div>
                        <div className="field">
                            <input
                                className="input"
                                type="date"
                                value={newWorkout.date}
                                onChange={(e) => setNewWorkout({...newWorkout, date: e.target.value})}
                            />
                        </div>
                        <div className="field">
                            <textarea
                                className="textarea"
                                placeholder="Description"
                                value={newWorkout.description}
                                onChange={(e) => setNewWorkout({...newWorkout, description: e.target.value})}
                            ></textarea>
                        </div>
                        <button className="button is-primary" type="submit">Create Workout</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;