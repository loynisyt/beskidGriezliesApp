import React, { useState } from "react";

const HelpAndSupport = () => {
  const [form, setForm] = useState({ from: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSent(false);
    try {
      const res = await fetch("http://localhost:5000/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ from: "", subject: "", message: "" });
      } else {
        setError("Wystąpił błąd podczas wysyłania zgłoszenia.");
      }
    } catch {
      setError("Wystąpił błąd podczas wysyłania zgłoszenia.");
    }
  };

  return (
    <div>
      <h2 className="title is-4">Pomoc i wsparcie</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Mail</label>
          <div className="control">
            <input
              className="input"
              name="from"
              placeholder="mail"
              value={form.from}
              type="email"
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Temat</label>
          <div className="control">
            <input
              className="input"
              name="subject"
              placeholder="Temat"
              value={form.subject}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Wiadomość</label>
          <div className="control">
            <textarea
              className="textarea"
              name="message"
              placeholder="Opisz swój problem..."
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button className="button is-primary" type="submit">
          Wyślij
        </button>
      </form>
      {sent && (
        <p className="notification is-success mt-3">
          Zgłoszenie zostało wysłane!
        </p>
      )}
      {error && <p className="notification is-danger mt-3">{error}</p>}
    </div>
  );
};

export default HelpAndSupport;
