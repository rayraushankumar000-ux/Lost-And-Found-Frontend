import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import VerificationSystem from '../../components/VerificationSystem/VerificationSystem';
import './UserProfile.css';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    country: '',
    notifications: {
      email: true,
      push: true,
      matches: true,
      updates: false
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = () => {
    updateUser(formData);
    setEditMode(false);
    addNotification({
      title: 'Profile Updated',
      message: 'Your profile has been updated successfully.'
    });
  };

  const stats = [
    { label: 'Lost Items Reported', value: 3 },
    { label: 'Found Items Reported', value: 2 },
    { label: 'Successful Matches', value: 1 },
    { label: 'Community Rating', value: '4.8/5' }
  ];

  const recentActivity = [
    { action: 'Reported lost item', item: 'iPhone 13', date: '2 hours ago', type: 'lost' },
    { action: 'Found item match', item: 'Wallet', date: '1 day ago', type: 'match' },
    { action: 'Updated profile', item: '', date: '2 days ago', type: 'update' },
    { action: 'Reported found item', item: 'Keys', date: '3 days ago', type: 'found' }
  ];

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-hero">
          <div className="profile-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="profile-info">
            <h1>{user?.name}</h1>
            <p>{user?.email}</p>
            <div className="profile-badges">
              {user?.verified && (
                <span className="badge verified">✅ Verified</span>
              )}
              <span className="badge member">🌟 Active Member</span>
            </div>
          </div>
          <button 
            className="btn btn-outline"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <nav className="profile-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>
            <button 
              className={`nav-item ${activeTab === 'verification' ? 'active' : ''}`}
              onClick={() => setActiveTab('verification')}
            >
              🛡️ Verification
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Settings
            </button>
            <button 
              className={`nav-item ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              📊 Activity
            </button>
          </nav>

          <div className="profile-stats">
            <h3>Your Stats</h3>
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-main">
          {activeTab === 'profile' && (
            <div className="tab-content">
              <h2>Personal Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input"
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="form-input"
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="form-input"
                    disabled={!editMode}
                  />
                </div>
              </div>
              {editMode && (
                <button className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              )}
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="tab-content">
              <VerificationSystem />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="tab-content">
              <h2>Notification Settings</h2>
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Email Notifications</h4>
                    <p>Receive updates via email</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="notifications.email"
                      checked={formData.notifications.email}
                      onChange={handleChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Push Notifications</h4>
                    <p>Receive browser notifications</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="notifications.push"
                      checked={formData.notifications.push}
                      onChange={handleChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Match Alerts</h4>
                    <p>Get notified about potential matches</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="notifications.matches"
                      checked={formData.notifications.matches}
                      onChange={handleChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Platform Updates</h4>
                    <p>News and feature updates</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="notifications.updates"
                      checked={formData.notifications.updates}
                      onChange={handleChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="tab-content">
              <h2>Recent Activity</h2>
              <div className="activity-timeline">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker">
                      {activity.type === 'lost' && '📝'}
                      {activity.type === 'found' && '🔍'}
                      {activity.type === 'match' && '✅'}
                      {activity.type === 'update' && '⚙️'}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-title">
                        {activity.action} 
                        {activity.item && <span className="item-name">"{activity.item}"</span>}
                      </div>
                      <div className="timeline-date">{activity.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;