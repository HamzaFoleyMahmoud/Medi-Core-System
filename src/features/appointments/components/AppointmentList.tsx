import { useState } from 'react';
import { useAppointments, useCancelAppointment } from '../hooks/useAppointments';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import type { AppointmentFilters } from '@/types/api';
import { AppointmentStatus } from '@/types/entities';
import { format } from 'date-fns';
import { clsx } from 'clsx';

interface AppointmentListProps {
    onAppointmentClick: (appointmentId: string) => void;
    onBookAppointment: () => void;
    onEditAppointment: (appointmentId: string) => void;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({
    onAppointmentClick,
    onBookAppointment,
    onEditAppointment,
}) => {
    const [filters, setFilters] = useState<AppointmentFilters>({
        page: 1,
        pageSize: 10,
        status: '',
    });

    const { data, isLoading, error, refetch } = useAppointments(filters);
    const cancelAppointment = useCancelAppointment();

    const handleStatusFilter = (status: string) => {
        setFilters((prev) => ({ ...prev, status: status || undefined, page: 1 }));
    };

    const handleCancel = async (id: string) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await cancelAppointment.mutateAsync(id);
            } catch (error) {
                console.error('Failed to cancel appointment:', error);
            }
        }
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    const getStatusBadge = (status: AppointmentStatus) => {
        const styles = {
            [AppointmentStatus.SCHEDULED]: 'bg-blue-100 text-blue-800',
            [AppointmentStatus.CONFIRMED]: 'bg-success-100 text-success-800',
            [AppointmentStatus.IN_PROGRESS]: 'bg-warning-100 text-warning-800',
            [AppointmentStatus.COMPLETED]: 'bg-gray-100 text-gray-800',
            [AppointmentStatus.CANCELLED]: 'bg-danger-100 text-danger-800',
            [AppointmentStatus.NO_SHOW]: 'bg-danger-100 text-danger-800',
        };

        return (
            <span
                className={clsx(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    styles[status]
                )}
            >
                {status.replace('_', ' ')}
            </span>
        );
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
                message={(error as Error).message || 'Failed to load appointments'}
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                }
                title="No appointments found"
                description={
                    filters.status
                        ? 'Try adjusting your filters'
                        : 'Get started by booking your first appointment'
                }
                action={{
                    label: 'Book Appointment',
                    onClick: onBookAppointment,
                }}
            />
        );
    }

    return (
        <div className="space-y-4">
            {/* Header with Filters and Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Select
                    options={[
                        { value: '', label: 'All Statuses' },
                        { value: AppointmentStatus.SCHEDULED, label: 'Scheduled' },
                        { value: AppointmentStatus.CONFIRMED, label: 'Confirmed' },
                        { value: AppointmentStatus.IN_PROGRESS, label: 'In Progress' },
                        { value: AppointmentStatus.COMPLETED, label: 'Completed' },
                        { value: AppointmentStatus.CANCELLED, label: 'Cancelled' },
                    ]}
                    value={filters.status || ''}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    className="w-full sm:w-64"
                />
                <Button onClick={onBookAppointment} variant="primary">
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
                    Book Appointment
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Patient
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Doctor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date & Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duration
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.data.map((appointment) => (
                                <tr
                                    key={appointment.id}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => onAppointmentClick(appointment.id)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {appointment.patient
                                                ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                                                : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {appointment.doctor
                                                ? `Dr. ${appointment.doctor.user?.firstName} ${appointment.doctor.user?.lastName}`
                                                : 'N/A'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {appointment.doctor?.specialization}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(new Date(appointment.scheduledAt), 'MMM dd, yyyy hh:mm a')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {appointment.duration} min
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(appointment.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div
                                            className="flex justify-end gap-2"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {appointment.status === AppointmentStatus.SCHEDULED && (
                                                <>
                                                    <button
                                                        onClick={() => onEditAppointment(appointment.id)}
                                                        className="text-primary-600 hover:text-primary-900"
                                                        aria-label="Edit appointment"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(appointment.id)}
                                                        className="text-danger-600 hover:text-danger-900"
                                                        aria-label="Cancel appointment"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
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
