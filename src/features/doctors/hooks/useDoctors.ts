import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorsService } from '@/services/api/doctors.service';
import type { DoctorFilters, CreateDoctorRequest } from '@/types/api';

export const useDoctors = (filters?: DoctorFilters) => {
    return useQuery({
        queryKey: ['doctors', filters],
        queryFn: () => doctorsService.getDoctors(filters),
    });
};

export const useDoctor = (id: string) => {
    return useQuery({
        queryKey: ['doctor', id],
        queryFn: () => doctorsService.getDoctorById(id),

        enabled: !!id,
    });
};

export const useCreateDoctor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateDoctorRequest) => doctorsService.createDoctor(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['doctors'] });
        },
    });
};
