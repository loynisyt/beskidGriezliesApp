import React, { useState } from "react";

const RequestResetToken = () => {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [method, setMethod] = useState("");

  const backendUrl = "http://localhost:5000/api/users/password-reset";

  const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    const maskedName =
      name.length > 2 ? name[0] + "***" + name[name.length - 1] : name;
    return maskedName + "@" + domain;
  };

  const requestToken = async (selectedMethod) => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    setMethod(selectedMethod);

    try {
      const response = await fetch(`${backendUrl}/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, method: selectedMethod }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to request reset token");
      }
      const contactInfo =
        selectedMethod === "email" ? maskEmail(data.contact) : data.contact;
      setSuccess(
        `A token has been sent to your ${selectedMethod}. Contact: ${contactInfo}`
      );
      setShowResetForm(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (newPassword !== confirmPassword) {
      setResetError("New password and confirm password do not match");
      return;
    }

    setResetLoading(true);
    try {
      const response = await fetch(`${backendUrl}/change-with-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          token: verificationCode,
          newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }
      setResetSuccess("Password changed successfully");
      // Optionally reset form or redirect user here
    } catch (err) {
      setResetError(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title is-2">Request Password Reset Token</h2>
      {error && <p className="notification is-danger">{error}</p>}
      {success && <p className="notification is-success">{success}</p>}

      {!showResetForm && (
        <>
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              style={{ width: "40%", padding: "1rem", fontSize: "1.25rem" }}
              className={`button is-primary ${
                isLoading && method === "email" ? "is-loading" : ""
              }`}
              onClick={() => requestToken("email")}
              disabled={isLoading}
            >
              Send via Email
            </button>
            <button
              style={{ width: "40%", padding: "1rem", fontSize: "1.25rem" }}
              className={`button is-link ${
                isLoading && method === "sms" ? "is-loading" : ""
              }`}
              onClick={() => requestToken("sms")}
              disabled={isLoading}
            >
              Send via SMS
            </button>
          </div>
          <div className="field" style={{ marginTop: "1rem" }}>
            <label className="label">Username</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
        </>
      )}

      {showResetForm && (
        <form onSubmit={handleResetSubmit}>
          <h2 className="title is-2">Reset Password</h2>
          {resetError && <p className="notification is-danger">{resetError}</p>}
          {resetSuccess && (
            <p className="notification is-success">{resetSuccess}</p>
          )}

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
          {(method === "email" || method === "sms") && (
            <div className="field">
              <label className="label" htmlFor="verificationCode">
                Verification Code
              </label>
              <div className="control">
                <input
                  id="verificationCode"
                  className="input"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          <div className="field">
            <div className="control">
              <button
                className={`button is-primary ${
                  resetLoading ? "is-loading" : ""
                }`}
                type="submit"
                disabled={resetLoading}
              >
                Change Password
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default RequestResetToken;
