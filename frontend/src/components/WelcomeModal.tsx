'use client';

interface WelcomeModalProps {
  onClose: () => void;
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="gradient-text"
          style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}
        >
          Welcome to LLM Finder 🚀
        </h2>
        <p
          style={{
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
          }}
        >
          Find the perfect open-source LLM for your specific needs, powered by
          real benchmark data.
        </p>
        <ul
          style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginBottom: '2rem',
          }}
        >
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🎯</span>
            <span>Describe your task in natural language</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem' }}>⚖️</span>
            <span>Set your preferred model size</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🤖</span>
            <span>Get AI-powered benchmark recommendations</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🌍</span>
            <span>Works in any language - auto-translates!</span>
          </li>
        </ul>
        <button
          className="btn-primary"
          onClick={onClose}
          style={{ width: '100%' }}
        >
          Get Started ✨
        </button>
      </div>
    </div>
  );
}
