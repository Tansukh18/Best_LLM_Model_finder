'use client';

import { useState, useEffect } from 'react';

interface Step {
  label: string;
  percentage: number;
}

const steps: Step[] = [
  { label: 'Detecting language...', percentage: 15 },
  { label: 'Loading benchmark data...', percentage: 30 },
  { label: 'Initializing Gemini AI...', percentage: 45 },
  { label: 'Processing task requirements...', percentage: 60 },
  { label: 'Finding perfect model matches...', percentage: 80 },
  { label: 'Preparing your matches...', percentage: 100 }
];

export default function LoadingProgress() {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentStepIdx >= steps.length) return;

    const targetProgress = steps[currentStepIdx].percentage;
    const increment = (targetProgress - progress) / 20;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= targetProgress) {
          clearInterval(timer);
          // Advance to next step after a slight pause
          setTimeout(() => {
            setCurrentStepIdx((idx) => idx + 1);
          }, 600);
          return targetProgress;
        }
        return next;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [currentStepIdx]);

  const activeLabel = currentStepIdx < steps.length 
    ? steps[currentStepIdx].label 
    : 'Finishing up...';

  return (
    <div className="glass-card animate-fade-in" style={{ marginTop: '2rem', padding: '2rem 1.5rem', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <span>Analyzing Task</span>
        <span>{Math.round(progress)}%</span>
      </div>
      
      <div className="progress-container">
        <div 
          className="progress-bar progress-shimmer" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="loading-status" style={{ marginTop: '1rem', fontStyle: 'italic' }}>
        {activeLabel}
      </div>
    </div>
  );
}
