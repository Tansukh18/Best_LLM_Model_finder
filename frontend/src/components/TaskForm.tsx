'use client';

import { useState } from 'react';
import LoadingProgress from './LoadingProgress';
import ResultsPanel from './ResultsPanel';

interface ModelInfo {
  model_name: string;
  full_name: string;
  params_b: number;
  average_score: number;
  architecture: string;
  license: string;
  benchmark_scores: Record<string, number>;
}

interface ApiResponse {
  overall_best: ModelInfo;
  size_filtered_best: ModelInfo;
  recommended_benchmarks: string[];
  detected_language: string;
  was_translated: boolean;
}

export default function TaskForm() {
  const [task, setTask] = useState('');
  const [modelSize, setModelSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;

    setLoading(true);
    setResults(null);
    setError(null);

    // Give a small delay before API call so user can see progress animation starting
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/find-model`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: task,
          model_size: modelSize,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to fetch recommendations');
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while finding matching models.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-up-1">
      <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Step 1: Task Description */}
        <div>
          <label className="step-label">
            <span>📝</span> Step 1: Describe Your Task
          </label>
          <textarea
            placeholder="E.g., A Python code assistant to write regex patterns, or a medical assistant to answer biology questions..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {/* Step 2: Model Size Slider */}
        <div>
          <label className="step-label">
            <span>⚖️</span> Step 2: Small Model Size Preference
          </label>
          <div className="size-display">{modelSize} Billion</div>
          <input
            type="range"
            min="1"
            max="50"
            value={modelSize}
            onChange={(e) => setModelSize(Number(e.target.value))}
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            <span>1B (Fast, lightweight)</span>
            <span>50B (Capable, heavy)</span>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading || !task.trim()}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
        >
          {loading ? 'Finding Match...' : 'Find My Perfect Match! 🎯'}
        </button>
      </form>

      {loading && <LoadingProgress />}

      {error && (
        <div 
          className="glass-card animate-fade-in" 
          style={{ 
            marginTop: '2rem', 
            borderColor: 'rgba(239, 68, 68, 0.4)', 
            background: 'rgba(239, 68, 68, 0.05)', 
            color: '#ef4444' 
          }}
        >
          <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>⚠️ Error Finding Match</h4>
          <p style={{ fontSize: '0.95rem' }}>{error}</p>
        </div>
      )}

      {results && !loading && (
        <ResultsPanel
          overallBest={results.overall_best}
          sizeFilteredBest={results.size_filtered_best}
          recommendedBenchmarks={results.recommended_benchmarks}
          detectedLanguage={results.detected_language}
          wasTranslated={results.was_translated}
          modelSize={modelSize}
        />
      )}
    </div>
  );
}
