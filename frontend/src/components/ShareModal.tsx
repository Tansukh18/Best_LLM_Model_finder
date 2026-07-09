'use client';

import { useState } from 'react';

interface ShareModalProps {
  onClose: () => void;
}

export default function ShareModal({ onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  
  const appUrl = typeof window !== 'undefined' ? window.location.href : 'https://model-finder.vercel.app';
  const shareText = `Looking for the perfect open-source LLM? 🤔\nCheck out Perfect LLM Model Finder - it matches you with the ideal LLM for your needs!\n\nTry this free tool and find your perfect model match now 🚀\nLink to the app: ${appUrl}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareOnTwitter = () => {
    const url = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Share Your Experience 🕵️‍♂️</h2>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              fontSize: '1.5rem', 
              cursor: 'pointer' 
            }}
          >
            &times;
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Share Perfect LLM Model Finder with your network and help others find their perfect AI model match!
        </p>

        <textarea 
          readOnly 
          value={shareText} 
          style={{ 
            width: '100%', 
            height: '180px', 
            marginBottom: '1.5rem', 
            fontSize: '0.9rem',
            background: 'rgba(10, 10, 18, 0.6)',
            borderColor: 'rgba(124, 58, 237, 0.1)'
          }}
        />

        <div className="share-buttons">
          <button className="share-btn" onClick={shareOnLinkedIn}>
            💼 LinkedIn
          </button>
          <button className="share-btn" onClick={shareOnTwitter}>
            𝕏 Twitter
          </button>
          <button className="btn-primary" onClick={copyToClipboard} style={{ flexGrow: 1, padding: '12px 24px' }}>
            {copied ? 'Copied! 📋' : '📄 Copy Link'}
          </button>
        </div>

        {copied && (
          <div className="toast">
            Link copied to clipboard! 📋
          </div>
        )}
      </div>
    </div>
  );
}
