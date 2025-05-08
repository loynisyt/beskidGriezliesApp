import React, { useState } from "react";
import "./Form.css"; // Import your CSS file for styling
import axios from "axios"; // Import axios for making HTTP requests
import AggreModal from "./AggreModal"; // Import the modal component

const Form = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jerseyNumber: "",
    jerseyTitle: "",
    positions: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const positions = ["PG", "SG", "SF", "PF", "C"]; // All five positions

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePositionChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions).map((option) => option.value);

    if (selectedValues.length <= 2) {
      setFormData({ ...formData, positions: selectedValues });
    } else {
      alert("You can select a maximum of 2 positions.");
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/email/send-email", formData);
      if (response.status === 200) {

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          jerseyNumber: "",
          jerseyTitle: "",
          positions: [],
        });
      }
    } 
    

    
    catch (error) {
      console.error("Error submitting application:", error);
        alert("An error occurred while submitting the application. Please try again later.");

    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true); // Open the modal before submitting
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false); // Close the modal
    handleSubmit(); // Proceed with form submission
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal without submitting
    // render div with the message "You have to accept the terms and conditions"

  };

  return (
    <div className="container mt-6">
      <div className="box">
     

        <h1 className="title has-text-centered">Zgłoszenie do drużyny</h1>
        <form onSubmit={handleFormSubmit}>
          <div className="field">
            <label className="label">Imię</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                pattern="[A-Za-z]{2,}" // Example pattern for first name validation
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Nazwisko</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                pattern="[A-Za-z]{2,}" // Example pattern for last name validation
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Mail</label>
            <div className="control">
              <input
                className="input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" // Example pattern for email validation
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Nr telefonu</label>
            <div className="control">
              <input
                className="input"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{3}* [0-9]{3}* [0-9]{3}" // Example pattern for phone number
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Numer koszulki (opcjonalne) </label>
            <div className="control">
              <input
                className="input"
                type="number"
                name="jerseyNumber"
                value={formData.jerseyNumber}
                onChange={handleChange}
                min="0"
                max="99" // Assuming jersey numbers are between 0 and 99
              />
            </div>
          </div>



          <div className="field">
            <label className="label">Napis na koszulke (opcjonalne) </label>
            <div className="control">
              <input
                className="input"
                type="number"
                name="jerseyTitle"
                value={formData.jerseyTitle}
                onChange={handleChange}
                pattern="[A-Za-z]{2,}" // Example pattern for last name validation

             
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Pozycja (max 2)</label>
            <div className="control">
              <div className="select is-multiple">
                <select
                  multiple
                  size="5"
                  value={formData.positions}
                  onChange={handlePositionChange}
                >
                  {positions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <div className="control">
              <button type="submit" className="button is-primary">
                Wyślij
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal */}
      <AggreModal isOpen={isModalOpen} onClose={handleModalClose} onConfirm={handleModalConfirm} />
    </div>
  );
};

export default Form;