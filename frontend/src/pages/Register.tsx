import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const { register } = useAuth();
  const [form,    setForm]    = useState({ username: '', email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate(redirect);
    } catch (err: any) {
      const serverMsg = err?.response?.data?.error;
      const dataObj = err?.response?.data;
      const validationMsgs = dataObj && typeof dataObj === 'object'
        ? Object.values(dataObj).filter(v => typeof v === 'string').join(', ')
        : '';
      const fallback = err?.message || 'Registration failed. Please check your details.';
      setError(serverMsg || validationMsgs || fallback);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div className="logo-icon" style={{ width: 48, height: 48, fontSize: '1.4rem', margin: '0 auto 12px', borderRadius: 12 }}>⚡</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
            Join DevFix AI — free developer account
          </p>
        </div>

        {/* Redirect notice if arrived from a protected action */}
        {redirect !== '/dashboard' && (
          <div style={{
            marginBottom: 20,
            padding: '10px 14px',
            background: 'var(--accent-subtle)',
            border: '1px solid var(--border-accent)',
            borderRadius: 8,
            fontSize: '0.84rem',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontWeight: 500,
          }}>
            <span>✨</span>
            <span>Create your account to unlock this feature and perform tasks.</span>
          </div>
        )}

        {/* Error */}
        {error && <div className="auth-error">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Username <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(3–50 chars)</span></label>
            <input id="reg-username" className="form-input" type="text" placeholder="your username"
              value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required autoFocus minLength={3} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input id="reg-email" className="form-input" type="email" placeholder="you@email.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required />
          </div>
          <div className="form-group">
            <label className="form-label">Password <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(min 6 chars)</span></label>
            <input id="reg-password" className="form-input" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required minLength={6} />
          </div>
          <button id="reg-submit" className="btn btn-primary" type="submit"
            disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4 }}>
            {loading ? 'Creating account...' : '→ Create Free Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Already have an account?{' '}
          <Link to={`/login${redirect !== '/dashboard' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
