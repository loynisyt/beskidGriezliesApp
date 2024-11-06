// src/components/AdminPanel/DeleteUserModal.js
import React from 'react';

const DeleteUserModal = ({ isOpen, onClose, onConfirm, username }) => {
  if (!isOpen) return null;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        <div className="box">
          <h1 className="title">Potwierdź usunięcie użytkownika</h1>
          <p>Czy na pewno chcesz usunąć użytkownika <strong>{username}</strong>?</p>
          <p>Ta akcja jest nieodwracalna.</p>
          <div className="buttons">
            <button className="button is-danger" onClick={onConfirm}>
              Usuń
            </button>
            <button className="button" onClick={onClose}>
              Anuluj
            </button>
          </div>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
    </div>
  );
};

export default DeleteUserModal;