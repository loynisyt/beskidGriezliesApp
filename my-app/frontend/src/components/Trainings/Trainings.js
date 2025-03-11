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

  const [sortOption, setSortOption] = useState('lastModified'); // State for sorting option

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

  const formatDateTime = (dateString) => {
    const date = new Date(`${dateString}T${time}`); // Combine date and time for correct parsing



    if (isNaN(date)) {
      console.error('Invalid date:', dateString);
      return 'Invalid Date';
    }
    const formattedDate = date.toLocaleDateString('en-GB'); // Format as DD.MM.YYYY
    const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format as HH:MM with AM/PM

    return `${formattedDate} ${formattedTime}`;
  };

  const sortedTrainings = [...trainings].sort((a, b) => {

    switch (sortOption) {
      case 'lastModified':
        return new Date(b.updatedAt) - new Date(a.updatedAt); // Assuming updatedAt is the last modified date
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'upcoming':
        return new Date(a.date) - new Date(b.date); // Sort by upcoming date
      default:
        return 0;
    }
  }).filter(training => new Date(training.date) >= new Date()); // Filter out past workouts

  return (
    <div className="container">
      <div className="field">
        <label className="label">Sort By:</label>
        <div className="control">
          <div className="select">
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="lastModified">Last Modified</option>
              <option value="newest">Date: Newest</option>
              <option value="oldest">Date: Oldest</option>
              <option value="title">Title</option>
              <option value="upcoming">First Upcoming</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <button className="button is-primary is-sticky mt-3" onClick={() => setAddModalOpen(true)}>
            Add Workout
          </button>
          <h2 className="title is-2 has-text-centered my-5">Workouts List</h2>
          <div className="trainings-container">
            {sortedTrainings.map((training) => (
              <div key={training.id} className="training-item mt-5">
                <div className='box'>
                  <h4 className="title is-5 has-text-weight-bold">{training.title}</h4>
                  <p className='label has-text-centered'>{formatDateTime(training.date, training.time)}</p>



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
