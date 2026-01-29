import { useState } from 'react';
import { useDoctors } from '../hooks/useDoctors';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import type { DoctorFilters } from '@/types/api';

export const DoctorList: React.FC = () => {
    const [filters, setFilters] = useState<DoctorFilters>({
        page: 1,
        pageSize: 10,
    });

    const { data: doctorsData, isLoading, error, refetch } = useDoctors(filters);

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <ErrorMessage
                message={(error as Error).message || 'Failed to load doctors'}
                onRetry={() => refetch()}
            />
        );
    }

    if (!doctorsData || doctorsData.data.length === 0) {
        return (
            <EmptyState
                icon={
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                }
                title="No doctors found"
                description="We couldn't find any doctors matching your criteria."
            />
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Doctor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Specialization
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Experience
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {doctorsData.data.map((doctor) => (
                                <tr key={doctor.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                                                {doctor.user?.firstName?.[0]}
                                                {doctor.user?.lastName?.[0]}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {doctor.qualifications.join(', ')}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{doctor.specialization}</div>
                                        <div className="text-xs text-gray-500">License: {doctor.licenseNumber}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{doctor.user?.email}</div>
                                        <div className="text-sm text-gray-500">{doctor.user?.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {doctor.yearsOfExperience} years
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {doctorsData.pagination.totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing{' '}
                                    <span className="font-medium">
                                        {(doctorsData.pagination.page - 1) * doctorsData.pagination.pageSize + 1}
                                    </span>{' '}
                                    to{' '}
                                    <span className="font-medium">
                                        {Math.min(
                                            doctorsData.pagination.page * doctorsData.pagination.pageSize,
                                            doctorsData.pagination.total
                                        )}
                                    </span>{' '}
                                    of <span className="font-medium">{doctorsData.pagination.total}</span> results
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handlePageChange(doctorsData.pagination.page - 1)}
                                    disabled={doctorsData.pagination.page === 1}
                                    variant="secondary"
                                    size="sm"
                                >
                                    Previous
                                </Button>
                                <Button
                                    onClick={() => handlePageChange(doctorsData.pagination.page + 1)}
                                    disabled={doctorsData.pagination.page === doctorsData.pagination.totalPages}
                                    variant="secondary"
                                    size="sm"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
