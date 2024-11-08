// src/components/Trainings/DeleteTrainingModal.js
import React from 'react';

const DeleteTrainingModal = ({ training, onClose, onConfirm }) => {
    if (!training) return null;

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-content">
                <div className="box">
                    <h1 className="title">Delete Training</h1>
                    <p>Are you sure you want to delete the training <strong>{training.title}</strong>?</p>
                    <div className="buttons">
                        <button className="button is-danger" onClick={onConfirm}>Delete</button>
                        <button className="button" onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
        </div>
    );
};

export default DeleteTrainingModal;