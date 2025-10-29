import React, { useState } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [loading, setLoading] = useState(false);

  const { addNotification } = useNotification();

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'media', label: 'Media Inquiry' },
    { value: 'other', label: 'Other' }
  ];

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Us',
      details: 'support@lostfound.com',
      description: 'Send us an email anytime'
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 9am to 6pm'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      details: 'Available 24/7',
      description: 'Get instant help via chat'
    },
    {
      icon: '📍',
      title: 'Visit Us',
      details: '123 Recovery St, Hope City',
      description: 'Come say hello in person'
    }
  ];

  const faqs = [
    {
      question: 'How does the matching process work?',
      answer: 'Our AI system compares lost and found reports based on item details, location, and time. When a potential match is found, both parties are notified.'
    },
    {
      question: 'Is my personal information safe?',
      answer: 'Yes, we take privacy seriously. Your contact information is only shared when you choose to connect with another user about a potential match.'
    },
    {
      question: 'How long are items kept in the system?',
      answer: 'Active listings remain in our system for 90 days. You\'ll receive reminders to renew or close your listing as the expiration date approaches.'
    },
    {
      question: 'Can I report found items anonymously?',
      answer: 'While we encourage transparency, you can choose to share minimal contact information and use our secure messaging system for initial communications.'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      addNotification({
        title: 'Message Sent',
        message: 'Thank you for contacting us! We\'ll get back to you soon.'
      });
      setLoading(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    }, 2000);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Get in Touch</h1>
            <p>We're here to help you reunite with your lost items. Contact us for any questions or support.</p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="contact-layout">
          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-input"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  rows="6"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="contact-info-section">
            <h2>Other Ways to Reach Us</h2>
            <div className="contact-methods">
              {contactMethods.map((method, index) => (
                <div key={index} className="contact-method">
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-content">
                    <h3>{method.title}</h3>
                    <p className="method-details">{method.details}</p>
                    <p className="method-description">{method.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="faq-section">
              <h3>Frequently Asked Questions</h3>
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <h4>{faq.question}</h4>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <h2>Visit Our Office</h2>
          <div className="map-placeholder">
            <div className="map-content">
              <div className="map-icon">🗺️</div>
              <h3>Interactive Map</h3>
              <p>123 Recovery Street, Hope City, HC 12345</p>
              <button className="btn btn-outline">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;