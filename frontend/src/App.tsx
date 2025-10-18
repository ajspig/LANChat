import { useState, useEffect } from 'react';
import { Chat } from './components/Chat';
import { Insights } from './components/Insights';
import { useSocket } from './hooks/useSocket';
import './styles.css';

function App() {
  const { socket, messages, users, sessionId, sendMessage, registerUser, connected } = useSocket();
  const [currentUser, setCurrentUser] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showUsernameModal, setShowUsernameModal] = useState(true);
  const [usernameInput, setUsernameInput] = useState('');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const username = usernameInput.trim() || `User${Math.floor(Math.random() * 1000)}`;
    setCurrentUser(username);
    registerUser(username);
    setShowUsernameModal(false);
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (showUsernameModal) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h1>┌─────────────────────┐</h1>
          <h1>│  HONCHO LAN CHAT    │</h1>
          <h1>└─────────────────────┘</h1>
          <form onSubmit={handleUsernameSubmit}>
            <label htmlFor="username">Enter your username:</label>
            <input
              id="username"
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Leave blank for random name"
              autoFocus
            />
            <button type="submit">Join Chat</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="connection-status">
          {connected ? '● CONNECTED' : '○ DISCONNECTED'}
        </div>
        <button 
          className="theme-toggle" 
          onClick={handleThemeToggle}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </header>
      
      <main className="app-main">
        <div className="chat-section">
          <Chat
            messages={messages}
            users={users}
            currentUser={currentUser}
            sessionId={sessionId}
            onSendMessage={sendMessage}
          />
        </div>
        
        <div className="insights-section">
          <Insights socket={socket} />
        </div>
      </main>
    </div>
  );
}

export default App;
