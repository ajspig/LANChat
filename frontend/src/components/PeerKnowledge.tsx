import { useState, useEffect } from 'react';
import type { PeerKnowledge as PeerKnowledgeType } from '../types';
import type { Socket } from 'socket.io-client';

interface PeerKnowledgeProps {
  socket: Socket | null;
}

export function PeerKnowledge({ socket }: PeerKnowledgeProps) {
  const [knowledge, setKnowledge] = useState<PeerKnowledgeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socket) return;

    const fetchKnowledge = () => {
      socket.emit('get_peer_knowledge', (data: PeerKnowledgeType[]) => {
        setKnowledge(data);
        setLoading(false);
      });
    };

    fetchKnowledge();
    const interval = setInterval(fetchKnowledge, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, [socket]);

  if (loading) {
    return (
      <div className="insight-card">
        <h3>Knowledge State</h3>
        <p className="insight-loading">Loading peer knowledge...</p>
      </div>
    );
  }

  return (
    <div className="insight-card">
      <h3>Knowledge State</h3>
      <div className="insight-content">
        {knowledge.length === 0 ? (
          <p className="no-data">No peers in session yet</p>
        ) : (
          <div className="peer-knowledge-list">
            {knowledge.map((peer) => (
              <div key={peer.peerId} className="peer-knowledge-item">
                <h4>{peer.peerName}</h4>
                {peer.topics.length === 0 ? (
                  <p className="no-topics">No topics yet</p>
                ) : (
                  <ul className="topic-list">
                    {peer.topics.map((topic, idx) => (
                      <li key={idx} className={topic.isRecent ? 'recent' : ''}>
                        {topic.content}
                        {topic.isRecent && <span className="badge">NEW</span>}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="knowledge-count">
                  {peer.topics.length} {peer.topics.length === 1 ? 'topic' : 'topics'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
