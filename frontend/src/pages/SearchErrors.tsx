import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchErrors, getAllErrors } from '../api/devfix';
import ErrorCard from '../components/ErrorCard';
import type { TechError } from '../types';

const SEVERITIES = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export default function SearchErrors() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query,    setQuery]    = useState(searchParams.get('q') ?? '');
  const [errors,   setErrors]   = useState<TechError[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [severity, setSeverity] = useState('ALL');

  const fetchErrors = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const data = q.trim() ? await searchErrors(q.trim()) : await getAllErrors();
      setErrors(data);
    } catch {
      setErrors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run search when URL param changes (handles homepage chip clicks)
  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    setQuery(q);
    fetchErrors(q);
  }, [searchParams, fetchErrors]);

  // Debounce live search as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams(query ? { q: query } : {}, { replace: true });
    }, 400);
    return () => clearTimeout(timer);
  }, [query, setSearchParams]);

  // Apply severity filter client-side
  const filtered = severity === 'ALL'
    ? errors
    : errors.filter(e => e.severity === severity);

  return (
    <div className="container page">
      {/* ── Search Bar ── */}
      <div style={{ maxWidth: 640, margin: '0 auto 36px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: 24, fontSize: '1.8rem', fontWeight: 700 }}>
          Error Knowledge Base
        </h1>
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            id="error-search-input"
            className="search-input"
            placeholder="Search: JAVA_HOME, port 8080, OutOfMemoryError..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')}>✕</button>
          )}
        </div>
      </div>

      {/* ── Severity Filter ── */}
      <div className="section-header">
        <div className="filter-bar" style={{ margin: 0 }}>
          {SEVERITIES.map(s => (
            <button
              key={s}
              className={`filter-btn ${severity === s ? 'active' : ''}`}
              onClick={() => setSeverity(s)}
            >
              {s === 'CRITICAL' ? '🔴' : s === 'HIGH' ? '🟠' : s === 'MEDIUM' ? '🟡' : s === 'LOW' ? '🟢' : '📋'} {s}
            </button>
          ))}
        </div>
        <span className="section-count">
          {loading ? '...' : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* ── Results ── */}
      {loading ? (
        <div className="state-center"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="state-center">
          <div className="state-icon">🔎</div>
          <div className="state-title">No errors found</div>
          <div className="state-desc">
            Try a different keyword like "java", "maven", "port", or "null"
          </div>
        </div>
      ) : (
        <div className="grid grid-2">
          {filtered.map(err => (
            <ErrorCard
              key={err.id}
              error={err}
              onClick={() => navigate(`/errors/${err.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
