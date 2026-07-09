'use client';

import { useState } from 'react';
import ShareModal from './ShareModal';

export default function HeroSection() {
  const [showShare, setShowShare] = useState(false);

  return (
    <section className="hero-section">
      <div className="hero-orb hero-orb-1"></div>
      <div className="hero-orb hero-orb-2"></div>
      
      <div style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 10 }}>
        <button className="btn-secondary" onClick={() => setShowShare(true)} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          Share App 📢
        </button>
      </div>

      <h1 className="hero-title">
        Find Your <span className="gradient-text">Perfect LLM</span> Match 🔍
      </h1>
      <p className="hero-subtitle">
        Stop swiping left on incompatible models. Describe your project/use case and find your ideal open-source LLM soulmate backed by Open LLM Benchmarks.
      </p>

      {showShare && <ShareModal onClose={() => setShowShare(false)} />}
    </section>
  );
}
