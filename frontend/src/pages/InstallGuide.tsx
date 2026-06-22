import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTechnologyById } from '../api/devfix';
import ErrorCard from '../components/ErrorCard';
import type { Technology } from '../types';

export default function InstallGuide() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tech, setTech]       = useState<Technology | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    getTechnologyById(Number(id))
      .then(setTech)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="state-center" style={{ marginTop: 80 }}><div className="spinner" /></div>;

  if (notFound || !tech) return (
    <div className="state-center" style={{ marginTop: 80 }}>
      <div className="state-icon">❌</div>
      <div className="state-title">Technology not found</div>
      <button className="btn btn-outline" onClick={() => navigate('/technologies')} style={{ marginTop: 16 }}>
        ← Back to Technologies
      </button>
    </div>
  );

  // Parse installation steps into numbered array
  const steps = tech.installationSteps
    ? tech.installationSteps.split('\n').filter(s => s.trim())
    : [];

  return (
    <div className="container page" style={{ maxWidth: 860 }}>
      {/* ── Back ── */}
      <button className="btn btn-outline" onClick={() => navigate('/technologies')}
        style={{ marginBottom: 28, padding: '7px 16px' }}>
        ← Back to Technologies
      </button>

      {/* ── Header ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{tech.name}</h1>
              {tech.latestVersion && (
                <span style={{
                  fontFamily: 'JetBrains Mono', fontSize: '0.8rem',
                  background: 'rgba(59,130,246,0.1)', color: 'var(--accent)',
                  padding: '3px 10px', borderRadius: 6
                }}>v{tech.latestVersion}</span>
              )}
            </div>
            {tech.category && <span className="meta-chip">{tech.category}</span>}
            {tech.description && (
              <p style={{ color: 'var(--text-secondary)', marginTop: 10, fontSize: '0.95rem' }}>
                {tech.description}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {tech.officialWebsite && (
              <a href={tech.officialWebsite} target="_blank" rel="noopener noreferrer"
                className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                🌐 Official Site
              </a>
            )}
            {tech.downloadUrl && (
              <a href={tech.downloadUrl} target="_blank" rel="noopener noreferrer"
                className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                ⬇ Download
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Installation Steps ── */}
      {steps.length > 0 ? (
        <div className="card" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.2rem' }}>📋</span> Installation Steps
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {steps.map((step, idx) => {
              const isNumbered = /^\d+\./.test(step.trim());
              const content = step.replace(/^\d+\.\s*/, '').trim();
              return (
                <div key={idx} style={{
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  padding: '12px 16px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 8
                }}>
                  <span style={{
                    minWidth: 28, height: 28, borderRadius: '50%',
                    background: 'rgba(59,130,246,0.15)',
                    border: '1px solid var(--border-accent)',
                    color: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, fontFamily: 'JetBrains Mono',
                    flexShrink: 0
                  }}>
                    {isNumbered ? idx + 1 : '→'}
                  </span>
                  <span style={{
                    fontFamily: 'JetBrains Mono', fontSize: '0.85rem',
                    color: 'var(--text-secondary)', lineHeight: 1.7
                  }}>
                    {content || step.trim()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 20, textAlign: 'center', padding: 40 }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Installation guide not yet available for {tech.name}.
          </div>
        </div>
      )}

      {/* ── Known Errors ── */}
      {tech.errors && tech.errors.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span> Common Errors for {tech.name}
            <span className="section-count" style={{ marginLeft: 4 }}>{tech.errors.length} known</span>
          </h2>
          <div className="grid grid-2">
            {tech.errors.map(err => {
              // Embedded errors from GET /technologies/:id don't include the parent technology
              // (circular ref protection). Inject it manually so ErrorCard works correctly.
              const fullErr = { ...err, technology: { id: tech.id, name: tech.name, category: tech.category, description: tech.description, latestVersion: tech.latestVersion, downloadUrl: tech.downloadUrl, officialWebsite: tech.officialWebsite, commonErrors: tech.commonErrors, installationSteps: tech.installationSteps } };
              return (
                <ErrorCard key={err.id} error={fullErr as any} onClick={() => navigate(`/errors/${err.id}`)} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
