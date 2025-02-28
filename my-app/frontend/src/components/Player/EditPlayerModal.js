import React, { useState, useEffect } from 'react';

const EditPlayerModal = ({ player, onClose, onUpdate }) => {
  const [updatedPlayer, setUpdatedPlayer] = useState({
    first_name: '',
    last_name: '',
    position: '',
    height: 0,
    weight: 0,
    email: '',
    phone: '',
    jersey_number: 0,
    username: '',
    role: '', // Added role field
    password: '', // Added password field
  });

  useEffect(() => {
    if (player) {
      setUpdatedPlayer({
        first_name: player.first_name,
        last_name: player.last_name,
        position: player.position,
        height: player.height,
        weight: player.weight,
        email: player.email,
        phone: player.phone,
        jersey_number: player.jersey_number,
        username: player.username,
        role: player.role, // Ensure role is set
        password: player.password || '', // Ensure password is set
      });
    }
  }, [player]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPlayer({ ...updatedPlayer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/profile/${player.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedPlayer),
      });

      if (response.ok) {
        onUpdate(); // Refresh players data after update
        onClose(); // Close the modal
      } else {
        console.error('Error updating player data');
      }
    } catch (error) {
      console.error('Error updating player data:', error);
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        <div className="box">
          <h1 className="title">Edit Player</h1>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Username</label>
              <input
                className="input"
                name="username"
                value={updatedPlayer.username || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label className="label">Role</label>
              <div className="select">
                <select
                  name="role"
                  value={updatedPlayer.role || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="player">Player</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label className="label">First Name</label>
              <input
                className="input"
                name="first_name"
                value={updatedPlayer.first_name || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label className="label">Last Name</label>
              <input
                className="input"
                name="last_name"
                value={updatedPlayer.last_name || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label className="label">Position</label>
              <div className="select">
                <select
                  name="position"
                  value={updatedPlayer.position || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Position</option>
                  <option value="Point Guard">Point Guard</option>
                  <option value="Shooting Guard">Shooting Guard</option>
                  <option value="Small Forward">Small Forward</option>
                  <option value="Power Forward">Power Forward</option>
                  <option value="Center">Center</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label className="label">Height (cm)</label>
              <input
                className="input"
                type="number"
                name="height"
                value={updatedPlayer.height || ''}
                onChange={handleChange}
                required
                min="100" // Ensure height is a positive number
                max="250"
              />
            </div>
            <div className="field">
              <label className="label">Weight (kg)</label>
              <input
                className="input"
                type="number"
                name="weight"
                value={updatedPlayer.weight || ''}
                onChange={handleChange}
                required
                min="40" // Ensure weight is a positive number
                max="350"
              />
            </div>
            <div className="field">
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                name="email"
                value={updatedPlayer.email || ''}
                onChange={handleChange}
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" // Regex for email validation
              />
            </div>
            <div className="field">
              <label className="label">Phone</label>
              <input
                className="input"
                type="tel"
                name="phone"
                value={updatedPlayer.phone || ''}
                onChange={handleChange}
                pattern="^\d{9}$" // Regex for phone number validation (9 digits)
              />
            </div>
            <div className="field">
              <label className="label">Jersey Number</label>
              <input
                className="input"
                type="number"
                name="jersey_number"
                value={updatedPlayer.jersey_number || ''}
                onChange={handleChange}
                required
                min="0" // Ensure jersey number is between 0 and 99
                max="99"
              />
            </div>
            <input type="hidden" name="password" value={updatedPlayer.password} />
            <div className="field is-grouped is-grouped-right">
              <div className="control">
                <button type="submit" className="button is-success">Save Changes</button>
              </div>
              <div className="control">
                <button type="button" className="button is-danger" onClick={onClose}>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
    </div>
  );
};

export default EditPlayerModal;
