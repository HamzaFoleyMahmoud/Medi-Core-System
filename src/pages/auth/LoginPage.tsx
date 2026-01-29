import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, error, clearError } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        clearError();

        try {
            await login(data);
            navigate(from, { replace: true });
        } catch (err) {
            // Error is handled by the auth store
            console.error('Login failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary-600 text-white rounded-full p-3">
                            <svg
                                className="h-12 w-12"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">MediCore</h2>
                    <p className="mt-2 text-sm text-gray-600">Hospital Management System</p>
                    <p className="mt-4 text-lg font-medium text-gray-900">Sign in to your account</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    {error && (
                        <div className="mb-4">
                            <ErrorMessage message={error} />
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            {...register('email')}
                            error={errors.email?.message}
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                            fullWidth
                        />

                        <Input
                            label="Password"
                            type="password"
                            {...register('password')}
                            error={errors.password?.message}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                            fullWidth
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            isLoading={isLoading}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center mb-3">Demo Credentials:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-gray-50 p-2 rounded">
                                <p className="font-medium text-gray-700">Admin</p>
                                <p className="text-gray-500">admin@medicore.com</p>
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                                <p className="font-medium text-gray-700">Doctor</p>
                                <p className="text-gray-500">doctor@medicore.com</p>
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                                <p className="font-medium text-gray-700">Nurse</p>
                                <p className="text-gray-500">nurse@medicore.com</p>
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                                <p className="font-medium text-gray-700">Receptionist</p>
                                <p className="text-gray-500">receptionist@medicore.com</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-2">Password: password123</p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-500">
                    © 2024 MediCore. All rights reserved.
                </p>
            </div>
        </div>
    );
};
