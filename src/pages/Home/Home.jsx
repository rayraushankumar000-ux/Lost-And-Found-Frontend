import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdvancedSearch from '../../components/AdvancedSearch/AdvancedSearch';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const stats = [
    { number: '10,000+', label: 'Items Reunited' },
    { number: '95%', label: 'Success Rate' },
    { number: '50+', label: 'Cities Covered' },
    { number: '24/7', label: 'Support Available' }
  ];

  const features = [
    {
      icon: '🔍',
      title: 'Advanced Search',
      description: 'Use our powerful search with filters to find your lost items quickly.'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Access our platform from any device, anywhere, anytime.'
    },
    {
      icon: '🛡️',
      title: 'Secure & Verified',
      description: 'All users are verified to ensure safe and trustworthy interactions.'
    },
    {
      icon: '🚀',
      title: 'Instant Notifications',
      description: 'Get real-time alerts when matching items are found.'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Lost Something?
              <span className="gradient-text"> We'll Help Find It</span>
            </h1>
            <p className="hero-description">
              Our advanced lost and found platform uses community power and smart technology 
              to reunite you with your precious belongings. Fast, secure, and reliable.
            </p>
            <div className="hero-actions">
              {!isAuthenticated ? (
                <Link to="/login" className="btn btn-primary btn-large">
                  Get Started
                </Link>
              ) : (
                <div className="authenticated-actions">
                  <Link to="/report-lost" className="btn btn-primary btn-large">
                    Report Lost Item
                  </Link>
                  <Link to="/report-found" className="btn btn-outline btn-large">
                    Report Found Item
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-cards">
              <div className="card-item card-1">📱</div>
              <div className="card-item card-2">🔑</div>
              <div className="card-item card-3">💼</div>
              <div className="card-item card-4">💳</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="container">
          <div className="section-header">
            <h2>Find What You're Looking For</h2>
            <p>Use our advanced search to quickly locate lost or found items</p>
          </div>
          <AdvancedSearch />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Our Platform?</h2>
            <p>We make lost and found management simple and effective</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of users who have successfully recovered their lost items</p>
            {!isAuthenticated ? (
              <Link to="/login" className="btn btn-primary btn-large">
                Create Account
              </Link>
            ) : (
              <Link to="/dashboard" className="btn btn-primary btn-large">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;