class VoiceCommandService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.commands = new Map();
    this.onResultCallback = null;
    this.onErrorCallback = null;
    
    this.initializeSpeechRecognition();
    this.registerDefaultCommands();
  }

  initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        this.processCommand(transcript);
      };
      
      this.recognition.onerror = (event) => {
        if (this.onErrorCallback) {
          this.onErrorCallback(event.error);
        }
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  registerDefaultCommands() {
    // Navigation commands
    this.registerCommand('go to home', () => window.location.href = '/');
    this.registerCommand('go to dashboard', () => window.location.href = '/dashboard');
    this.registerCommand('go to search', () => window.location.href = '/search');
    this.registerCommand('go to profile', () => window.location.href = '/profile');
    
    // Action commands
    this.registerCommand('report lost item', () => window.location.href = '/report-lost');
    this.registerCommand('report found item', () => window.location.href = '/report-found');
    this.registerCommand('search for items', () => window.location.href = '/search');
    
    // Utility commands
    this.registerCommand('help', this.showHelp.bind(this));
    this.registerCommand('what can I say', this.showHelp.bind(this));
    this.registerCommand('stop listening', this.stopListening.bind(this));
  }

  registerCommand(phrase, callback) {
    this.commands.set(phrase.toLowerCase(), callback);
  }

  processCommand(transcript) {
    console.log('Voice command:', transcript);
    
    let commandExecuted = false;
    
    // Exact match
    if (this.commands.has(transcript)) {
      this.commands.get(transcript)();
      commandExecuted = true;
    } else {
      // Fuzzy match
      for (const [command, callback] of this.commands) {
        if (transcript.includes(command) || this.calculateSimilarity(transcript, command) > 0.7) {
          callback();
          commandExecuted = true;
          break;
        }
      }
    }
    
    if (this.onResultCallback) {
      this.onResultCallback(transcript, commandExecuted);
    }
    
    if (!commandExecuted) {
      this.speak("Sorry, I didn't understand that command. Say 'help' for available commands.");
    }
  }

  calculateSimilarity(str1, str2) {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    const intersection = words1.filter(word => words2.includes(word));
    return intersection.length / Math.max(words1.length, words2.length);
  }

  startListening() {
    if (!this.recognition) {
      this.speak("Speech recognition is not supported in your browser.");
      return false;
    }
    
    if (this.isListening) {
      this.stopListening();
      return false;
    }
    
    try {
      this.recognition.start();
      this.isListening = true;
      this.speak("I'm listening. What would you like to do?");
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.speak("Stopped listening.");
    }
  }

  speak(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  }

  showHelp() {
    const availableCommands = Array.from(this.commands.keys()).slice(0, 8); // Show first 8 commands
    const helpText = `Available commands: ${availableCommands.join(', ')}. For full list, check the help section.`;
    this.speak(helpText);
  }

  setOnResult(callback) {
    this.onResultCallback = callback;
  }

  setOnError(callback) {
    this.onErrorCallback = callback;
  }

  isSupported() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }
}

// Create singleton instance
const voiceCommandService = new VoiceCommandService();
export default voiceCommandService;