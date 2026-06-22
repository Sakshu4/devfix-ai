import { Navigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="state-center"><div className="spinner" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
