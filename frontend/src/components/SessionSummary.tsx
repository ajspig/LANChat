import { useState, useEffect } from 'react';
import type { SessionSummary as SessionSummaryType } from '../types';
import type { Socket } from 'socket.io-client';

interface SessionSummaryProps {
  socket: Socket | null;
}

export function SessionSummary({ socket }: SessionSummaryProps) {
  const [summary, setSummary] = useState<SessionSummaryType | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socket) return;

    const fetchSummary = () => {
      socket.emit('get_session_summary', (data: SessionSummaryType) => {
        setSummary(data);
        setLoading(false);
      });
    };

    fetchSummary();
    const interval = setInterval(fetchSummary, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [socket]);

  if (loading) {
    return (
      <div className="insight-card">
        <h3>Session at a Glance</h3>
        <p className="insight-loading">Loading summary...</p>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="insight-card">
      <h3>Session at a Glance</h3>
      <div className="insight-content">
        <p className="summary-short">{summary.short}</p>
        <button 
          className="expand-button"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '▼ Show Less' : '▶ Show More'}
        </button>
        {expanded && (
          <div className="summary-full">
            <p>{summary.full}</p>
            <div className="summary-meta">
              <span>{summary.messageCount} messages</span>
              <span>Updated: {new Date(summary.lastUpdated).toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
