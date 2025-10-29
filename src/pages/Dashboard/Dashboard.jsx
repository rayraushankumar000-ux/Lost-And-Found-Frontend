import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [stats, setStats] = useState({
    lostItems: 0,
    foundItems: 0,
    matches: 0,
    successfulReturns: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const [quickActions] = useState([
    {
      icon: '📝',
      title: 'Report Lost Item',
      description: 'Report something you lost',
      link: '/report-lost',
      color: '#ef4444'
    },
    {
      icon: '🔍',
      title: 'Report Found Item',
      description: 'Report something you found',
      link: '/report-found',
      color: '#10b981'
    },
    {
      icon: '📊',
      title: 'Search Items',
      description: 'Search lost and found items',
      link: '/search',
      color: '#3b82f6'
    },
    {
      icon: '👤',
      title: 'Update Profile',
      description: 'Manage your account',
      link: '/profile',
      color: '#8b5cf6'
    }
  ]);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        lostItems: 2,
        foundItems: 1,
        matches: 1,
        successfulReturns: 1
      });

      setRecentActivity([
        {
          id: 1,
          type: 'lost',
          item: 'iPhone 13',
          date: '2024-01-15',
          status: 'active'
        },
        {
          id: 2,
          type: 'found',
          item: 'Wallet',
          date: '2024-01-14',
          status: 'matched'
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#f59e0b';
      case 'matched': return '#3b82f6';
      case 'completed': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'matched': return 'Matched';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's what's happening with your lost and found items today.</p>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              📝
            </div>
            <div className="stat-info">
              <div className="stat-number">{stats.lostItems}</div>
              <div className="stat-label">Lost Items</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              🔍
            </div>
            <div className="stat-info">
              <div className="stat-number">{stats.foundItems}</div>
              <div className="stat-label">Found Items</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              🔄
            </div>
            <div className="stat-info">
              <div className="stat-number">{stats.matches}</div>
              <div className="stat-label">Matches</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
              ✅
            </div>
            <div className="stat-info">
              <div className="stat-number">{stats.successfulReturns}</div>
              <div className="stat-label">Successful Returns</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link} className="quick-action-card">
                <div 
                  className="action-icon"
                  style={{ backgroundColor: action.color + '20', color: action.color }}
                >
                  {action.icon}
                </div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                <div className="action-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'lost' && '📝'}
                  {activity.type === 'found' && '🔍'}
                </div>
                <div className="activity-details">
                  <div className="activity-title">{activity.item}</div>
                  <div className="activity-meta">
                    <span className="activity-date">{activity.date}</span>
                    <span 
                      className="activity-status"
                      style={{ color: getStatusColor(activity.status) }}
                    >
                      {getStatusText(activity.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;