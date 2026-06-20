import { useNavigate } from 'react-router-dom';

const EXAMPLE_SEARCHES = [
  'JAVA_HOME', 'port 8080', 'OutOfMemoryError',
  'mvn not recognized', 'NullPointerException', 'connection refused',
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-badge">⚡ Software Installation Intelligence</div>
        <h1>
          Fix Developer Errors<br />
          <span>Instantly with AI</span>
        </h1>
        <p>
          Search 10+ real developer errors — JAVA_HOME, Maven, Spring Boot,
          database connections — with step-by-step solutions.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate('/search')}>
            🔍 Search Errors
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/technologies')}>
            📦 Browse Technologies
          </button>
        </div>
      </section>

      {/* ── Quick searches ── */}
      <div className="container page" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <h2 className="section-title">Common Searches</h2>
          <span className="section-count">Try one →</span>
        </div>
        <div className="filter-bar">
          {EXAMPLE_SEARCHES.map(q => (
            <button
              key={q}
              className="filter-btn"
              onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)}
            >
              {q}
            </button>
          ))}
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-3" style={{ marginTop: 40 }}>
          {[
            { icon: '🐛', count: '10+', label: 'Real Errors Documented' },
            { icon: '🔧', count: '2',   label: 'Technologies Covered'  },
            { icon: '⚡', count: '5',   label: 'Error Categories'       },
          ].map(s => (
            <div className="card" key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>
                {s.count}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

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
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono', fontSize: '0.7rem',
                    color: 'var(--accent)', background: 'rgba(59,130,246,0.1)',
                    padding: '2px 8px', borderRadius: 4
                  }}>{s.step}</span>
                  <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
                </div>
                <h3 style={{ marginBottom: 8, fontWeight: 600 }}>{s.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
