import { useState } from 'react';
import type { Socket } from 'socket.io-client';
import { SessionSummary } from './SessionSummary';
import { PeerKnowledge } from './PeerKnowledge';
import { RelationshipDynamics } from './RelationshipDynamics';

interface InsightsProps {
  socket: Socket | null;
}

export function Insights({ socket }: InsightsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`insights-panel ${isOpen ? 'open' : 'closed'}`}>
      <button 
        className="insights-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Hide insights' : 'Show insights'}
      >
        {isOpen ? '→' : '←'} Insights
      </button>
      
      {isOpen && (
        <div className="insights-content">
          <div className="insights-header">
            <h2>HONCHO INSIGHTS</h2>
          </div>
          <div className="insights-body">
            <SessionSummary socket={socket} />
            <PeerKnowledge socket={socket} />
            <RelationshipDynamics socket={socket} />
          </div>
        </div>
      )}
    </div>
  );
}
