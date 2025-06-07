import React, { useState } from "react";
import TwoFactorSettings from "./TwoFactorSettings";
import ThemeSettings from "./ThemeSettings";
import LanguageSettings from "./LanguageSettings";
import NotificationSettings from "./NotificationSettings";
import HelpAndSupport from "./HelpAndSupport";
import PrivacyAndSecurity from "./PrivacyAndSecurity";
import AboutApp from "./AboutApp";
import "./SettingsModal.css";

const SettingsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("general");
  const [hiding, setHiding] = useState(false);

  if (!isOpen && !hiding) return null;

  const handleClose = () => {
    setHiding(true);
    setTimeout(() => {
      setHiding(false);
      onClose();
    }, 350);
  };

  return (
    <div
      className={`settings-modal-overlay${hiding ? " hide" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`settings-modal-panel${hiding ? " hide" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>
        <nav className="settings-nav">
          <ul>
            <li
              onClick={() => setActiveTab("general")}
              className={activeTab === "general" ? "active" : ""}
            >
              Ogolne
            </li>
            <li
              onClick={() => setActiveTab("2fa")}
              className={activeTab === "2fa" ? "active" : ""}
            >
              Weryfikacja dwuetapowa
            </li>
            <li
              onClick={() => setActiveTab("theme")}
              className={activeTab === "theme" ? "active" : ""}
            >
              Tlo
            </li>
            <li
              onClick={() => setActiveTab("language")}
              className={activeTab === "language" ? "active" : ""}
            >
              Jezyk
            </li>
            <li
              onClick={() => setActiveTab("notifications")}
              className={activeTab === "notifications" ? "active" : ""}
            >
              powiadomienia
            </li>
            <li
              onClick={() => setActiveTab("privacy")}
              className={activeTab === "privacy" ? "active" : ""}
            >
              prywatność i bezpieczeństwo
            </li>
            <li
              onClick={() => setActiveTab("help")}
              className={activeTab === "help" ? "active" : ""}
            >
              wsparcie i pomoc
            </li>
            <li
              onClick={() => setActiveTab("about")}
              className={activeTab === "about" ? "active" : ""}
            >
              O nas
            </li>
          </ul>
        </nav>
        <div className="settings-content">
          {activeTab === "general" && (
            <div>
              <h2>General Settings</h2>
            </div>
          )}
          {activeTab === "2fa" && <TwoFactorSettings />}
          {activeTab === "theme" && <ThemeSettings />}
          {activeTab === "language" && <LanguageSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "privacy" && <PrivacyAndSecurity />}
          {activeTab === "help" && <HelpAndSupport />}
          {activeTab === "about" && <AboutApp />}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
