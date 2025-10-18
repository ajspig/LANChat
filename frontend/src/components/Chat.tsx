import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import type { Message, User } from '../types';

interface ChatProps {
  messages: Message[];
  users: User[];
  currentUser: string;
  sessionId: string;
  onSendMessage: (content: string) => void;
}

export function Chat({ messages, users, currentUser, sessionId, onSendMessage }: ChatProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const chatMessages = messages.filter(m => 
    m.type === 'chat' || m.type === 'agent_response'
  );

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="session-info">
          <span className="label">HONCHO LAN CHAT</span>
          {sessionId && <span className="session-id">Session: {sessionId.slice(0, 8)}</span>}
        </div>
        <div className="user-list">
          {users.map(user => (
            <span key={user.id} className={`user-badge ${user.type}`}>
              {user.type === 'agent' ? '🤖' : '👤'} {user.username}
            </span>
          ))}
        </div>
      </div>

      <div className="messages-container">
        {chatMessages.map((msg) => {
          const isCurrentUser = msg.username === currentUser;
          return (
            <div 
              key={msg.id} 
              className={`message ${isCurrentUser ? 'current-user' : 'other-user'} ${msg.metadata.userType || 'human'}`}
            >
              <div className="message-header">
                <span className="username">{msg.username}</span>
                <span className="timestamp">{formatTime(msg.metadata.timestamp)}</span>
              </div>
              <div className="message-content">{msg.content}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-form" onSubmit={handleSubmit}>
        <div className="input-row single-row">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Type a message as ${currentUser}...`}
            className="message-input"
          />
          <button type="submit" className="send-button">▶</button>
        </div>
      </form>
    </div>
  );
}
