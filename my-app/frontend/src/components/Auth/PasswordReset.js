import React, { useState } from "react";

const PasswordReset = ({ onCancel }) => {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    setIsLoading(true);
    try {
      // Call API to change password with old password verification
      const response = await fetch(
        "http://localhost:5000/api/users/password-reset/change",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, oldPassword, newPassword }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }
      setSuccess("Password changed successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title is-2">Change Password</h2>
      {error && <p className="notification is-danger">{error}</p>}
      {success && <p className="notification is-success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="username">
            Username
          </label>
          <div className="control">
            <input
              id="username"
              className="input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="oldPassword">
            Old Password
          </label>
          <div className="control">
            <input
              id="oldPassword"
              className="input"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="newPassword">
            New Password
          </label>
          <div className="control">
            <input
              id="newPassword"
              className="input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <div className="control">
            <input
              id="confirmPassword"
              className="input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button
              className={`button is-primary ${isLoading ? "is-loading" : ""}`}
              type="submit"
              disabled={isLoading}
            >
              Change Password
            </button>
            <button
              className="button is-light"
              type="button"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PasswordReset;
