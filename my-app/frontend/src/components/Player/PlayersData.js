import React, { useEffect, useState } from 'react';
import EditPlayerModal from './EditPlayerModal'; // Import the EditPlayerModal
import AttendanceModal from './AttendanceModal'; // Import AttendanceModal
import './PlayersData.css'; // Assuming you will create a CSS file for styling

const PlayersData = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedPlayer, setSelectedPlayer] = useState(null); // State for selected player
  const [isEditing, setIsEditing] = useState(false); // State for editing mode
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false); // State for attendance modal

  const fetchPlayersData = async () => { // Fetch players data
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch players data');
      }
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      setError('Error loading players data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayersData();
  }, []);

  return (
    <div className="players-data-container">
      <h2 className="title is-2">Players Data</h2>
      <button className="button is-info mb-3" onClick={() => setAttendanceModalOpen(true)}>
        Show Attendance Percentage
      </button>
      {loading && <p>Loading...</p>}
      {error && <div className="notification is-danger">{error}</div>}
      {!loading && !error && (
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Position</th>
              <th>Height</th>
              <th>Weight</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Jersey Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
              <tr key={player.id}>
                <td>{player.first_name}</td>
                <td>{player.last_name}</td>
                <td>{player.position}</td>
                <td>{player.height}</td>
                <td>{player.weight}</td>
                <td>{player.email}</td>
                <td>{player.phone}</td>
                <td>{player.jersey_number}</td>
                <td>
                  <button className="button is-warning" onClick={() => {
                    setSelectedPlayer(player); // Set the selected player for editing
                    setIsEditing(true); // Enable editing mode
                  }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isEditing && selectedPlayer && ( // Show edit modal if in editing mode
        <EditPlayerModal
          player={selectedPlayer}
          onClose={() => setIsEditing(false)}
          onUpdate={fetchPlayersData} // Refresh players data after update
        />
      )}
      {attendanceModalOpen && (
        <AttendanceModal
          onClose={() => setAttendanceModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PlayersData;
