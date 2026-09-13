import { useState, useEffect } from "react";
import "./Settings.css";

const Settings = ({ isOpen, onClose, onDarkModeToggle, isDarkMode }) => {
  const [settings, setSettings] = useState({
    darkMode: isDarkMode,
    autoSave: true,
    notifications: true,
    language: "en",
  });

  useEffect(() => {
    setSettings((prev) => ({ ...prev, darkMode: isDarkMode }));
  }, [isDarkMode]);

  const handleToggle = (key) => {
    if (key === "darkMode") {
      onDarkModeToggle();
    } else {
      setSettings((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  const handleLanguageChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      language: e.target.value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="settings-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h3>Appearance</h3>
            <div className="settings-item">
              <div className="settings-item-info">
                <label>Dark Mode</label>
                <span>Toggle dark theme</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={() => handleToggle("darkMode")}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h3>Preferences</h3>
            <div className="settings-item">
              <div className="settings-item-info">
                <label>Auto Save</label>
                <span>Automatically save bill drafts</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={() => handleToggle("autoSave")}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <label>Notifications</label>
                <span>Show success notifications</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={() => handleToggle("notifications")}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h3>Language</h3>
            <div className="settings-item">
              <div className="settings-item-info">
                <label>Select Language</label>
                <span>Choose your preferred language</span>
              </div>
              <select
                className="settings-select"
                value={settings.language}
                onChange={handleLanguageChange}
              >
                <option value="en">English</option>
                <option value="mr">Marathi (मराठी)</option>
                <option value="hi">Hindi (हिंदी)</option>
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h3>About</h3>
            <div className="settings-about">
              <p>
                <strong>Version:</strong> 1.0.0
              </p>
              <p>
                <strong>App:</strong> Om Sai News Paper Agency
              </p>
              <p>
                <strong>Description:</strong> Bill management system for newspaper
                agency
              </p>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="settings-save-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

