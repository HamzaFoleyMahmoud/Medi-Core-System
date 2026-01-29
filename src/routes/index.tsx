import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { PatientsPage } from '@/features/patients/pages/PatientsPage';
import { AppointmentsPage } from '@/features/appointments/pages/AppointmentsPage';
import { UserRole } from '@/types/entities';

import { DoctorsPage } from '@/features/doctors/pages/DoctorsPage';


import { BillingPage } from '@/features/billing/pages/BillingPage';
import { NursesPage } from '@/features/nurses/pages/NursesPage';


const UnauthorizedPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900">403</h1>
            <p className="mt-4 text-xl text-gray-600">Unauthorized Access</p>
            <p className="mt-2 text-gray-500">You don't have permission to access this page.</p>
            <a
                href="/dashboard"
                className="mt-6 inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
                Go to Dashboard
            </a>
        </div>
    </div>
);

const NotFoundPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <p className="mt-4 text-xl text-gray-600">Page Not Found</p>
            <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
            <a
                href="/dashboard"
                className="mt-6 inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
                Go to Dashboard
            </a>
        </div>
    </div>
);

export const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Protected Routes */}
                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/patients" element={<PatientsPage />} />
                    <Route path="/appointments" element={<AppointmentsPage />} />

                    {/* Admin Only */}
                    <Route
                        path="/doctors"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                                <DoctorsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/nurses"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                                <NursesPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin & Receptionist */}
                    <Route
                        path="/billing"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.RECEPTIONIST]}>
                                <BillingPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                {/* Redirects */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};
