import { useState } from 'react';

export function Insights() {
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
            <p className="insights-placeholder">
              Real-time insights will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
