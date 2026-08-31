import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, AppRole } from "@/contexts/AuthContext";

interface Props {
  children: ReactNode;
  /** If provided, user must have at least one of these roles. */
  roles?: AppRole[];
  /** Set on the password-change route itself to avoid a redirect loop. */
  allowPasswordChange?: boolean;
}

const ProtectedRoute = ({ children, roles, allowPasswordChange }: Props) => {
  const { user, roles: userRoles, mustChangePassword, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container py-16 text-center text-muted-foreground">Loading…</div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (mustChangePassword && !allowPasswordChange) {
    return <Navigate to="/set-password" replace />;
  }

  if (roles && roles.length > 0 && !roles.some((r) => userRoles.includes(r))) {
    return (
      <div className="container py-16 max-w-xl text-center space-y-3">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="text-muted-foreground">
          You don't have permission to view this page. If you think this is a mistake, contact the
          organising committee.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
