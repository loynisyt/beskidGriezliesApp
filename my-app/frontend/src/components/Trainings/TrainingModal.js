import React from 'react';

const TrainingModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        <div className="box">
          <h1 className="title">Potwierdzenie uczestnictwa</h1>
          <p>Czy na pewno chcesz wziąć udział w tym treningu?</p>
          <div className="buttons">
            <button className="button is-success" onClick={onConfirm}>
              Tak
            </button>
            <button className="button" onClick={onClose}>
              Nie
            </button>
          </div>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
    </div>
  );
};

export default TrainingModal;
