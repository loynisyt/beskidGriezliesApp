import React, { useState } from "react";

const VerifySmsCode = ({ username, onVerified }) => {
  const [code, setCode] = useState("");
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
        "http://localhost:5000/api/auth/password-reset/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, token: code }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to verify SMS code");
      }
      setSuccess("SMS code verified successfully");
      onVerified(code);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title is-2">Verify SMS Code</h2>
      {error && <p className="notification is-danger">{error}</p>}
      {success && <p className="notification is-success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="smsCode">
            SMS Code
          </label>
          <div className="control">
            <input
              id="smsCode"
              className="input"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
              Verify Code
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VerifySmsCode;
