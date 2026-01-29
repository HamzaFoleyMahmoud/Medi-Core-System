import { useAuthStore } from '@/store/auth.store';
import type { UserRole } from '@/types/entities';
import type { LoginRequest } from '@/types/api';

/**
 * Custom hook to access authentication state and actions
 */
export const useAuth = () => {
    const {
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        clearError,
        hasRole,
        hasAnyRole,
    } = useAuthStore();

    return {
        // State
        user,
        token,
        isAuthenticated,
        isLoading,
        error,

        // Actions
        login: async (credentials: LoginRequest) => {
            await login(credentials);
        },
        logout: async () => {
            await logout();
        },
        clearError,

        // Role checks
        hasRole: (role: UserRole) => hasRole(role),
        hasAnyRole: (roles: UserRole[]) => hasAnyRole(roles),

        // Convenience getters
        isAdmin: hasRole('ADMIN' as UserRole),
        isDoctor: hasRole('DOCTOR' as UserRole),
        isNurse: hasRole('NURSE' as UserRole),
        isReceptionist: hasRole('RECEPTIONIST' as UserRole),
    };
};
