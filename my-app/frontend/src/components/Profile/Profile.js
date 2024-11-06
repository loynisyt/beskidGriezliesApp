import React, { useState, useEffect, useCallback } from 'react';
import './Profile.css';

const Profile = ({ user }) => {
  const [editableUser, setEditableUser] = useState({
    fullName: '',
    position: '',
    height: '',
    weight: '',
    email: '',
    phone: '',
    jerseyNumber: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/profile/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setEditableUser(data);
    } catch (error) {
      setMessage('Error loading profile: ' + error.message);
    }
  }, [user.id]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser({ ...editableUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editableUser)
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setMessage('Error updating profile');
      }
    } catch (error) {
      setMessage('Error updating profile');
    }
  };

  return (
    <div className="profile-container">
      <div className="box m-6">
        <h2 className="title is-2">Your Profile</h2>
        {message && (
          <div className={`notification ${message.includes('Error') ? 'is-danger' : 'is-success'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="columns">
            <div className="column is-half">
              <div className="field">
                <label className="label">Full Name</label>
                <div className="control">
                  <input
                    className="input"
                    name="fullName"
                    value={editableUser.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Position</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      name="position"
                      value={editableUser.position}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    >
                      <option value="">Select position</option>
                      <option value="Point Guard">Point Guard</option>
                      <option value="Shooting Guard">Shooting Guard</option>
                      <option value="Small Forward">Small Forward</option>
                      <option value="Power Forward">Power Forward</option>
                      <option value="Center">Center</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="field">
                <label className="label">Jersey Number</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    name="jerseyNumber"
                    value={editableUser.jerseyNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    min="0"
                    max="99"
                  />
                </div>
              </div>
            </div>

            <div className="column is-half">
              <div className="field">
                <label className="label">Height (cm)</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    name="height"
                    value={editableUser.height}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Weight (kg)</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    name="weight"
                    value={editableUser.weight}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input
                    className="input"
                    type="email"
                    name="email"
                    value={editableUser.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Phone</label>
                <div className="control">
                  <input
                    className="input"
                    type="tel"
                    name="phone"
                    value={editableUser.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="field is-grouped is-grouped-right">
            <div className="control">
              {!isEditing ? (
                <button
                  type="button"
                  className="button is-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button type="submit" className="button is-success mr-2">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="button is-danger"
                    onClick={() => {
                      setIsEditing(false);
                      fetchUserProfile();
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;