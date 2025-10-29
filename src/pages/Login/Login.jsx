import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🔄 Form submitted with:', formData);

    try {
      if (isLogin) {
        // REAL LOGIN - Call your backend API
        console.log('🔐 Attempting login...');
        
        const result = await login({
          email: formData.email,
          password: formData.password
        });

        console.log('📊 Login result:', result);

        if (result.success) {
          addNotification({
            title: 'Welcome back!',
            message: 'You have successfully logged in.'
          });
          navigate('/dashboard');
        } else {
          setError(result.error);
          addNotification({
            title: 'Login Failed',
            message: result.error,
            type: 'error'
          });
        }
      } else {
        // REAL REGISTRATION - Call your backend API
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          addNotification({
            title: 'Error',
            message: 'Passwords do not match.',
            type: 'error'
          });
          setLoading(false);
          return;
        }

        console.log('📝 Attempting registration...');
        
        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        console.log('📊 Registration result:', result);

        if (result.success) {
          addNotification({
            title: 'Welcome!',
            message: 'Your account has been created successfully.'
          });
          navigate('/dashboard');
        } else {
          setError(result.error);
          addNotification({
            title: 'Registration Failed',
            message: result.error,
            type: 'error'
          });
        }
      }
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      setError('An unexpected error occurred');
      addNotification({
        title: 'Error',
        message: 'An unexpected error occurred',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p>
              {isLogin 
                ? 'Sign in to your account to continue' 
                : 'Join our community to start finding lost items'
              }
            </p>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="error-message">
              <span>❌</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
                disabled={loading}
                minLength="6"
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
              </div>
            )}

            {isLogin && (
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" disabled={loading} />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button"
                className="switch-mode"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                disabled={loading}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="login-features">
            <div className="feature">
              <span className="feature-icon">🛡️</span>
              <span>Secure & Verified</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🚀</span>
              <span>Instant Matching</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <span>Privacy Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;