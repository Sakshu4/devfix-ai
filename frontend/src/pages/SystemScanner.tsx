import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Tool definitions ──────────────────────────────────────────────────────────
interface Tool {
  id: string;
  name: string;
  command: string;
  versionPattern: RegExp;
  minVersion?: string;
  installUrl: string;
  installGuide?: number;
}

const TOOLS: Tool[] = [
  {
    id: 'java',
    name: 'Java (JDK)',
    command: 'java -version',
    versionPattern: /(\d+)[\.\d]*/,
    minVersion: '17',
    installUrl: 'https://adoptium.net',
    installGuide: 1,
  },
  {
    id: 'maven',
    name: 'Maven',
    command: 'mvn -version',
    versionPattern: /Apache Maven (\d+\.\d+\.\d+)/i,
    minVersion: '3.8',
    installUrl: 'https://maven.apache.org/download.cgi',
    installGuide: 2,
  },
  {
    id: 'node',
    name: 'Node.js',
    command: 'node -v',
    versionPattern: /v(\d+\.\d+\.\d+)/,
    minVersion: '18',
    installUrl: 'https://nodejs.org',
    installGuide: 5,
  },
  {
    id: 'npm',
    name: 'npm',
    command: 'npm -v',
    versionPattern: /(\d+\.\d+\.\d+)/,
    installUrl: 'https://nodejs.org',
  },
  {
    id: 'git',
    name: 'Git',
    command: 'git --version',
    versionPattern: /git version (\d+\.\d+)/i,
    installUrl: 'https://git-scm.com',
    installGuide: 6,
  },
  {
    id: 'python',
    name: 'Python',
    command: 'python --version',
    versionPattern: /Python (\d+\.\d+\.\d+)/i,
    installUrl: 'https://python.org',
  },
  {
    id: 'docker',
    name: 'Docker',
    command: 'docker --version',
    versionPattern: /Docker version (\d+\.\d+\.\d+)/i,
    installUrl: 'https://docker.com',
    installGuide: 4,
  },
  {
    id: 'psql',
    name: 'PostgreSQL',
    command: 'psql --version',
    versionPattern: /psql.*?(\d+\.\d+)/i,
    installUrl: 'https://postgresql.org',
  },
];

interface ScanResult {
  tool: Tool;
  detected: boolean;
  version?: string;
}

// ── Parse pasted output ───────────────────────────────────────────────────────
function parseScanOutput(rawOutput: string): ScanResult[] {
  return TOOLS.map(tool => {
    const match = rawOutput.match(tool.versionPattern);
    if (match) {
      return { tool, detected: true, version: match[1] ?? match[0] };
    }
    // Negative signals — "not recognized", "not found", "command not found"
    const cmdName = tool.command.split(' ')[0];
    const notFound = new RegExp(`${cmdName}.*not recognized|${cmdName}.*not found|command not found.*${cmdName}|Cannot find.*${cmdName}`, 'i');
    if (notFound.test(rawOutput)) {
      return { tool, detected: false };
    }
    return { tool, detected: false };
  });
}

type Stage = 'instructions' | 'paste' | 'results';

export default function SystemScanner() {
  const navigate = useNavigate();
  const [stage,   setStage]   = useState<Stage>('instructions');
  const [output,  setOutput]  = useState('');
  const [results, setResults] = useState<ScanResult[]>([]);
  const [role,    setRole]    = useState('springboot');

  const ROLE_TOOLS: Record<string, string[]> = {
    springboot: ['java', 'maven', 'git'],
    react:      ['node', 'npm', 'git'],
    fullstack:  ['java', 'maven', 'node', 'npm', 'git', 'docker', 'psql'],
    general:    ['java', 'node', 'git', 'python', 'docker', 'psql'],
  };

  const relevantTools = TOOLS.filter(t => ROLE_TOOLS[role].includes(t.id));
  const scanCommand = relevantTools.map(t => t.command).join(' & echo --- & ');

  const runScan = () => {
    if (!output.trim()) return;
    const r = parseScanOutput(output);
    setResults(r);
    setStage('results');
  };

  const installed = results.filter(r => r.detected);
  const missing   = results.filter(r => !r.detected && ROLE_TOOLS[role].includes(r.tool.id));
  const score = results.length ? Math.round((installed.length / results.length) * 100) : 0;

  return (
    <div className="container page">
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        {/* Header */}
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>
          🖥️ System Scanner
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
          Run a single command in your terminal — DevFix AI analyzes the output and tells you exactly what's installed.
        </p>

        {/* Role selector */}
        <div className="filter-bar" style={{ marginBottom: 24 }}>
          {[
            { id: 'springboot', label: '🍃 Spring Boot' },
            { id: 'react',      label: '⚛️ React' },
            { id: 'fullstack',  label: '🚀 Full Stack' },
            { id: 'general',    label: '🛠️ General' },
          ].map(r => (
            <button key={r.id} className={`filter-btn ${role === r.id ? 'active' : ''}`}
              onClick={() => { setRole(r.id); setStage('instructions'); setOutput(''); setResults([]); }}>
              {r.label}
            </button>
          ))}
        </div>

        {/* ── Stage 1: Instructions ── */}
        {stage === 'instructions' && (
          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <h2 style={{ fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(59,130,246,0.15)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700
                }}>1</span>
                Open your terminal
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Windows: Press <code style={{ fontFamily: 'JetBrains Mono', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4 }}>Win + R</code> → type <code style={{ fontFamily: 'JetBrains Mono', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4 }}>cmd</code> or <code style={{ fontFamily: 'JetBrains Mono', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4 }}>powershell</code>
              </p>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <h2 style={{ fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(59,130,246,0.15)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700
                }}>2</span>
                Run these commands one by one
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {relevantTools.map(tool => (
                  <div key={tool.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 14px',
                    border: '1px solid var(--border)'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginRight: 8 }}>{tool.name}</span>
                      <code style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem', color: 'var(--accent)' }}>
                        {tool.command}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
              onClick={() => setStage('paste')}>
              ✓ I ran the commands → Paste Output Now
            </button>
          </div>
        )}

        {/* ── Stage 2: Paste output ── */}
        {stage === 'paste' && (
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h2 style={{ fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(59,130,246,0.15)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700
                }}>3</span>
                Paste all terminal output here
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 12 }}>
                Copy everything from your terminal (including "not recognized" messages) and paste it below.
              </p>
              <textarea
                value={output}
                onChange={e => setOutput(e.target.value)}
                placeholder={`Paste terminal output here...\n\nExample:\nC:\\>java -version\njava version "21.0.2" 2024-01-16 LTS\nC:\\>mvn -version\n'mvn' is not recognized as an internal or external command`}
                style={{
                  width: '100%', minHeight: 220,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '12px 14px',
                  fontFamily: 'JetBrains Mono', fontSize: '0.83rem',
                  color: 'var(--text-primary)', resize: 'vertical', outline: 'none',
                  lineHeight: 1.7, boxSizing: 'border-box'
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={runScan}
                disabled={!output.trim()}
                style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>
                🖥️ Analyze System
              </button>
              <button className="btn btn-outline" onClick={() => setStage('instructions')}>
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* ── Stage 3: Results ── */}
        {stage === 'results' && (
          <div>
            {/* Score */}
            <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(124,58,237,0.06))', border: '1px solid var(--border-accent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    {score === 100 ? '✅ Fully Set Up!' : score >= 70 ? '⚡ Almost Ready' : '🔧 Needs Setup'}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 2 }}>
                    {installed.length} of {results.length} tools detected on your system
                  </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900,
                  color: score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444' }}>
                  {score}%
                </div>
              </div>
              <div style={{ height: 8, background: 'var(--bg-secondary)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${score}%`,
                  background: score >= 80 ? 'linear-gradient(90deg,#22c55e,#86efac)' : score >= 50 ? 'linear-gradient(90deg,#f59e0b,#fcd34d)' : 'linear-gradient(90deg,#ef4444,#fca5a5)',
                  borderRadius: 999, transition: 'width 0.4s'
                }} />
              </div>
            </div>

            {/* Tool results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {results.map(r => (
                <div key={r.tool.id} className="card" style={{
                  padding: '14px 18px',
                  border: r.detected ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(239,68,68,0.25)',
                  background: r.detected ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: '1.2rem' }}>{r.detected ? '✅' : '❌'}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{r.tool.name}</div>
                        <code style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {r.tool.command}
                        </code>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      {r.detected ? (
                        <span style={{ color: '#22c55e', fontFamily: 'JetBrains Mono', fontSize: '0.85rem', fontWeight: 600 }}>
                          v{r.version}
                        </span>
                      ) : (
                        <div style={{ display: 'flex', gap: 8 }}>
                          {r.tool.installGuide && (
                            <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                              onClick={() => navigate(`/guide/${r.tool.installGuide}`)}>
                              📋 Guide
                            </button>
                          )}
                          <a href={r.tool.installUrl} target="_blank" rel="noopener noreferrer"
                            className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                            Download
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Missing tools summary */}
            {missing.length > 0 && (
              <div className="card" style={{ marginBottom: 16, borderColor: 'rgba(245,158,11,0.3)' }}>
                <h3 style={{ fontWeight: 600, color: '#f59e0b', marginBottom: 10 }}>
                  ⚠️ Install these to complete your setup:
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {missing.map(r => (
                    <span key={r.tool.id} className="meta-chip" style={{ color: '#f59e0b', borderColor: 'rgba(245,158,11,0.3)' }}>
                      {r.tool.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline" onClick={() => { setStage('instructions'); setOutput(''); setResults([]); }}>
                ← Scan Again
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/roadmap')}>
                🗺️ View Setup Roadmap →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
