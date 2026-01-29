import { useState } from 'react';
import { usePatients, useDeletePatient } from '../hooks/usePatients';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { PatientFilters } from '@/types/api';
import { format } from 'date-fns';

interface PatientListProps {
    onPatientClick: (patientId: string) => void;
    onAddPatient: () => void;
    onEditPatient: (patientId: string) => void;
}

export const PatientList: React.FC<PatientListProps> = ({
    onPatientClick,
    onAddPatient,
    onEditPatient,
}) => {
    const [filters, setFilters] = useState<PatientFilters>({
        page: 1,
        pageSize: 10,
        search: '',
    });

    const { data, isLoading, error, refetch } = usePatients(filters);
    const deletePatient = useDeletePatient();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete patient ${name}?`)) {
            try {
                await deletePatient.mutateAsync(id);
            } catch (error) {
                console.error('Failed to delete patient:', error);
            }
        }
    };

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
                message={(error as Error).message || 'Failed to load patients'}
                onRetry={() => refetch()}
            />
        );
    }

    if (!data || data.data.length === 0) {
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
                title="No patients found"
                description={
                    filters.search
                        ? 'Try adjusting your search criteria'
                        : 'Get started by adding your first patient'
                }
                action={{
                    label: 'Add Patient',
                    onClick: onAddPatient,
                }}
            />
        );
    }

    return (
        <div className="space-y-4">
            {/* Header with Search and Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Input
                    type="search"
                    placeholder="Search patients by name, email, or phone..."
                    value={filters.search}
                    onChange={handleSearch}
                    className="w-full sm:w-96"
                />
                <Button onClick={onAddPatient} variant="primary">
                    <svg
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Add Patient
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date of Birth
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Gender
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phone
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.data.map((patient) => (
                                <tr
                                    key={patient.id}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => onPatientClick(patient.id)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {patient.firstName} {patient.lastName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(new Date(patient.dateOfBirth), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {patient.gender}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {patient.phone}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {patient.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => onEditPatient(patient.id)}
                                                className="text-primary-600 hover:text-primary-900"
                                                aria-label={`Edit ${patient.firstName} ${patient.lastName}`}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(patient.id, `${patient.firstName} ${patient.lastName}`)
                                                }
                                                className="text-danger-600 hover:text-danger-900"
                                                aria-label={`Delete ${patient.firstName} ${patient.lastName}`}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data.pagination.totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <Button
                                onClick={() => handlePageChange(data.pagination.page - 1)}
                                disabled={data.pagination.page === 1}
                                variant="secondary"
                                size="sm"
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={() => handlePageChange(data.pagination.page + 1)}
                                disabled={data.pagination.page === data.pagination.totalPages}
                                variant="secondary"
                                size="sm"
                            >
                                Next
                            </Button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing{' '}
                                    <span className="font-medium">
                                        {(data.pagination.page - 1) * data.pagination.pageSize + 1}
                                    </span>{' '}
                                    to{' '}
                                    <span className="font-medium">
                                        {Math.min(
                                            data.pagination.page * data.pagination.pageSize,
                                            data.pagination.total
                                        )}
                                    </span>{' '}
                                    of <span className="font-medium">{data.pagination.total}</span> results
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handlePageChange(data.pagination.page - 1)}
                                    disabled={data.pagination.page === 1}
                                    variant="secondary"
                                    size="sm"
                                >
                                    Previous
                                </Button>
                                <Button
                                    onClick={() => handlePageChange(data.pagination.page + 1)}
                                    disabled={data.pagination.page === data.pagination.totalPages}
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
