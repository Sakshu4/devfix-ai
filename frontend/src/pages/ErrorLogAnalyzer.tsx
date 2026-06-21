import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchErrors } from '../api/devfix';
import ErrorCard from '../components/ErrorCard';
import type { TechError } from '../types';

// ── Common error patterns to extract keywords from logs ───────────────────────
const ERROR_PATTERNS: { pattern: RegExp; keywords: string[] }[] = [
  { pattern: /JAVA_HOME/i,                     keywords: ['JAVA_HOME'] },
  { pattern: /java.*not recognized/i,           keywords: ['java not recognized'] },
  { pattern: /NullPointerException/i,           keywords: ['NullPointerException'] },
  { pattern: /OutOfMemoryError/i,               keywords: ['OutOfMemoryError'] },
  { pattern: /StackOverflow/i,                  keywords: ['StackOverflow'] },
  { pattern: /ClassNotFoundException/i,         keywords: ['ClassNotFoundException'] },
  { pattern: /port.*already.*use|address.*bind/i, keywords: ['port already in use'] },
  { pattern: /Connection refused/i,             keywords: ['connection refused'] },
  { pattern: /BUILD FAILURE|BUILD FAILED/i,     keywords: ['BUILD FAILED'] },
  { pattern: /mvn.*not recognized|mvn.*not found/i, keywords: ['mvn not recognized'] },
  { pattern: /npm.*not recognized|npm.*not found/i,  keywords: ['npm not recognized'] },
  { pattern: /Cannot connect.*Docker|docker daemon/i, keywords: ['docker daemon'] },
  { pattern: /Cannot find module/i,             keywords: ['module not found'] },
  { pattern: /react-scripts.*not recognized/i,  keywords: ['react-scripts'] },
  { pattern: /CONFLICT.*merge|Merge conflict/i, keywords: ['merge conflict'] },
  { pattern: /failed to push|push rejected/i,   keywords: ['push rejected'] },
  { pattern: /table.*doesn.*exist|relation.*does not exist/i, keywords: ['table does not exist'] },
  { pattern: /No qualifying bean/i,             keywords: ['spring bean not found'] },
  { pattern: /ClassCastException/i,             keywords: ['ClassCastException'] },
  { pattern: /ArrayIndexOutOfBounds/i,          keywords: ['array index out of bounds'] },
];

const EXAMPLE_LOGS = [
  {
    label: 'Maven BUILD FAILED',
    log: `[ERROR] COMPILATION ERROR :\n[ERROR] .../MyService.java:[15,5] error: cannot find symbol\n[INFO] BUILD FAILURE\n[INFO] Total time: 2.341 s`,
  },
  {
    label: 'JAVA_HOME error',
    log: `Error: JAVA_HOME is not set and no 'java' command could be found in your PATH.\nPlease set the JAVA_HOME variable in your environment to match the location of your Java installation.`,
  },
  {
    label: 'Port already in use',
    log: `***************************\nAPPLICATION FAILED TO START\n***************************\nDescription:\nWeb server failed to start. Port 8080 was already in use.\nAction:\nIdentify and stop the process that's listening on port 8080 or configure this application to listen on another port.`,
  },
  {
    label: 'Docker daemon not running',
    log: `error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.24/info": open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.\nIn the default daemon configuration on Windows, the docker client must be run with elevated privileges to connect.`,
  },
  {
    label: 'npm not recognized',
    log: `'npm' is not recognized as an internal or external command,\noperable program or batch file.\nC:\\Users\\user>`,
  },
];

function extractKeywords(log: string): string[] {
  const found: string[] = [];
  for (const { pattern, keywords } of ERROR_PATTERNS) {
    if (pattern.test(log)) {
      found.push(...keywords);
    }
  }
  // Also extract ERROR_CODES in UPPER_SNAKE_CASE
  const codes = log.match(/[A-Z][A-Z_]{3,}/g) ?? [];
  codes.forEach(code => {
    if (!found.includes(code)) found.push(code);
  });
  return [...new Set(found)];
}

export default function ErrorLogAnalyzer() {
  const navigate = useNavigate();
  const [log,      setLog]      = useState('');
  const [results,  setResults]  = useState<TechError[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const analyze = async () => {
    if (!log.trim()) return;
    setLoading(true); setAnalyzed(false);

    const kws = extractKeywords(log);
    setKeywords(kws);

    const allResults: TechError[] = [];
    const seen = new Set<number>();

    // Search for each keyword
    for (const kw of kws.slice(0, 4)) {
      try {
        const res = await searchErrors(kw);
        for (const r of res) {
          if (!seen.has(r.id)) { seen.add(r.id); allResults.push(r); }
        }
      } catch { /* ignore */ }
    }

    // If no keyword matches, try the whole log trimmed to first 100 chars
    if (allResults.length === 0) {
      try {
        const fallback = await searchErrors(log.slice(0, 80));
        for (const r of fallback) {
          if (!seen.has(r.id)) { seen.add(r.id); allResults.push(r); }
        }
      } catch { /* ignore */ }
    }

    setResults(allResults);
    setLoading(false);
    setAnalyzed(true);
  };

  const loadExample = (exLog: string) => {
    setLog(exLog);
    setResults([]);
    setKeywords([]);
    setAnalyzed(false);
  };

  return (
    <div className="container page">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>
            🔬 Error Log Analyzer
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Paste your error log or terminal output — DevFix AI will extract the error and find a fix.
          </p>
        </div>

        {/* Example logs */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 8 }}>
            Try an example:
          </div>
          <div className="filter-bar">
            {EXAMPLE_LOGS.map(e => (
              <button key={e.label} className="filter-btn" onClick={() => loadExample(e.log)}>
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* Paste area */}
        <div style={{ marginBottom: 16 }}>
          <textarea
            value={log}
            onChange={e => { setLog(e.target.value); setAnalyzed(false); setResults([]); setKeywords([]); }}
            placeholder={`Paste your error log here...\n\nExample:\n  BUILD FAILURE\n  NullPointerException at line 42\n  JAVA_HOME is not set`}
            style={{
              width: '100%', minHeight: 220,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '14px 16px',
              fontFamily: 'JetBrains Mono',
              fontSize: '0.84rem',
              color: 'var(--text-primary)',
              resize: 'vertical',
              outline: 'none',
              lineHeight: 1.7,
              boxSizing: 'border-box',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Analyze button */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
          <button className="btn btn-primary" onClick={analyze}
            disabled={loading || !log.trim()}
            style={{ padding: '11px 28px', fontSize: '0.95rem' }}>
            {loading ? '🔍 Analyzing...' : '🔬 Analyze Error Log'}
          </button>
          {log && (
            <button className="btn btn-outline" onClick={() => { setLog(''); setResults([]); setKeywords([]); setAnalyzed(false); }}
              style={{ padding: '11px 18px' }}>
              Clear
            </button>
          )}
        </div>

        {/* Keywords detected */}
        {analyzed && keywords.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 8 }}>
              🔍 Detected error signals:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {keywords.map(k => (
                <span key={k} className="tag" style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--accent)', fontSize: '0.8rem' }}>
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {analyzed && (
          <>
            {results.length > 0 ? (
              <>
                <div className="section-header" style={{ marginBottom: 16 }}>
                  <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>
                    ✅ {results.length} matching fix{results.length > 1 ? 'es' : ''} found
                  </h2>
                  <span className="section-count">Click any card for the full solution</span>
                </div>
                <div className="grid grid-2">
                  {results.map(err => (
                    <ErrorCard key={err.id} error={err} onClick={() => navigate(`/errors/${err.id}`)} />
                  ))}
                </div>
              </>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: 48 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>No matching fix found yet</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 20 }}>
                  This error isn't in our knowledge base yet. Try searching manually.
                </p>
                <button className="btn btn-primary" onClick={() => navigate('/search')}>
                  Search Manually →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
