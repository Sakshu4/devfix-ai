import type { TechError } from '../types';

interface Props {
  error: TechError;
  onClick: () => void;
}

const severityClass: Record<string, string> = {
  LOW: 'badge-low', MEDIUM: 'badge-medium',
  HIGH: 'badge-high', CRITICAL: 'badge-critical',
};

export default function ErrorCard({ error, onClick }: Props) {
  const sev = error.severity ?? 'MEDIUM';
  return (
    <div className="card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="error-card-code">{error.errorCode}</div>
      <div className="error-card-message">{error.errorMessage}</div>
      <div className="error-card-meta">
        <span className={`badge ${severityClass[sev] ?? 'badge-medium'}`}>
          {sev}
        </span>
        {error.category  && <span className="meta-chip">{error.category}</span>}
        {error.osAffected && <span className="meta-chip">🖥 {error.osAffected}</span>}
      </div>
      <div className="error-card-cause">{error.cause}</div>
      <div className="error-card-footer">
        <span className="tech-tag">🔧 {error.technology.name}</span>
        <span style={{ fontSize: '0.78rem', color: 'var(--accent)' }}>View fix →</span>
      </div>
    </div>
  );
}
