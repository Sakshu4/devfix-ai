import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllErrors, getAllTechnologies } from '../api/devfix';
import { useAuth } from '../api/AuthContext';
import ErrorCard from '../components/ErrorCard';
import AuthModal from '../components/AuthModal';
import type { TechError } from '../types';

const EXAMPLE_SEARCHES = [
  'JAVA_HOME', 'port 8080', 'OutOfMemoryError',
  'mvn not recognized', 'NullPointerException', 'docker daemon',
  'merge conflict', 'module not found',
];

const PLATFORM_TOOLS = [
  {
    path: '/ai',
    icon: '🤖',
    title: 'AI Troubleshooter',
    badge: 'OpenRouter AI',
    desc: 'Instant, intelligent diagnosis for terminal errors, stack traces, and environment bugs.',
    actionText: 'Diagnose with AI',
  },
  {
    path: '/analyze',
    icon: '🔬',
    title: 'Error Log Analyzer',
    badge: 'Log Parser',
    desc: 'Paste messy terminal logs or stack traces to auto-extract error signals and matching fixes.',
    actionText: 'Analyze Log',
  },
  {
    path: '/screenshot',
    icon: '📸',
    title: 'Screenshot OCR',
    badge: 'Tesseract OCR',
    desc: 'Drop a screenshot of your error — optical recognition extracts code and diagnoses the fix.',
    actionText: 'Extract & Fix',
  },
  {
    path: '/scanner',
    icon: '🖥️',
    title: 'System Scanner',
    badge: 'CLI Detector',
    desc: 'Detect installed versions of Java, Maven, Docker, Node.js and missing path variables.',
    actionText: 'Scan My Machine',
  },
  {
    path: '/readiness',
    icon: '✅',
    title: 'Readiness Checker',
    badge: 'Stack Audit',
    desc: 'Interactive checklist verifying if your machine is ready for Spring Boot, React, or Full Stack.',
    actionText: 'Check Readiness',
  },
  {
    path: '/roadmap',
    icon: '🗺️',
    title: 'Setup Roadmaps',
    badge: 'Interactive',
    desc: 'Step-by-step developer setup paths with progress tracking and installation links.',
    actionText: 'View Roadmaps',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [criticalErrors, setCriticalErrors] = useState<TechError[]>([]);
  const [stats, setStats] = useState({ errors: 0, technologies: 0 });
  const [searchQuery, setSearchQuery] = useState('');

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('perform this task');

  useEffect(() => {
    // Fetch top CRITICAL + HIGH errors for Common Fixes section
    getAllErrors().then(all => {
      const topErrors = all
        .filter(e => e.severity === 'CRITICAL' || e.severity === 'HIGH')
        .slice(0, 6);
      setCriticalErrors(topErrors);
      setStats(s => ({ ...s, errors: all.length }));
    }).catch(() => {});

    getAllTechnologies().then(techs => {
      setStats(s => ({ ...s, technologies: techs.length }));
    }).catch(() => {});
  }, []);

  // Guard: if user is logged in, run action; otherwise prompt login modal
  const requireAuthForTask = (actionDescription: string, onAuthorized: () => void) => {
    if (user) {
      onAuthorized();
    } else {
      setModalAction(actionDescription);
      setAuthModalOpen(true);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    requireAuthForTask(`search for "${q}" and view AI diagnosis`, () => {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    });
  };

  const handleChipClick = (q: string) => {
    requireAuthForTask(`search for "${q}" and see instant fixes`, () => {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    });
  };

  const handleToolClick = (tool: typeof PLATFORM_TOOLS[0]) => {
    requireAuthForTask(`use the ${tool.title}`, () => {
      navigate(tool.path);
    });
  };

  const handleErrorClick = (err: TechError) => {
    requireAuthForTask(`view the complete solution and fix commands for ${err.errorCode || 'this error'}`, () => {
      navigate(`/errors/${err.id}`);
    });
  };

  return (
    <>
      {/* ── Auth Modal Gate ── */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        actionName={modalAction}
      />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-badge">⚡ Software Installation Intelligence</div>
        <h1>
          Fix Developer Errors<br />
          <span>Instantly with AI</span>
        </h1>
        <p>
          Search {stats.errors || '25'}+ real developer errors — Java, Maven, Docker, Git —
          with step-by-step solutions, AI diagnostics, and installation guides.
        </p>

        {/* ── Direct Hero Search Input ── */}
        <form onSubmit={handleSearchSubmit} style={{ maxWidth: 640, margin: '0 auto 28px', position: 'relative' }}>
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Paste error message, code, or keyword (e.g. JAVA_HOME, port 8080)..."
              style={{ paddingRight: 140 }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                position: 'absolute',
                right: 6,
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '8px 18px',
                fontSize: '0.85rem',
              }}
            >
              Search Fix →
            </button>
          </div>
        </form>

        <div className="hero-actions">
          <button
            className="btn btn-primary"
            onClick={() => requireAuthForTask('search the error knowledge base', () => navigate('/search'))}
          >
            🔍 Search Error Database
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/technologies')}
          >
            📦 Browse Technologies
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/roadmap')}
          >
            🗺️ Setup Roadmaps
          </button>
        </div>
      </section>

      <div className="container page" style={{ paddingTop: 0 }}>

        {/* ── Quick searches ── */}
        <div className="section-header">
          <h2 className="section-title">Common Error Searches</h2>
          <span className="section-count">Try one →</span>
        </div>
        <div className="filter-bar">
          {EXAMPLE_SEARCHES.map(q => (
            <button
              key={q}
              className="filter-btn"
              onClick={() => handleChipClick(q)}
            >
              {q}
            </button>
          ))}
        </div>

        {/* ── Live Stats ── */}
        <div className="grid grid-3" style={{ marginTop: 32 }}>
          {[
            { icon: '🐛', count: stats.errors || '25+', label: 'Real Errors Documented' },
            { icon: '🔧', count: stats.technologies || '8', label: 'Technologies Covered' },
            { icon: '⚡', count: '5', label: 'Diagnostic Tools Available' },
          ].map(s => (
            <div className="card" key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>
                {s.count}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Interactive Developer Tools Showcase ── */}
        <div style={{ marginTop: 60 }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">🛠️ Intelligent Diagnostic Tools</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
                Everything you need to troubleshoot, audit, and fix your development environment.
              </p>
            </div>
            {!user && (
              <span className="palette-indicator" style={{ fontSize: '0.78rem', color: 'var(--accent)' }}>
                🔒 Requires free login to run tasks
              </span>
            )}
          </div>
          <div className="grid grid-3">
            {PLATFORM_TOOLS.map(tool => (
              <div
                key={tool.title}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 16,
                  cursor: 'pointer',
                }}
                onClick={() => handleToolClick(tool)}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: '1.8rem' }}>{tool.icon}</span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: 999,
                        background: 'var(--accent-subtle)',
                        color: 'var(--accent)',
                        border: '1px solid var(--border-accent)',
                      }}
                    >
                      {tool.badge}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
                    {tool.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.5 }}>
                    {tool.desc}
                  </p>
                </div>
                <button
                  className="btn btn-outline"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '8px 14px',
                    fontSize: '0.82rem',
                    borderColor: 'var(--border-accent)',
                    color: 'var(--accent)',
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    handleToolClick(tool);
                  }}
                >
                  {tool.actionText} →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Common Fixes (live from API) ── */}
        {criticalErrors.length > 0 && (
          <div style={{ marginTop: 60 }}>
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  🔴 Common Fixes
                  <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 10 }}>
                    Most critical errors developers hit
                  </span>
                </h2>
              </div>
              <button
                className="btn btn-outline"
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                onClick={() => requireAuthForTask('view all error diagnoses', () => navigate('/search'))}
              >
                View all →
              </button>
            </div>
            <div className="grid grid-2">
              {criticalErrors.map(err => (
                <ErrorCard
                  key={err.id}
                  error={err}
                  onClick={() => handleErrorClick(err)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── How it works ── */}
        <div style={{ marginTop: 60 }}>
          <h2 className="section-title" style={{ marginBottom: 24 }}>How DevFix AI Works</h2>
          <div className="grid grid-3">
            {[
              { step: '01', icon: '🔍', title: 'Search Your Error', desc: 'Type any error message, code, or keyword from your terminal' },
              { step: '02', icon: '📖', title: 'Read the Diagnosis', desc: 'See the exact cause — why the error happens in plain English' },
              { step: '03', icon: '✅', title: 'Apply the Fix', desc: 'Follow step-by-step solution and get back to coding' },
            ].map(s => (
              <div className="card" key={s.step}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono', fontSize: '0.7rem',
                    color: 'var(--accent)', background: 'var(--accent-subtle)',
                    padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-accent)'
                  }}>{s.step}</span>
                  <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
                </div>
                <h3 style={{ marginBottom: 8, fontWeight: 600 }}>{s.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Installation Guides CTA ── */}
        <div style={{ marginTop: 60, marginBottom: 20 }}>
          <div className="card" style={{
            background: 'linear-gradient(135deg, var(--accent-subtle), transparent)',
            border: '1px solid var(--border-accent)',
            textAlign: 'center', padding: '40px 24px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>📋</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>
              Installation Guides & Roadmaps
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: '0.9rem' }}>
              Step-by-step setup guides for Java, Maven, Docker, Git, Spring Boot, React, and more.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/technologies')}
              >
                Browse All Technologies →
              </button>
              <button
                className="btn btn-outline"
                onClick={() => navigate('/roadmap')}
              >
                Explore Roadmaps →
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
