import React, { useState } from "react";

const VerifyResetToken = ({ username, onVerified }) => {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-reset-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, token }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to verify token");
      }
      setSuccess("Token verified successfully");
      onVerified(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title is-2">Verify Reset Token</h2>
      {error && <p className="notification is-danger">{error}</p>}
      {success && <p className="notification is-success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="resetToken">
            Reset Token
          </label>
          <div className="control">
            <input
              id="resetToken"
              className="input"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
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
              Verify Token
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VerifyResetToken;
