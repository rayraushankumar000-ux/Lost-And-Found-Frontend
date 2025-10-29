import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    matches: 0,
    successRate: 0
  });

  const [recentItems, setRecentItems] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        totalUsers: 1250,
        totalItems: 3450,
        matches: 890,
        successRate: 76
      });

      setRecentItems([
        { id: 1, type: 'lost', item: 'iPhone 13', user: 'John Doe', date: '2024-01-15', status: 'active' },
        { id: 2, type: 'found', item: 'Wallet', user: 'Sarah Smith', date: '2024-01-14', status: 'matched' },
        { id: 3, type: 'lost', item: 'Keys', user: 'Mike Johnson', date: '2024-01-14', status: 'active' },
        { id: 4, type: 'found', item: 'Watch', user: 'Emma Wilson', date: '2024-01-13', status: 'claimed' }
      ]);

      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', verified: true, joinDate: '2024-01-01', items: 3 },
        { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', verified: true, joinDate: '2024-01-02', items: 5 },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', verified: false, joinDate: '2024-01-03', items: 2 },
        { id: 4, name: 'Emma Wilson', email: 'emma@example.com', verified: true, joinDate: '2024-01-04', items: 4 }
      ]);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#f59e0b';
      case 'matched': return '#3b82f6';
      case 'claimed': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name}. Here's what's happening with your platform.</p>
      </div>

      <div className="admin-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          📝 Items
        </button>
        <button 
          className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📈 Reports
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="admin-content">
          {/* Stats Overview */}
          <div className="stats-grid">
            <div className="stat-card admin-stat">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <div className="stat-number">{stats.totalUsers.toLocaleString()}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </div>
            <div className="stat-card admin-stat">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <div className="stat-number">{stats.totalItems.toLocaleString()}</div>
                <div className="stat-label">Total Items</div>
              </div>
            </div>
            <div className="stat-card admin-stat">
              <div className="stat-icon">🔄</div>
              <div className="stat-info">
                <div className="stat-number">{stats.matches.toLocaleString()}</div>
                <div className="stat-label">Matches Made</div>
              </div>
            </div>
            <div className="stat-card admin-stat">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <div className="stat-number">{stats.successRate}%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="admin-section">
            <h2>Recent Items</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Type</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentItems.map(item => (
                    <tr key={item.id}>
                      <td className="item-name">{item.item}</td>
                      <td>
                        <span className={`type-badge ${item.type}`}>
                          {item.type}
                        </span>
                      </td>
                      <td>{item.user}</td>
                      <td>{item.date}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(item.status) + '20', color: getStatusColor(item.status) }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn view">View</button>
                        <button className="action-btn edit">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="admin-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-card">
                <div className="action-icon">📊</div>
                <span>Generate Report</span>
              </button>
              <button className="action-card">
                <div className="action-icon">👤</div>
                <span>Manage Users</span>
              </button>
              <button className="action-card">
                <div className="action-icon">⚙️</div>
                <span>System Settings</span>
              </button>
              <button className="action-card">
                <div className="action-icon">🛡️</div>
                <span>Verification Queue</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-content">
          <div className="admin-section">
            <h2>User Management</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Verified</th>
                    <th>Join Date</th>
                    <th>Items</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="user-name">{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        {user.verified ? (
                          <span className="verified-badge">✅ Verified</span>
                        ) : (
                          <span className="unverified-badge">⏳ Pending</span>
                        )}
                      </td>
                      <td>{user.joinDate}</td>
                      <td>{user.items}</td>
                      <td>
                        <button className="action-btn view">View</button>
                        <button className="action-btn edit">Edit</button>
                        <button className="action-btn delete">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'items' && (
        <div className="admin-content">
          <div className="admin-section">
            <h2>Item Management</h2>
            <div className="filters">
              <select className="filter-select">
                <option value="all">All Items</option>
                <option value="lost">Lost Items</option>
                <option value="found">Found Items</option>
              </select>
              <select className="filter-select">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="matched">Matched</option>
                <option value="claimed">Claimed</option>
              </select>
              <input 
                type="text" 
                placeholder="Search items..." 
                className="search-input"
              />
            </div>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentItems.map(item => (
                    <tr key={item.id}>
                      <td className="item-name">{item.item}</td>
                      <td>Electronics</td>
                      <td>
                        <span className={`type-badge ${item.type}`}>
                          {item.type}
                        </span>
                      </td>
                      <td>{item.user}</td>
                      <td>{item.date}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(item.status) + '20', color: getStatusColor(item.status) }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn view">View</button>
                        <button className="action-btn edit">Edit</button>
                        <button className="action-btn delete">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="admin-content">
          <div className="admin-section">
            <h2>Platform Reports</h2>
            <div className="reports-grid">
              <div className="report-card">
                <h3>User Growth</h3>
                <div className="report-placeholder">
                  <span>📈</span>
                  <p>User growth chart will be displayed here</p>
                </div>
              </div>
              <div className="report-card">
                <h3>Item Categories</h3>
                <div className="report-placeholder">
                  <span>📊</span>
                  <p>Category distribution chart</p>
                </div>
              </div>
              <div className="report-card">
                <h3>Success Rate</h3>
                <div className="report-placeholder">
                  <span>✅</span>
                  <p>Success rate over time</p>
                </div>
              </div>
              <div className="report-card">
                <h3>Geographic Distribution</h3>
                <div className="report-placeholder">
                  <span>🌍</span>
                  <p>User location map</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;