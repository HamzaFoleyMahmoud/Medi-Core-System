import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nursesService } from '@/services/api/nurses.service';
import type { NurseFilters, CreateNurseRequest } from '@/types/api';

export const useNurses = (filters?: NurseFilters) => {
    return useQuery({
        queryKey: ['nurses', filters],
        queryFn: () => nursesService.getNurses(filters),
    });
};

export const useNurse = (id: string) => {
    return useQuery({
        queryKey: ['nurses', id],
        queryFn: () => nursesService.getNurseById(id),
        enabled: !!id,
    });
};

export const useCreateNurse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateNurseRequest) => nursesService.createNurse(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nurses'] });
        },
    });
};
