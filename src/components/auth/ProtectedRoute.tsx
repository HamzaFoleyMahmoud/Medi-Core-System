import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/entities';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
    redirectTo?: string;
}

/**
 * Protected route wrapper that checks authentication and role-based access
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    redirectTo = '/login',
}) => {
    const { isAuthenticated, hasAnyRole } = useAuth();
    const location = useLocation();

    // Check if user is authenticated
    if (!isAuthenticated) {
        // Redirect to login, but save the attempted location
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Check if user has required role
    if (allowedRoles && allowedRoles.length > 0) {
        if (!hasAnyRole(allowedRoles)) {
            // User is authenticated but doesn't have required role
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // User is authenticated and has required role
    return <>{children}</>;
};
