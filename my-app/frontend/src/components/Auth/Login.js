import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordReset from "./PasswordReset";
import RequestResetToken from "./RequestResetToken";
import "./Auth.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("login"); // 'login', 'twoFactor', 'changePassword', 'sendCode'
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const body = { username, password };
      if (mode === "twoFactor") {
        body.twoFactorToken = twoFactorCode;
      }

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.twoFactorRequired) {
        setMode("twoFactor");
        setIsLoading(false);
        return;
      }

      if (data.user && data.token) {
        // Store token
        localStorage.setItem("token", data.token);
        // Store user data
        localStorage.setItem("user", JSON.stringify(data.user));
        //delete old tokens
        localStorage.removeItem("oldToken");

        // Update app state
        onLogin(data.user);
        // Redirect to home
        navigate("/home");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      {mode === "login" && (
        <>
          <div className="columns is-centered">
            <div className="column is-half">
              <h2 className="title is-2">Login</h2>
              {error && <p className="notification is-danger">{error}</p>}
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
                  <label className="label" htmlFor="password">
                    Password
                  </label>
                  <div className="control">
                    <input
                      id="password"
                      className="input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <button
                      className={`button is-primary ${
                        isLoading ? "is-loading" : ""
                      }`}
                      type="submit"
                      disabled={isLoading}
                    >
                      Login
                    </button>

                    <button
                      type="button"
                      className="button is-link is-light"
                      onClick={() => setMode("changePassword")}
                    >
                      Change Password
                    </button>

                    <button
                      type="button"
                      className="button is-link is-light"
                      onClick={() => setMode("sendCode")}
                    >
                      I forgot password
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
      {mode === "twoFactor" && (
        <div className="columns is-centered">
          <div className="column is-half">
            <h2 className="title is-2">Two-Factor Authentication</h2>
            {error && <p className="notification is-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">Enter 2FA Code</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button
                    className={`button is-primary ${
                      isLoading ? "is-loading" : ""
                    }`}
                    type="submit"
                    disabled={isLoading}
                  >
                    Verify
                  </button>
                  <button
                    className="button is-light"
                    type="button"
                    onClick={() => setMode("login")}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {mode === "changePassword" && (
        <PasswordReset onCancel={() => setMode("login")} />
      )}
      {mode === "sendCode" && <RequestResetToken />}
    </div>
  );
};

export default Login;
