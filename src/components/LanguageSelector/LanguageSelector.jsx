import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { language, languages, changeLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="language-selector">
      <button 
        className="language-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="language-flag">{languages[language]?.flag}</span>
        <span className="language-code">{language.toUpperCase()}</span>
        <span className="dropdown-arrow">▾</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {Object.entries(languages).map(([code, lang]) => (
            <button
              key={code}
              className={`language-option ${code === language ? 'active' : ''}`}
              onClick={() => handleLanguageChange(code)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
              {code === language && <span className="checkmark">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;