import React, { useState, useEffect } from 'react';
import './RewardsSystem.css';

const RewardsSystem = () => {
  const [userStats, setUserStats] = useState({
    points: 450,
    level: 3,
    nextLevelPoints: 200,
    itemsReported: 12,
    itemsReturned: 8,
    streak: 5
  });

  const [badges, setBadges] = useState([
    { id: 1, name: 'First Report', icon: '🎯', earned: true, date: '2024-01-10' },
    { id: 2, name: 'Helper', icon: '🤝', earned: true, date: '2024-01-15' },
    { id: 3, name: 'Super Helper', icon: '🌟', earned: false, required: 'Return 10 items' },
    { id: 4, name: 'Quick Responder', icon: '⚡', earned: false, required: 'Respond within 1 hour' },
    { id: 5, name: 'Community Hero', icon: '🦸', earned: false, required: '50 successful returns' }
  ]);

  const [rewards, setRewards] = useState([
    { id: 1, name: 'Premium Badge', cost: 100, icon: '🏅', available: true },
    { id: 2, name: 'Profile Customization', cost: 200, icon: '🎨', available: true },
    { id: 3, name: 'Priority Support', cost: 300, icon: '🚀', available: false },
    { id: 4, name: 'Verified Pro', cost: 500, icon: '✅', available: false }
  ]);

  const progress = (userStats.points / userStats.nextLevelPoints) * 100;

  return (
    <div className="rewards-system">
      <div className="rewards-header">
        <h2>🎮 Rewards & Achievements</h2>
        <p>Earn points and badges for helping the community</p>
      </div>

      {/* User Stats */}
      <div className="user-stats-card">
        <div className="level-display">
          <div className="level-icon">⭐</div>
          <div className="level-info">
            <div className="level">Level {userStats.level}</div>
            <div className="points">{userStats.points} points</div>
          </div>
        </div>
        
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {userStats.nextLevelPoints - userStats.points} points to next level
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat">
            <div className="stat-value">{userStats.itemsReported}</div>
            <div className="stat-label">Items Reported</div>
          </div>
          <div className="stat">
            <div className="stat-value">{userStats.itemsReturned}</div>
            <div className="stat-label">Successful Returns</div>
          </div>
          <div className="stat">
            <div className="stat-value">{userStats.streak} days</div>
            <div className="stat-label">Current Streak</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="badges-section">
        <h3>🏆 Your Badges</h3>
        <div className="badges-grid">
          {badges.map(badge => (
            <div key={badge.id} className={`badge-card ${badge.earned ? 'earned' : 'locked'}`}>
              <div className="badge-icon">{badge.icon}</div>
              <div className="badge-info">
                <h4>{badge.name}</h4>
                {badge.earned ? (
                  <span className="earned-date">Earned {badge.date}</span>
                ) : (
                  <span className="requirement">{badge.required}</span>
                )}
              </div>
              <div className="badge-status">
                {badge.earned ? '✅' : '🔒'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Shop */}
      <div className="rewards-shop">
        <h3>🛍️ Rewards Shop</h3>
        <div className="rewards-grid">
          {rewards.map(reward => (
            <div key={reward.id} className={`reward-card ${reward.available ? 'available' : 'locked'}`}>
              <div className="reward-icon">{reward.icon}</div>
              <div className="reward-info">
                <h4>{reward.name}</h4>
                <div className="reward-cost">
                  <span className="cost">{reward.cost}</span>
                  <span className="points-text">points</span>
                </div>
              </div>
              <button 
                className={`redeem-btn ${reward.available && userStats.points >= reward.cost ? 'can-redeem' : 'cannot-redeem'}`}
                disabled={!reward.available || userStats.points < reward.cost}
              >
                {userStats.points >= reward.cost ? 'Redeem' : 'Need More Points'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div className="leaderboard-preview">
        <h3>🏆 Community Leaderboard</h3>
        <div className="leaderboard-list">
          {[1, 2, 3].map(position => (
            <div key={position} className="leaderboard-item">
              <span className="rank">#{position}</span>
              <span className="user">User {position}</span>
              <span className="score">{1000 - position * 100} pts</span>
            </div>
          ))}
        </div>
        <button className="view-full-leaderboard">
          View Full Leaderboard →
        </button>
      </div>
    </div>
  );
};

export default RewardsSystem;