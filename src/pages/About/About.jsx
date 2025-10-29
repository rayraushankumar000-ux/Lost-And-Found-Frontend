import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  const teamMembers = [
    {
      name: 'John Smith',
      role: 'Founder & CEO',
      bio: 'Passionate about connecting people with their lost belongings.',
      avatar: '👨‍💼'
    },
    {
      name: 'Sarah Johnson',
      role: 'Head of Technology',
      bio: 'Building innovative solutions to make lost and found effortless.',
      avatar: '👩‍💻'
    },
    {
      name: 'Mike Chen',
      role: 'Community Manager',
      bio: 'Dedicated to creating a supportive and trustworthy community.',
      avatar: '👨‍🤝‍👨'
    },
    {
      name: 'Emily Davis',
      role: 'Customer Success',
      bio: 'Ensuring every user has the best possible experience.',
      avatar: '👩‍💼'
    }
  ];

  const milestones = [
    { year: '2020', event: 'Platform Launch', description: 'Started with basic lost and found functionality' },
    { year: '2021', event: 'Mobile App', description: 'Launched mobile apps for iOS and Android' },
    { year: '2022', event: 'AI Matching', description: 'Integrated AI-powered item matching' },
    { year: '2023', event: 'Global Expansion', description: 'Expanded to 50+ cities worldwide' },
    { year: '2024', event: '10K+ Reunions', description: 'Celebrated 10,000 successful reunions' }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>About Lost & Found</h1>
            <p className="hero-subtitle">
              We're on a mission to reunite people with their lost belongings through 
              technology, community, and compassion.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content">
              <h2>Our Mission</h2>
              <p>
                Every year, millions of valuable items are lost, causing stress and 
                inconvenience. We believe technology can solve this age-old problem 
                by creating connections between people who find items and those who lost them.
              </p>
              <p>
                Our platform combines advanced search algorithms, image recognition, 
                and a trusted community to make lost and found management simple, 
                secure, and effective.
              </p>
              <div className="mission-stats">
                <div className="mission-stat">
                  <div className="stat-number">10,000+</div>
                  <div className="stat-label">Items Reunited</div>
                </div>
                <div className="mission-stat">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
                <div className="mission-stat">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Cities</div>
                </div>
              </div>
            </div>
            <div className="mission-visual">
              <div className="visual-card card-1">📱</div>
              <div className="visual-card card-2">🔍</div>
              <div className="visual-card card-3">🤝</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🔒</div>
              <h3>Trust & Security</h3>
              <p>We verify all users and ensure secure transactions to build a trustworthy community.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🚀</div>
              <h3>Innovation</h3>
              <p>Leveraging cutting-edge technology to solve real-world problems effectively.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Compassion</h3>
              <p>Understanding the emotional value of lost items and working with empathy.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Community</h3>
              <p>Building a global network of helpful individuals committed to reuniting lost items.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">{member.avatar}</div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <h2 className="section-title">Our Journey</h2>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-year">{milestone.year}</div>
                <div className="timeline-content">
                  <h3>{milestone.event}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Join Our Mission</h2>
            <p>Be part of the solution and help reunite lost items with their owners.</p>
            <div className="cta-actions">
              <Link to="/report-found" className="btn btn-primary btn-large">
                Report Found Item
              </Link>
              <Link to="/contact" className="btn btn-outline btn-large">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;