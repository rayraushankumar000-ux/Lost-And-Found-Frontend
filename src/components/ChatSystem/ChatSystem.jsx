import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './ChatSystem.css';

const ChatSystem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();

  const sampleMessages = [
    {
      id: 1,
      text: "Hello! I found a wallet near the park. Can you help me return it?",
      sender: 'other',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 2,
      text: "Hi! Thank you for reaching out. Could you describe the wallet?",
      sender: 'user',
      timestamp: new Date(Date.now() - 3500000)
    }
  ];

  useEffect(() => {
    setMessages(sampleMessages);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages([...messages, message]);
      setNewMessage('');

      // Simulate reply
      setTimeout(() => {
        const reply = {
          id: messages.length + 2,
          text: "Thank you for the information. I'll check if there's a matching lost item report.",
          sender: 'other',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, reply]);
      }, 2000);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-system">
      {!isOpen ? (
        <button 
          className="chat-toggle"
          onClick={() => setIsOpen(true)}
        >
          <span className="chat-icon">💬</span>
          <span className="chat-label">Need Help?</span>
        </button>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">🛟</div>
              <div>
                <div className="chat-title">Support Team</div>
                <div className="chat-status">Online</div>
              </div>
            </div>
            <button 
              className="chat-close"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="chat-messages">
            {messages.map(message => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatSystem;