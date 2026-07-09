'use client';

import { useState, useEffect } from 'react';

export default function FeedbackWidget() {
  const [sessionId, setSessionId] = useState('');
  const [vote, setVote] = useState<'up' | 'down' | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Generate a unique session ID if not already stored
    let id = localStorage.getItem('llm-finder-session-id');
    if (!id) {
      id = String(Math.floor(Date.now() / 1000));
      localStorage.setItem('llm-finder-session-id', id);
    }
    setSessionId(id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (vote === null) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: sessionId,
            vote: vote === 'up' ? 1 : 0,
            comment: comment.trim() || null,
          }),
        }
      );

      if (response.ok) {
        setSubmitted(true);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error('Failed to submit feedback', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="feedback-section glass-card animate-slide-up-3" style={{ marginTop: '3rem' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
        Was this recommendation helpful?
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Help us improve Perfect LLM Model Finder with anonymous feedback!
      </p>

      {submitted ? (
        <div style={{ color: '#10b981', fontWeight: 600 }}>
          Thank you for your feedback! 💖
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="feedback-buttons">
            <button
              type="button"
              className={`feedback-btn ${vote === 'up' ? 'active' : ''}`}
              onClick={() => setVote('up')}
              title="Thumbs Up"
            >
              👍
            </button>
            <button
              type="button"
              className={`feedback-btn ${vote === 'down' ? 'active' : ''}`}
              onClick={() => setVote('down')}
              title="Thumbs Down"
            >
              👎
            </button>
          </div>

          {vote !== null && (
            <div className="animate-fade-in" style={{ marginTop: '1.5rem' }}>
              <textarea
                placeholder="Optional: Please share what we can improve..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ minHeight: '80px', marginBottom: '1rem' }}
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ padding: '10px 24px', fontSize: '0.95rem' }}
              >
                {loading ? 'Submitting...' : 'Submit Feedback ✨'}
              </button>
            </div>
          )}
        </form>
      )}

      {showToast && (
        <div className="toast">
          Feedback submitted successfully! 🚀
        </div>
      )}
    </section>
  );
}
