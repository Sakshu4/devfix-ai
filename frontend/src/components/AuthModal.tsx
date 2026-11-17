import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  actionName?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  title = 'Sign In Required',
  actionName = 'perform this task',
}: AuthModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(20, 26, 16, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="card"
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card), 0 20px 40px rgba(0,0,0,0.3)',
          padding: '32px 28px',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: 4,
            lineHeight: 1,
            borderRadius: 4,
          }}
        >
          ✖
        </button>

        {/* Icon & Heading */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'var(--accent-subtle)',
              border: '1px solid var(--border-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              margin: '0 auto 14px',
            }}
          >
            🔒
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
            {title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            You need to be signed in to <strong style={{ color: 'var(--accent)' }}>{actionName}</strong>.
          </p>
        </div>

        {/* Features bullet preview */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            marginBottom: 24,
            border: '1px solid var(--border)',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--severity-low)', fontWeight: 700 }}>✓</span>
            <span>Real-time AI Troubleshooter & error solutions</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--severity-low)', fontWeight: 700 }}>✓</span>
            <span>System Scanner, Screenshot OCR & Log Analyzer</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--severity-low)', fontWeight: 700 }}>✓</span>
            <span>Save roadmap progress & track environment readiness</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
          >
            → Sign In to Your Account
          </button>
          <button
            className="btn btn-outline"
            onClick={() => {
              onClose();
              navigate('/register');
            }}
            style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
          >
            ✨ Create Free Account
          </button>
        </div>

        {/* Dismiss hint */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Continue browsing page
          </button>
        </div>
      </div>
    </div>
  );
}
