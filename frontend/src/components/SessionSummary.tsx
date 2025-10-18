import { useState, useEffect } from 'react';
import type { SessionSummary as SessionSummaryType } from '../types';
import type { Socket } from 'socket.io-client';

interface SessionSummaryProps {
  socket: Socket | null;
}

export function SessionSummary({ socket }: SessionSummaryProps) {
  const [summary, setSummary] = useState<SessionSummaryType | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Fetch summary immediately (will get cached version if available)
    socket.emit('get_session_summary', (data: SessionSummaryType) => {
      setSummary(data);
    });

    // Listen for real-time summary updates
    const handleSummaryUpdate = (data: SessionSummaryType) => {
      setSummary(data);
    };

    socket.on('summary_updated', handleSummaryUpdate);

    // Refresh every 30 seconds to stay in sync with server updates
    const interval = setInterval(() => {
      socket.emit('get_session_summary', (data: SessionSummaryType) => {
        setSummary(data);
      });
    }, 30000);

    return () => {
      socket.off('summary_updated', handleSummaryUpdate);
      clearInterval(interval);
    };
  }, [socket]);

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
