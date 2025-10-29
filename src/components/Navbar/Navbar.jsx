import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { unreadCount } = useNotification();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <div className="logo-icon">🔍</div>
          Lost & Found
        </Link>

        <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActiveLink('/')}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActiveLink('/about')}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link ${isActiveLink('/contact')}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActiveLink('/dashboard')}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/report-lost" 
                className={`nav-link ${isActiveLink('/report-lost')}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Report Lost
              </Link>
              <Link 
                to="/report-found" 
                className={`nav-link ${isActiveLink('/report-found')}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Report Found
              </Link>
              
              {/* Advanced Features */}
              <div className="nav-dropdown">
                <button className="nav-link dropdown-toggle">
                  Advanced Features ▾
                </button>
                <div className="dropdown-menu">
                  <Link 
                    to="/bulk-upload" 
                    className="dropdown-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    📦 Bulk Upload
                  </Link>
                  <Link 
                    to="/qr-generator" 
                    className="dropdown-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🎫 QR Generator
                  </Link>
                  <Link 
                    to="/ar-scanner" 
                    className="dropdown-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🕶️ AR Scanner
                  </Link>
                  <Link 
                    to="/ai-recognition" 
                    className="dropdown-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🤖 AI Recognition
                  </Link>
                  <Link 
                    to="/rewards" 
                    className="dropdown-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🎮 Rewards
                  </Link>
                  <Link 
                    to="/authority-reporting" 
                    className="dropdown-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🏢 Authority Reporting
                  </Link>
                </div>
              </div>

              {/* Admin Features */}
              {isAdmin && (
                <div className="nav-dropdown">
                  <button className="nav-link dropdown-toggle admin">
                    Admin ▾
                  </button>
                  <div className="dropdown-menu">
                    <Link 
                      to="/admin" 
                      className="dropdown-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      📊 Admin Dashboard
                    </Link>
                    <Link 
                      to="/analytics" 
                      className="dropdown-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      📈 Analytics
                    </Link>
                  </div>
                </div>
              )}

              <div className="nav-user">
                <Link 
                  to="/profile" 
                  className="user-profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="user-avatar">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span>{user?.name}</span>
                </Link>
                {unreadCount > 0 && (
                  <div className="notification-badge">{unreadCount}</div>
                )}
                
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link 
              to="/login" 
              className="nav-link login-btn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>

        <div 
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;