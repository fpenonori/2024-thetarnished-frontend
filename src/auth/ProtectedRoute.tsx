import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { User } from './AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<User['role']>;
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoggedIn, isAuthReady } = useAuth();
  const location = useLocation();

  if (!isAuthReady) {
    return null;
  }

  if (!isLoggedIn || !user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
