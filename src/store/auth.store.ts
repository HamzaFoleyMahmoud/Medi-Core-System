import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types/entities';
import type { LoginRequest } from '@/types/api';
import { authService } from '@/services/api/auth.service';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface AuthActions {
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    clearError: () => void;
    hasRole: (role: UserRole) => boolean;
    hasAnyRole: (roles: UserRole[]) => boolean;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            // State
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Actions
            login: async (credentials: LoginRequest) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.login(credentials);

                    // Store token in localStorage
                    localStorage.setItem('auth_token', response.token);
                    localStorage.setItem('auth_user', JSON.stringify(response.user));

                    set({
                        user: response.user as User,
                        token: response.token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Login failed';
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: errorMessage,
                    });
                    throw error;
                }
            },

            logout: async () => {
                try {
                    await authService.logout();
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    // Clear state regardless of API call success
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_user');
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                    });
                }
            },

            setUser: (user: User | null) => {
                set({ user, isAuthenticated: !!user });
            },

            setToken: (token: string | null) => {
                set({ token });
                if (token) {
                    localStorage.setItem('auth_token', token);
                } else {
                    localStorage.removeItem('auth_token');
                }
            },

            clearError: () => {
                set({ error: null });
            },

            hasRole: (role: UserRole) => {
                const { user } = get();
                return user?.role === role;
            },

            hasAnyRole: (roles: UserRole[]) => {
                const { user } = get();
                return user ? roles.includes(user.role) : false;
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
