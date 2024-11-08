// src/components/Trainings/ParticipantsModal.js
import React from 'react';

const ParticipantsModal = ({ participants, onClose }) => {
    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-content">
                <div className="box">
                    <h1 className="title">Participants</h1>
                    <ul>
                        {participants.map((participant, index) => (
                            <li key={index}>{participant.username}</li>
                        ))}
                    </ul>
                    <p>Total Participants: {participants.length}</p>
                    <div className="buttons">
                        <button className="button" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
        </div>
    );
};

export default ParticipantsModal;