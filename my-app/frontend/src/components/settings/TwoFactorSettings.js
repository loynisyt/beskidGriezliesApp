import React, { useState, useEffect } from "react";

const TwoFactorSettings = () => {
  const [enabled, setEnabled] = useState(false);
  const [method, setMethod] = useState(""); // "sms" or "email"

  useEffect(() => {
    fetch("http://localhost:5000/api/users/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setEnabled(!!data.two_factor_method);
        setMethod(data.two_factor_method || "");
      });
  }, []);

  const handleEnable = async (e) => {
    const checked = e.target.checked;
    setEnabled(checked);
    if (!checked) {
      setMethod("");
      await fetch("http://localhost:5000/api/users/2fa", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ method: "" }),
      });
    }
  };

  const handleMethodChange = async (e) => {
    setMethod(e.target.value);
    await fetch("http://localhost:5000/api/users/2fa", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ method: e.target.value }),
    });
  };

  return (
    <div>
      <h2 className="title is-4">Two-Factor Authentication</h2>
      <div className="field">
        <label className="checkbox">
          <input type="checkbox" checked={enabled} onChange={handleEnable} />
          &nbsp;Wlacz Weryfikacje dwuetapową za pomocą :
        </label>
      </div>
      {enabled && (
        <div className="field">
          <label className="label">Choose method:</label>
          <div className="control">
            <label className="radio">
              <input
                type="radio"
                value="sms"
                checked={method === "sms"}
                onChange={handleMethodChange}
              />
              &nbsp;SMS
            </label>
            <label className="radio">
              <input
                type="radio"
                value="email"
                checked={method === "email"}
                onChange={handleMethodChange}
              />
              &nbsp;Email
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSettings;
