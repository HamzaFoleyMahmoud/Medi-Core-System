import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientsService } from '@/services/api/patients.service';
import type { Patient } from '@/types/entities';
import type {
    PatientFilters,
    CreatePatientRequest,
    UpdatePatientRequest,
} from '@/types/api';

// Query keys
export const patientKeys = {
    all: ['patients'] as const,
    lists: () => [...patientKeys.all, 'list'] as const,
    list: (filters?: PatientFilters) => [...patientKeys.lists(), filters] as const,
    details: () => [...patientKeys.all, 'detail'] as const,
    detail: (id: string) => [...patientKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated patients list
 */
export const usePatients = (filters?: PatientFilters) => {
    return useQuery({
        queryKey: patientKeys.list(filters),
        queryFn: () => patientsService.getPatients(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to fetch single patient by ID
 */
export const usePatient = (id: string) => {
    return useQuery({
        queryKey: patientKeys.detail(id),
        queryFn: () => patientsService.getPatientById(id),
        enabled: !!id,
    });
};

/**
 * Hook to create a new patient
 */
export const useCreatePatient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePatientRequest) => patientsService.createPatient(data),
        onSuccess: () => {
            // Invalidate and refetch patients list
            queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
        },
    });
};

/**
 * Hook to update an existing patient
 */
export const useUpdatePatient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePatientRequest }) =>
            patientsService.updatePatient(id, data),
        onSuccess: (_, variables) => {
            // Invalidate specific patient and lists
            queryClient.invalidateQueries({ queryKey: patientKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
        },
    });
};

/**
 * Hook to delete a patient
 */
export const useDeletePatient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => patientsService.deletePatient(id),
        onSuccess: () => {
            // Invalidate patients list
            queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
        },
    });
};

/**
 * Hook to search patients
 */
export const useSearchPatients = (query: string) => {
    return useQuery({
        queryKey: [...patientKeys.all, 'search', query],
        queryFn: () => patientsService.searchPatients(query),
        enabled: query.length >= 2, // Only search if query is at least 2 characters
        staleTime: 30 * 1000, // 30 seconds
    });
};
