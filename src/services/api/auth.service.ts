import type { LoginRequest, LoginResponse, RefreshTokenRequest } from '@/types/api';
import type { User } from '@/types/entities';
import { UserRole } from '@/types/entities';

// Static user database for demo/development purposes
const STATIC_USERS: User[] = [
    {
        id: '1',
        email: 'admin@medicore.com',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        phone: '+1234567890',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        email: 'doctor@medicore.com',
        firstName: 'Dr. John',
        lastName: 'Smith',
        role: UserRole.DOCTOR,
        phone: '+1234567891',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        email: 'nurse@medicore.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: UserRole.NURSE,
        phone: '+1234567892',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '4',
        email: 'receptionist@medicore.com',
        firstName: 'Emily',
        lastName: 'Davis',
        role: UserRole.RECEPTIONIST,
        phone: '+1234567893',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

const STATIC_PASSWORD = 'password123';

// Helper to generate a mock JWT token
const generateMockToken = (userId: string): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
        userId,
        iat: Date.now(),
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }));
    const signature = btoa(`mock-signature-${userId}`);
    return `${header}.${payload}.${signature}`;
};

export const authService = {
    /**
     * Login with email and password (Static Implementation)
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Find user by email
        const user = STATIC_USERS.find(u => u.email === credentials.email);

        // Validate credentials
        if (!user || credentials.password !== STATIC_PASSWORD) {
            throw new Error('Invalid email or password');
        }

        // Generate mock tokens
        const token = generateMockToken(user.id);
        const refreshToken = generateMockToken(`refresh-${user.id}`);

        return {
            user,
            token,
            refreshToken,
        };
    },

    /**
     * Logout current user
     */
    async logout(): Promise<void> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 200));

        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    },

    /**
     * Refresh access token (Static Implementation)
     */
    async refreshToken(_request: RefreshTokenRequest): Promise<LoginResponse> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // In a real app, you'd validate the refresh token
        // For static implementation, just return a new token
        const storedUser = localStorage.getItem('auth_user');
        if (!storedUser) {
            throw new Error('No user found');
        }

        const user = JSON.parse(storedUser) as User;
        const token = generateMockToken(user.id);
        const refreshToken = generateMockToken(`refresh-${user.id}`);

        return {
            user,
            token,
            refreshToken,
        };
    },

    /**
     * Get current authenticated user (Static Implementation)
     */
    async getCurrentUser(): Promise<User> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 200));

        const storedUser = localStorage.getItem('auth_user');
        if (!storedUser) {
            throw new Error('Not authenticated');
        }

        return JSON.parse(storedUser) as User;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('auth_token');
    },
};
