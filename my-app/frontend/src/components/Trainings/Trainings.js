import React, { useState, useEffect, useRef } from 'react';
import DeleteTrainingModal from './DeleteTrainingModal'; // Import DeleteTrainingModal
import EditTrainingModal from './EditTrainingModal'; // Import EditTrainingModal
import AddTrainingModal from './AddTrainingModal'; // Import AddTrainingModal
import 'react-quill/dist/quill.snow.css'; // Import the styles for the editor
import ReactQuill from 'react-quill'; // Import ReactQuill
import './Trainings.css'; // Import the styles for the


const Trainings = () => {
  const [trainings, setTrainings] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')); // Get user info
  const [newTraining, setNewTraining] = useState({
    title: '',
    date: '',
    time: '',
    description_html: '', // Changed to description_html
    created_by: user.id, // Add created_by field
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false); // State for AddTrainingModal

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [trainingToEdit, setTrainingToEdit] = useState(null);
  const [trainingToDelete, setTrainingToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/workouts/workouts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    
      const data = await response.json();
      if (Array.isArray(data)) {
        setTrainings(data);
      } else {
        console.error('Expected an array of trainings, but got:', data);
        setTrainings([]);
      }
    } catch (error) {
      console.error('Error fetching trainings:', error);
      setTrainings([]); // Reset trainings on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings(); // Fetch trainings on mount
  }, []);

  

  const handleEditTraining = (training) => {
    setTrainingToEdit(training);
    setEditModalOpen(true);
  };

  

  const handleDeleteTraining = (id) => {
    setTrainingToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteTraining = async () => {
    if (trainingToDelete) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/workouts/workouts/${trainingToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setTrainings(trainings.filter(training => training.id !== trainingToDelete));
        setDeleteModalOpen(false);
      } catch (error) {
        console.error('Error deleting training:', error);
      }
    }
  };

  return (
    <div className="container">
      {loading ? (
        <p>Loading...</p>
      ) : (

        
        
        <div>
          <button className="button is-primary is-sticky mt-3"  onClick={() => setAddModalOpen(true)}>
            Add Workout
          </button>
          <h2 className="title is-2 has-text-centered my-5">Workouts List 

          

          </h2>
          
          <div className="trainings-container">
            {trainings.map((training) => (
              <div key={training.id} className="training-item mt-5">
                <div className='box'>
                  <h4 className="title is-5 has-text-weight-bold">{training.title}</h4>
                  <p className='label has-text-centered'>{training.date} at {training.time}</p>
                  <p className='label' dangerouslySetInnerHTML={{ __html: training.description_html }} /> {/* Displaying HTML content */}
                  <button onClick={() => handleEditTraining(training)} className="button is-warning">Edit</button>
                  {user.role === 'admin' && (
                    <button onClick={() => handleDeleteTraining(training.id)} className="button is-danger">Delete</button>
                  )}
                </div>
              </div>
            ))}
            {addModalOpen && (
              <AddTrainingModal
                onClose={() => setAddModalOpen(false)}
                onAdd={(newTraining) => {
                  setTrainings([...trainings, newTraining]);
                  setAddModalOpen(false);
                }}
              />
            )}
            
          </div>

          {/* Modals */}
          {editModalOpen && (
            <EditTrainingModal
              training={trainingToEdit}
              onClose={() => setEditModalOpen(false)}
              onUpdate={fetchTrainings}
            />
          )}
          {deleteModalOpen && (
            <DeleteTrainingModal
              training={trainings.find(t => t.id === trainingToDelete)}
              onClose={() => setDeleteModalOpen(false)}
              onConfirm={confirmDeleteTraining}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Trainings;
