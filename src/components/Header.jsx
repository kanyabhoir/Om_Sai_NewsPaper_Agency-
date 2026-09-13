import { useState } from "react";
import "./Header.css";

const Header = ({ onSettingsClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-logo">
          <h1>Om Sai News Paper Agency</h1>
        </div>
        <nav className="header-nav">
          <button
            className="header-btn settings-btn"
            onClick={onSettingsClick}
            title="Settings"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
            </svg>
            <span>Settings</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

