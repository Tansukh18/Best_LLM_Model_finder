'use client';

interface ModelInfo {
  model_name: string;
  full_name: string;
  params_b: number;
  average_score: number;
  architecture: string;
  license: string;
  benchmark_scores: Record<string, number>;
}

interface ResultsPanelProps {
  overallBest: ModelInfo;
  sizeFilteredBest: ModelInfo;
  recommendedBenchmarks: string[];
  detectedLanguage: string;
  wasTranslated: boolean;
  modelSize: number;
}

export default function ResultsPanel({
  overallBest,
  sizeFilteredBest,
  recommendedBenchmarks,
  detectedLanguage,
  wasTranslated,
  modelSize
}: ResultsPanelProps) {
  
  const renderModelTable = (model: ModelInfo) => {
    return (
      <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Model Name</strong></td>
              <td>
                <span className="badge" style={{ fontSize: '0.9rem', padding: '6px 12px' }}>
                  {model.model_name}
                </span>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {model.full_name}
                </div>
              </td>
            </tr>
            <tr>
              <td><strong>Size (B Params)</strong></td>
              <td>{model.params_b} B</td>
            </tr>
            <tr>
              <td><strong>Average Score</strong></td>
              <td style={{ fontWeight: 'bold', color: '#10b981' }}>{model.average_score} %</td>
            </tr>
            <tr>
              <td><strong>Architecture</strong></td>
              <td>{model.architecture}</td>
            </tr>
            <tr>
              <td><strong>License</strong></td>
              <td>{model.license}</td>
            </tr>
            {Object.entries(model.benchmark_scores).map(([benchmark, score]) => (
              <tr key={benchmark}>
                <td>{benchmark} Score</td>
                <td style={{ color: 'var(--accent-secondary)' }}>{score} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="results-section animate-fade-in">
      <h2 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>
        Your Perfect LLM Matches! 🎉
      </h2>

      {wasTranslated && (
        <div className="translation-notice">
          <span>🌐</span>
          <span>
            Original language detected: <strong>{detectedLanguage.toUpperCase()}</strong>. 
            Task was translated to English for optimal benchmark matching.
          </span>
        </div>
      )}

      {/* 🏆 Overall Best Model */}
      <div className="glass-card result-card animate-slide-up-1" style={{ marginBottom: '2rem' }}>
        <div className="result-card-title">
          <span>🏆</span>
          <span>Overall Best Match</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
          This is the highest performing open-source model available on the leaderboard for your recommended benchmarks.
        </p>
        {renderModelTable(overallBest)}
      </div>

      {/* 🎯 Best Sized Model */}
      <div className="glass-card result-card animate-slide-up-2" style={{ marginBottom: '2rem' }}>
        <div className="result-card-title">
          <span>🎯</span>
          <span>Best Match Under {modelSize}B Parameters</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
          Optimized for resource constraints. This is the top-performing model matching your size preference.
        </p>
        {renderModelTable(sizeFilteredBest)}
      </div>

      {/* 📊 Relevant Benchmarks */}
      <div className="glass-card result-card animate-slide-up-3">
        <div className="result-card-title">
          <span>📊</span>
          <span>Recommended Evaluation Benchmarks</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
          AI selected these benchmarks as the most representative for testing models on your task:
        </p>
        <div className="benchmark-list">
          {recommendedBenchmarks.map((benchmark) => (
            <span key={benchmark} className="benchmark-tag">
              {benchmark}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
