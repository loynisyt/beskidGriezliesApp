import React, { useState } from "react";

const NotificationSettings = () => {
  const [allowed, setAllowed] = useState(Notification.permission === "granted");

  const handleAllow = async () => {
    if (Notification.permission !== "granted") {
      const perm = await Notification.requestPermission();
      setAllowed(perm === "granted");
    }
  };

  return (
    <div>
      <h2 className="title is-4">Notifications</h2>
      <div className="field">
        <label className="checkbox">
          <input type="checkbox" checked={allowed} onChange={handleAllow} />
          &nbsp;Zezwól na powiadomienia
        </label>
      </div>
    </div>
  );
};

export default NotificationSettings;
