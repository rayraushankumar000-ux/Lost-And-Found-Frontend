import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMetrics({
        overview: {
          totalItems: 1247,
          successfulReturns: 892,
          successRate: 71.5,
          activeUsers: 543,
          avgReturnTime: '2.3 days'
        },
        trends: {
          itemsByCategory: [
            { category: 'Electronics', lost: 45, found: 38 },
            { category: 'Documents', lost: 23, found: 19 },
            { category: 'Jewelry', lost: 18, found: 12 },
            { category: 'Keys', lost: 34, found: 29 },
            { category: 'Bags', lost: 27, found: 22 }
          ],
          dailyActivity: [
            { date: 'Mon', reports: 45, returns: 12 },
            { date: 'Tue', reports: 52, returns: 18 },
            { date: 'Wed', reports: 48, returns: 15 },
            { date: 'Thu', reports: 61, returns: 22 },
            { date: 'Fri', reports: 55, returns: 19 },
            { date: 'Sat', reports: 38, returns: 14 },
            { date: 'Sun', reports: 42, returns: 16 }
          ]
        },
        insights: [
          {
            title: 'Peak Reporting Hours',
            value: '2:00 PM - 5:00 PM',
            change: '+15%',
            positive: true
          },
          {
            title: 'Most Common Lost Item',
            value: 'Smartphones',
            change: '23% of all items',
            positive: false
          },
          {
            title: 'Highest Success Rate',
            value: 'Wallets & Documents',
            change: '85% recovery',
            positive: true
          },
          {
            title: 'Fastest Return Category',
            value: 'Keys',
            change: 'Avg 1.2 days',
            positive: true
          }
        ]
      });
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <div className="loading-analytics">
          <div className="analytics-spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1>📊 Analytics Dashboard</h1>
        <p>Comprehensive insights into platform performance and user activity</p>
        
        <div className="time-range-selector">
          <button 
            className={`time-btn ${timeRange === '7d' ? 'active' : ''}`}
            onClick={() => setTimeRange('7d')}
          >
            7D
          </button>
          <button 
            className={`time-btn ${timeRange === '30d' ? 'active' : ''}`}
            onClick={() => setTimeRange('30d')}
          >
            30D
          </button>
          <button 
            className={`time-btn ${timeRange === '90d' ? 'active' : ''}`}
            onClick={() => setTimeRange('90d')}
          >
            90D
          </button>
          <button 
            className={`time-btn ${timeRange === '1y' ? 'active' : ''}`}
            onClick={() => setTimeRange('1y')}
          >
            1Y
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="metrics-overview">
        <div className="metric-card">
          <div className="metric-icon">📦</div>
          <div className="metric-info">
            <div className="metric-value">{metrics.overview.totalItems}</div>
            <div className="metric-label">Total Items</div>
          </div>
          <div className="metric-trend positive">+12%</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-info">
            <div className="metric-value">{metrics.overview.successfulReturns}</div>
            <div className="metric-label">Successful Returns</div>
          </div>
          <div className="metric-trend positive">+8%</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-info">
            <div className="metric-value">{metrics.overview.successRate}%</div>
            <div className="metric-label">Success Rate</div>
          </div>
          <div className="metric-trend positive">+3%</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <div className="metric-value">{metrics.overview.activeUsers}</div>
            <div className="metric-label">Active Users</div>
          </div>
          <div className="metric-trend positive">+15%</div>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Category Distribution */}
        <div className="analytics-card">
          <h3>📋 Items by Category</h3>
          <div className="category-bars">
            {metrics.trends.itemsByCategory.map((category, index) => (
              <div key={index} className="category-bar">
                <div className="category-name">{category.category}</div>
                <div className="bar-container">
                  <div 
                    className="bar lost" 
                    style={{ width: `${(category.lost / 45) * 100}%` }}
                  >
                    <span className="bar-label">{category.lost} lost</span>
                  </div>
                  <div 
                    className="bar found" 
                    style={{ width: `${(category.found / 38) * 100}%` }}
                  >
                    <span className="bar-label">{category.found} found</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Activity Chart */}
        <div className="analytics-card">
          <h3>📅 Daily Activity</h3>
          <div className="activity-chart">
            {metrics.trends.dailyActivity.map((day, index) => (
              <div key={index} className="chart-bar">
                <div className="bar-stack">
                  <div 
                    className="stack reports" 
                    style={{ height: `${(day.reports / 61) * 100}%` }}
                    title={`${day.reports} reports`}
                  ></div>
                  <div 
                    className="stack returns" 
                    style={{ height: `${(day.returns / 22) * 100}%` }}
                    title={`${day.returns} returns`}
                  ></div>
                </div>
                <div className="chart-label">{day.date}</div>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color reports"></div>
              <span>Reports</span>
            </div>
            <div className="legend-item">
              <div className="legend-color returns"></div>
              <span>Returns</span>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="analytics-card insights">
          <h3>💡 Key Insights</h3>
          <div className="insights-list">
            {metrics.insights.map((insight, index) => (
              <div key={index} className="insight-item">
                <div className="insight-content">
                  <div className="insight-title">{insight.title}</div>
                  <div className="insight-value">{insight.value}</div>
                </div>
                <div className={`insight-change ${insight.positive ? 'positive' : 'neutral'}`}>
                  {insight.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Heatmap */}
        <div className="analytics-card">
          <h3>🌍 Activity Heatmap</h3>
          <div className="heatmap-placeholder">
            <div className="heatmap-visual">
              <div className="heatmap-grid">
                {[...Array(25)].map((_, i) => (
                  <div 
                    key={i} 
                    className="heatmap-cell"
                    style={{ opacity: Math.random() * 0.8 + 0.2 }}
                  ></div>
                ))}
              </div>
            </div>
            <div className="heatmap-legend">
              <span>Low</span>
              <div className="gradient-bar"></div>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="analytics-actions">
        <button className="btn btn-outline">
          📥 Export Report
        </button>
        <button className="btn btn-primary">
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;