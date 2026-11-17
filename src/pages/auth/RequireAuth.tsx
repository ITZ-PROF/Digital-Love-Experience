import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../stores/authstore';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const status = useAuth((state) => state.status);
  const location = useLocation();

  if (status === 'checking') {
    return <p role="status">Checking your account...</p>;
  }

  if (status === 'unavailable') {
    return (
      <section role="alert" className="auth-session-error">
        <p>We could not verify your session. Check your connection and try again.</p>
        <button type="button" onClick={() => window.location.reload()}>Retry</button>
      </section>
    );
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
