import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ user }) => {
  const [editableUser, setEditableUser] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser({ ...editableUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logika do aktualizacji profilu
    alert('Profil zaktualizowany!');
  };

  return (
    <div className="profile-container">
      <h2>Twój profil</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Imię i nazwisko</label>
          <input
            className="input"
            name="fullName"
            value={editableUser.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label className="label">Pozycja</label>
          <input
            className="input"
            name="position"
            value={editableUser.position}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label className="label">Wzrost</label>
          <input
            className="input"
            type="number"
            name="height"
            value={editableUser.height}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label className="label">Waga</label>
          <input
            className="input"
            type="number"
            name="weight"
            value={editableUser.weight}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label className="label">Opis</label>
          <textarea
            className="textarea"
            name="description"
            value={editableUser.description}
            onChange={handleChange}
            required
          />
        </div>
        <button className="button is-success" type="submit">
          Zapisz zmiany
        </button>
      </form>
    </div>
  );
};

export default Profile;
