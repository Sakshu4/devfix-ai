import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getErrorById } from '../api/devfix';
import type { TechError } from '../types';

const severityClass: Record<string, string> = {
  LOW: 'badge-low', MEDIUM: 'badge-medium',
  HIGH: 'badge-high', CRITICAL: 'badge-critical',
};

export default function ErrorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error,   setError]   = useState<TechError | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    getErrorById(Number(id))
      .then(setError)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="state-center" style={{ marginTop: 80 }}><div className="spinner" /></div>;

  if (notFound || !error) return (
    <div className="state-center" style={{ marginTop: 80 }}>
      <div className="state-icon">❌</div>
      <div className="state-title">Error not found</div>
      <button className="btn btn-outline" onClick={() => navigate('/search')} style={{ marginTop: 16 }}>
        ← Back to Search
      </button>
    </div>
  );

  const sev = error.severity ?? 'MEDIUM';

  return (
    <div className="container page" style={{ maxWidth: 800 }}>
      {/* ── Back ── */}
      <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ marginBottom: 28, padding: '7px 16px' }}>
        ← Back
      </button>

      {/* ── Header ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div className="error-card-code" style={{ marginBottom: 12 }}>{error.errorCode}</div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 14, lineHeight: 1.4 }}>
              {error.errorMessage}
            </h1>
            <div className="error-card-meta">
              <span className={`badge ${severityClass[sev]}`}>{sev}</span>
              {error.category   && <span className="meta-chip">{error.category}</span>}
              {error.osAffected && <span className="meta-chip">🖥 {error.osAffected}</span>}
              <span className="meta-chip">🔧 {error.technology.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Cause ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.2rem' }}>🔍</span> Why This Happens
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{error.cause}</p>
      </div>

      {/* ── Solution ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.2rem' }}>✅</span> Step-by-Step Fix
        </h2>
        <div className="solution-block">{error.solution}</div>
      </div>

      {/* ── Tags ── */}
      {error.tags && (
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>🏷 Tags</h2>
          <div className="tags">
            {error.tags.split(',').map(t => (
              <span
                key={t}
                className="tag"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/search?q=${t.trim()}`)}
              >
                {t.trim()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
