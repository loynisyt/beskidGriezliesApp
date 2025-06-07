import React, { useState } from "react";

const ResetPasswordWithToken = ({ username, token, onPasswordChanged }) => {
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
      const response = await fetch(
        "http://localhost:5000/password-reset/change",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, token, newPassword }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }
      setSuccess("Password changed successfully");
      onPasswordChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title is-2">Reset Password</h2>
      {error && <p className="notification is-danger">{error}</p>}
      {success && <p className="notification is-success">{success}</p>}
      <form onSubmit={handleSubmit}>
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
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordWithToken;
