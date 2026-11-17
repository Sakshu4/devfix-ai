import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTechnologies } from '../api/devfix';
import { useAuth } from '../api/AuthContext';
import AuthModal from '../components/AuthModal';
import type { Technology } from '../types';

export default function Technologies() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [techs,   setTechs]   = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth Modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('access this feature');

  useEffect(() => {
    getAllTechnologies()
      .then(setTechs)
      .finally(() => setLoading(false));
  }, []);

  const requireAuth = (actionDescription: string, callback: () => void) => {
    if (user) {
      callback();
    } else {
      setModalAction(actionDescription);
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        actionName={modalAction}
      />

      <div className="container page">
        <div className="section-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <h1 className="section-title" style={{ fontSize: '1.6rem' }}>Technologies</h1>
              {!user && (
                <span className="palette-indicator" style={{ fontSize: '0.78rem', color: 'var(--accent)' }}>
                  🔒 Sign in to access guides & fixes
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
              Browse the DevFix knowledge base by technology
            </p>
          </div>
          {!loading && <span className="section-count">{techs.length} technologies</span>}
        </div>

        {loading ? (
          <div className="state-center"><div className="spinner" /></div>
        ) : (
          <div className="grid grid-2">
            {techs.map(tech => (
              <div className="card" key={tech.id}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap' }}>
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{tech.name}</h2>
                    {tech.category && (
                      <span className="meta-chip" style={{ marginTop: 4, display: 'inline-block' }}>{tech.category}</span>
                    )}
                  </div>
                  {tech.latestVersion && (
                    <span style={{
                      fontFamily: 'JetBrains Mono', fontSize: '0.78rem',
                      background: 'var(--accent-subtle)', color: 'var(--accent)',
                      border: '1px solid var(--border-accent)',
                      padding: '3px 10px', borderRadius: 6
                    }}>v{tech.latestVersion}</span>
                  )}
                </div>

                {/* Description */}
                {tech.description && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 14 }}>
                    {tech.description}
                  </p>
                )}

                {/* Errors count */}
                {tech.errors && tech.errors.length > 0 && (
                  <div style={{
                    background: 'var(--bg-secondary)', borderRadius: 8,
                    padding: '10px 14px', marginBottom: 16
                  }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                      Known errors:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {tech.errors.slice(0, 4).map(e => (
                        <span
                          key={e.id}
                          className="tag"
                          style={{ cursor: 'pointer', fontSize: '0.7rem' }}
                          onClick={() => requireAuth(`view the fix for ${e.errorCode}`, () => navigate(`/errors/${e.id}`))}
                        >
                          {e.errorCode}
                        </span>
                      ))}
                      {tech.errors.length > 4 && (
                        <span className="meta-chip">+{tech.errors.length - 4} more</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-outline"
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                    onClick={() => requireAuth(`access the full installation guide for ${tech.name}`, () => navigate(`/guide/${tech.id}`))}
                  >
                    📋 Install Guide
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, justifyContent: 'center', padding: '8px 14px' }}
                    onClick={() => requireAuth(`search documented errors for ${tech.name}`, () => navigate(`/search?q=${encodeURIComponent(tech.name)}`))}
                  >
                    🔍 Search Errors
                  </button>
                  {tech.officialWebsite && (
                    <a
                      href={tech.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ padding: '8px 14px' }}
                      title="Visit official website"
                    >
                      🌐
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
