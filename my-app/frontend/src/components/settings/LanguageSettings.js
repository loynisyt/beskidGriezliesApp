import React, { useState } from "react";

const LANGS = [
  { code: "pl", label: "Polski" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
];

const LanguageSettings = () => {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "pl");

  const handleLang = (code) => {
    setLang(code);
    localStorage.setItem("lang", code);
    window.location.reload();
  };

  return (
    <div>
      <h2 className="title is-4">Język aplikacji</h2>
      <div className="language-switch">
        {LANGS.map((l) => (
          <button
            key={l.code}
            className={`language-btn${lang === l.code ? " selected" : ""}`}
            onClick={() => handleLang(l.code)}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSettings;
