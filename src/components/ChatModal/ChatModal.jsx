import React, { useState } from 'react';
import './ChatModal.css';

const ChatModal = ({ isOpen, onClose, item, user }) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle message submission
      console.log('Message sent:', message);
      setMessage('');
      onClose();
    }
  };

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        <div className="chat-modal-header">
          <h3>Contact About Found Item</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="chat-modal-content">
          <div className="item-info">
            <h4>Item Details</h4>
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>Date:</strong> {item.date}</p>
          </div>

          <form onSubmit={handleSubmit} className="message-form">
            <div className="form-group">
              <label className="form-label">Your Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="form-input form-textarea"
                placeholder="Describe how you can help or ask questions about the item..."
                rows="4"
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;