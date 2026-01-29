import { useState } from 'react';
import { useNurses } from '../hooks/useNurses';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import type { NurseFilters } from '@/types/api';

export const NurseList: React.FC = () => {
    const [filters, setFilters] = useState<NurseFilters>({
        page: 1,
        pageSize: 10,
    });

    const { data: nursesData, isLoading, error, refetch } = useNurses(filters);

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
                message={(error as Error).message || 'Failed to load nurses'}
                onRetry={() => refetch()}
            />
        );
    }

    if (!nursesData || nursesData.data.length === 0) {
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                }
                title="No nurses found"
                description="We couldn't find any nurses matching your criteria."
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
                                    Nurse
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Shift
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Department
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
                            {nursesData.data.map((nurse) => (
                                <tr key={nurse.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                                                {nurse.user?.firstName?.[0]}
                                                {nurse.user?.lastName?.[0]}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {nurse.user?.firstName} {nurse.user?.lastName}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Lic: {nurse.licenseNumber}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${nurse.shift === 'MORNING' ? 'bg-green-100 text-green-800' :
                                                nurse.shift === 'EVENING' ? 'bg-yellow-100 text-yellow-800' :
                                                    nurse.shift === 'NIGHT' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                            {nurse.shift}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {nurse.departmentId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{nurse.user?.email}</div>
                                        <div className="text-sm text-gray-500">{nurse.user?.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {nurse.yearsOfExperience} years
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {nursesData.pagination.totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing{' '}
                                    <span className="font-medium">
                                        {(nursesData.pagination.page - 1) * nursesData.pagination.pageSize + 1}
                                    </span>{' '}
                                    to{' '}
                                    <span className="font-medium">
                                        {Math.min(
                                            nursesData.pagination.page * nursesData.pagination.pageSize,
                                            nursesData.pagination.total
                                        )}
                                    </span>{' '}
                                    of <span className="font-medium">{nursesData.pagination.total}</span> results
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handlePageChange(nursesData.pagination.page - 1)}
                                    disabled={nursesData.pagination.page === 1}
                                    variant="secondary"
                                    size="sm"
                                >
                                    Previous
                                </Button>
                                <Button
                                    onClick={() => handlePageChange(nursesData.pagination.page + 1)}
                                    disabled={nursesData.pagination.page === nursesData.pagination.totalPages}
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
