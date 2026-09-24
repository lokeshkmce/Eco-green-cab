import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, allowedRole }) {
  const { isLoggedIn, user, setAuthModalOpen } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      setAuthModalOpen(true);
    }
  }, [isLoggedIn, setAuthModalOpen]);

  if (!isLoggedIn) {
    // Not logged in, redirect to home and open auth modal
    return <Navigate to="/" replace />;
  }

  if (allowedRole && (!user?.roles || !user.roles.includes(allowedRole))) {
    // Logged in but doesn't have this role, redirect to a dashboard they do have
    if (user?.roles?.includes('owner')) return <Navigate to="/owner/dashboard" replace />;
    if (user?.roles?.includes('renter')) return <Navigate to="/renter/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
