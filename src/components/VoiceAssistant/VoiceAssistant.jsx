import React, { useState, useEffect } from 'react';
import voiceCommandService from '../../services/voiceCommandService';
import './VoiceAssistant.css';

const VoiceAssistant = () => {
  const [isActive, setIsActive] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [lastCommand, setLastCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);

  useEffect(() => {
    setIsSupported(voiceCommandService.isSupported());
    
    // Set up callbacks
    voiceCommandService.setOnResult((transcript, executed) => {
      setLastCommand(transcript);
      setCommandHistory(prev => [
        { transcript, executed, timestamp: new Date() },
        ...prev.slice(0, 9) // Keep last 10 commands
      ]);
    });
    
    voiceCommandService.setOnError((error) => {
      console.error('Voice recognition error:', error);
      setIsActive(false);
    });
    
    // Register additional commands
    voiceCommandService.registerCommand('hello', () => {
      voiceCommandService.speak("Hello! How can I help you with lost and found items today?");
    });
    
    voiceCommandService.registerCommand('thank you', () => {
      voiceCommandService.speak("You're welcome! Happy to help.");
    });

    return () => {
      voiceCommandService.stopListening();
      setIsActive(false);
    };
  }, []);

  const closePanel = () => {
    if (isActive) {
      voiceCommandService.stopListening();
    }
    setIsActive(false);
  };

  const toggleListening = () => {
    if (isActive) {
      voiceCommandService.stopListening();
      setIsActive(false);
    } else {
      const started = voiceCommandService.startListening();
      setIsActive(started);
      // If starting failed, ensure the state reflects this
      if (!started) {
        setIsActive(false);
      }
    }
  };

  const quickCommands = [
    { text: "Report lost item", icon: "📝" },
    { text: "Report found item", icon: "🔍" },
    { text: "Search items", icon: "🔎" },
    { text: "Go to dashboard", icon: "📊" }
  ];

  const handleQuickCommand = (command) => {
    voiceCommandService.processCommand(command);
  };

  if (!isSupported) {
    return (
      <div className="voice-assistant unsupported">
        <div className="assistant-icon">🎤</div>
        <div className="assistant-message">
          Voice commands are not supported in your browser.
        </div>
      </div>
    );
  }

  return (
    <div className="voice-assistant">
      {/* Main Assistant Button */}
      <button
        className={`assistant-toggle ${isActive ? 'listening' : ''}`}
        onClick={toggleListening}
        title={isActive ? 'Stop listening' : 'Start voice commands'}
      >
        <div className="assistant-pulse"></div>
        <div className="assistant-icon">
          {isActive ? '🎤' : '🎤'}
        </div>
      </button>

      {/* Assistant Panel */}
      {(isActive || commandHistory.length > 0) && (
        <div className="assistant-panel">
          <div className="panel-header">
            <h4>🎤 Voice Assistant</h4>
            <button 
              className="close-panel"
              onClick={closePanel}
              title="Close panel"
            >
              ×
            </button>
          </div>

          {/* Status */}
          <div className="assistant-status">
            {isActive ? (
              <div className="listening-status">
                <div className="listening-indicator"></div>
                <span>Listening...</span>
              </div>
            ) : (
              <span>Say "help" for available commands</span>
            )}
          </div>

          {/* Quick Commands */}
          <div className="quick-commands">
            <h5>Quick Commands:</h5>
            <div className="command-buttons">
              {quickCommands.map((cmd, index) => (
                <button
                  key={index}
                  className="command-btn"
                  onClick={() => handleQuickCommand(cmd.text)}
                >
                  <span className="command-icon">{cmd.icon}</span>
                  <span className="command-text">{cmd.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Command History */}
          {commandHistory.length > 0 && (
            <div className="command-history">
              <h5>Recent Commands:</h5>
              <div className="history-list">
                {commandHistory.map((cmd, index) => (
                  <div key={index} className="history-item">
                    <div className="command-transcript">"{cmd.transcript}"</div>
                    <div className={`command-status ${cmd.executed ? 'executed' : 'failed'}`}>
                      {cmd.executed ? '✅' : '❌'}
                    </div>
                    <div className="command-time">
                      {cmd.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="assistant-help">
            <button 
              className="help-btn"
              onClick={() => voiceCommandService.showHelp()}
            >
              ❓ Show All Commands
            </button>
          </div>
        </div>
      )}

      {/* Floating Command Indicator */}
      {lastCommand && (
        <div className="command-indicator">
          <span>You said: "{lastCommand}"</span>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;