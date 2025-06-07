import React, { useState } from "react";

const UsernameOrEmailForm = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() && !email.trim()) {
      setError("Please enter at least a username or an email.");
      return;
    }

    onSubmit({ username: username.trim(), email: email.trim() });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="notification is-danger">{error}</p>}
      <div className="field">
        <label className="label">Username</label>
        <div className="control">
          <input
            className="input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Email</label>
        <div className="control">
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
      </div>
      <div className="field">
        <div className="control">
          <button className="button is-primary" type="submit">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default UsernameOrEmailForm;
