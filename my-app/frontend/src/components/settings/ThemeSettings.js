import React, { useState, useEffect } from "react";

const ThemeSettings = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  useEffect(() => {
    document.body.classList.remove("light-mode", "dark-mode");
    if (theme === "dark") document.body.classList.add("dark-mode");
    if (theme === "light") document.body.classList.add("light-mode");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div>
      <h2 className="title is-4">App Color Theme</h2>
      <div className="theme-switch">
        <span
          className={`theme-switch-label${theme === "light" ? " selected" : ""}`}
          onClick={() => setTheme("light")}
        >
          Jasny
        </span>
        <span
          className={`theme-switch-label${theme === "system" ? " selected" : ""}`}
          onClick={() => setTheme("system")}
        >
          System
        </span>
        <span
          className={`theme-switch-label${theme === "dark" ? " selected" : ""}`}
          onClick={() => setTheme("dark")}
        >
          Ciemny
        </span>
      </div>
    </div>
  );
};

export default ThemeSettings;


