import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Message, User } from '../types';

interface UseSocketReturn {
  socket: Socket | null;
  connected: boolean;
  messages: Message[];
  users: User[];
  sessionId: string;
  sendMessage: (content: string) => void;
  registerUser: (username: string) => void;
}

export function useSocket(): UseSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Auto-detect server from current location
    const serverUrl = window.location.origin.replace(':5173', ':3000');
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('history', (history: Message[]) => {
      setMessages(history);
    });

    newSocket.on('session_id', (id: string) => {
      setSessionId(id);
    });

    setSocket(newSocket);

    // Fetch users periodically
    const fetchUsers = () => {
      newSocket.emit('get_users', (response: { users: User[]; agents: User[] }) => {
        setUsers([...response.users, ...response.agents]);
      });
    };

    const interval = setInterval(fetchUsers, 3000);

    return () => {
      clearInterval(interval);
      newSocket.close();
    };
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (socket && content.trim()) {
      socket.emit('chat', { content: content.trim() });
    }
  }, [socket]);

  const registerUser = useCallback((username: string) => {
    if (socket) {
      socket.emit('register', { username, type: 'human' });
    }
  }, [socket]);

  return {
    socket,
    connected,
    messages,
    users,
    sessionId,
    sendMessage,
    registerUser
  };
}
