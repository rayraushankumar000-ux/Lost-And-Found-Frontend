import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, themes, changeTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="theme-toggle">
      <button 
        className="theme-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title={`Current theme: ${themes[theme]?.name}`}
      >
        <span className="theme-icon">
          {themes[theme]?.icon}
        </span>
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          {Object.entries(themes).map(([key, themeInfo]) => (
            <button
              key={key}
              className={`theme-option ${key === theme ? 'active' : ''}`}
              onClick={() => {
                changeTheme(key);
                setIsOpen(false);
              }}
            >
              <span className="theme-icon">{themeInfo.icon}</span>
              <span className="theme-name">{themeInfo.name}</span>
              {key === theme && <span className="checkmark">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;