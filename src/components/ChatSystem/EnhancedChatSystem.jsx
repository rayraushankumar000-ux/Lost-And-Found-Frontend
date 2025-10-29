import React, { useState, useEffect, useRef } from 'react';
import './EnhancedChatSystem.css';

const EnhancedChatSystem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sample initial messages
  useEffect(() => {
    setMessages([
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
    ]);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() || attachments.length > 0) {
      const message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
        attachments: [...attachments]
      };
      setMessages([...messages, message]);
      setNewMessage('');
      setAttachments([]);
      
      // Simulate typing and response
      setIsTyping(true);
      setTimeout(() => {
        const reply = {
          id: messages.length + 2,
          text: "Thank you for your message! I'll check for matching items and get back to you shortly.",
          sender: 'support',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, reply]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files.slice(0, 3)]); // Limit to 3 files
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const quickReplies = [
    "Can you describe the item?",
    "Where did you find/lose it?",
    "When did this happen?",
    "Thank you for your help!"
  ];

  const handleQuickReply = (reply) => {
    setNewMessage(reply);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="enhanced-chat-system">
      {!isOpen ? (
        <button 
          className="chat-toggle enhanced"
          onClick={() => setIsOpen(true)}
        >
          <span className="chat-icon">💬</span>
          <span className="chat-label">Need Help?</span>
          <div className="chat-pulse"></div>
        </button>
      ) : (
        <div className="enhanced-chat-window">
          <div className="chat-header enhanced">
            <div className="chat-header-info">
              <div className="status-indicator online"></div>
              <div className="chat-avatar">🛟</div>
              <div>
                <div className="chat-title">Support Team</div>
                <div className="chat-status">Online • Usually replies instantly</div>
              </div>
            </div>
            <div className="chat-actions">
              <button className="action-btn" title="Search chat">
                🔍
              </button>
              <button className="action-btn" title="Chat history">
                📋
              </button>
              <button 
                className="action-btn close"
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                ×
              </button>
            </div>
          </div>

          <div className="chat-messages enhanced">
            <div className="welcome-message">
              <p>👋 Hello! I'm here to help you with lost and found items. How can I assist you today?</p>
            </div>

            {messages.map(message => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="message-attachments">
                      {message.attachments.map((file, index) => (
                        <div key={index} className="attachment">
                          <span className="attachment-icon">📎</span>
                          <span className="attachment-name">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {message.text && (
                    <div className="message-text">{message.text}</div>
                  )}
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>Support is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 0 && (
            <div className="quick-replies">
              <p>Quick replies:</p>
              <div className="quick-reply-buttons">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    className="quick-reply-btn"
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="chat-input-form enhanced">
            {attachments.length > 0 && (
              <div className="attachments-preview">
                {attachments.map((file, index) => (
                  <div key={index} className="attachment-preview">
                    <span className="file-icon">📎</span>
                    <span className="file-name">{file.name}</span>
                    <button
                      type="button"
                      className="remove-attachment"
                      onClick={() => removeAttachment(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="input-container">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="chat-input enhanced"
              />
              
              <div className="input-actions">
                <label className="file-upload-btn" title="Attach files">
                  📎
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="file-input"
                  />
                </label>
                <button 
                  type="submit" 
                  className="send-button enhanced"
                  disabled={!newMessage.trim() && attachments.length === 0}
                >
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EnhancedChatSystem;