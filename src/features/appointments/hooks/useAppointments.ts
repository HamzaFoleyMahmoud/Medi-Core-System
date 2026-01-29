import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsService } from '@/services/api/appointments.service';
import type {
    AppointmentFilters,
    CreateAppointmentRequest,
    UpdateAppointmentRequest,
} from '@/types/api';

// Query keys
export const appointmentKeys = {
    all: ['appointments'] as const,
    lists: () => [...appointmentKeys.all, 'list'] as const,
    list: (filters?: AppointmentFilters) => [...appointmentKeys.lists(), filters] as const,
    details: () => [...appointmentKeys.all, 'detail'] as const,
    detail: (id: string) => [...appointmentKeys.details(), id] as const,
    byDate: (date: string) => [...appointmentKeys.all, 'by-date', date] as const,
};

/**
 * Hook to fetch paginated appointments list
 */
export const useAppointments = (filters?: AppointmentFilters) => {
    return useQuery({
        queryKey: appointmentKeys.list(filters),
        queryFn: () => appointmentsService.getAppointments(filters),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Hook to fetch single appointment by ID
 */
export const useAppointment = (id: string) => {
    return useQuery({
        queryKey: appointmentKeys.detail(id),
        queryFn: () => appointmentsService.getAppointmentById(id),
        enabled: !!id,
    });
};

/**
 * Hook to fetch appointments by date
 */
export const useAppointmentsByDate = (date: string) => {
    return useQuery({
        queryKey: appointmentKeys.byDate(date),
        queryFn: () => appointmentsService.getAppointmentsByDate(date),
        enabled: !!date,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
};

/**
 * Hook to create a new appointment
 */
export const useCreateAppointment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAppointmentRequest) =>
            appointmentsService.createAppointment(data),
        onSuccess: () => {
            // Invalidate and refetch appointments list
            queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
        },
    });
};

/**
 * Hook to update an existing appointment
 */
export const useUpdateAppointment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentRequest }) =>
            appointmentsService.updateAppointment(id, data),
        onSuccess: (_, variables) => {
            // Invalidate specific appointment and lists
            queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
        },
    });
};

/**
 * Hook to cancel an appointment
 */
export const useCancelAppointment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => appointmentsService.cancelAppointment(id),
        onSuccess: (_, id) => {
            // Invalidate specific appointment and lists
            queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
        },
    });
};

/**
 * Hook to check doctor availability
 */
export const useCheckDoctorAvailability = (
    doctorId: string,
    date: string,
    duration: number
) => {
    return useQuery({
        queryKey: [...appointmentKeys.all, 'availability', doctorId, date, duration],
        queryFn: () => appointmentsService.checkDoctorAvailability(doctorId, date, duration),
        enabled: !!doctorId && !!date && duration > 0,
        staleTime: 30 * 1000, // 30 seconds
    });
};
