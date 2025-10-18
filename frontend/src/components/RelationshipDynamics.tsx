import { useState, useEffect } from 'react';
import type { PeerRelationship } from '../types';
import type { Socket } from 'socket.io-client';

interface RelationshipDynamicsProps {
  socket: Socket | null;
}

export function RelationshipDynamics({ socket }: RelationshipDynamicsProps) {
  const [relationships, setRelationships] = useState<PeerRelationship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socket) return;

    const fetchRelationships = () => {
      socket.emit('get_peer_relationships', (data: PeerRelationship[]) => {
        setRelationships(data);
        setLoading(false);
      });
    };

    fetchRelationships();
    const interval = setInterval(fetchRelationships, 20000); // Refresh every 20 seconds

    return () => clearInterval(interval);
  }, [socket]);

  if (loading) {
    return (
      <div className="insight-card">
        <h3>Relationship Dynamics</h3>
        <p className="insight-loading">Analyzing relationships...</p>
      </div>
    );
  }

  // Group relationships by fromPeer for cleaner display
  const groupedRelationships = relationships.reduce((acc, rel) => {
    if (!acc[rel.fromPeer]) {
      acc[rel.fromPeer] = [];
    }
    acc[rel.fromPeer].push(rel);
    return acc;
  }, {} as Record<string, PeerRelationship[]>);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '#4CAF50';
      case 'negative': return '#f44336';
      default: return '#9E9E9E';
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      default: return '😐';
    }
  };

  return (
    <div className="insight-card">
      <h3>Relationship Dynamics</h3>
      <div className="insight-content">
        {relationships.length === 0 ? (
          <p className="no-data">Not enough participants for relationship analysis</p>
        ) : (
          <div className="relationships-list">
            {Object.entries(groupedRelationships).map(([fromPeer, rels]) => (
              <div key={fromPeer} className="relationship-group">
                <h4>{fromPeer}'s Perspective</h4>
                {rels.map((rel, idx) => (
                  <div key={idx} className="relationship-item">
                    <div className="relationship-header">
                      <span className="peer-name">→ {rel.toPeer}</span>
                      <span 
                        className="sentiment-badge"
                        style={{ backgroundColor: getSentimentColor(rel.sentiment) }}
                      >
                        {getSentimentEmoji(rel.sentiment)} {rel.sentiment}
                      </span>
                    </div>
                    <p className="relationship-description">{rel.description}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
