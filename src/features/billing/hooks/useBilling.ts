import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingService } from '@/services/api/billing.service';
import type {
    BillingFilters,
    CreateBillingRequest,
    UpdateBillingRequest
} from '@/types/api';

export const useBillings = (filters?: BillingFilters) => {
    return useQuery({
        queryKey: ['billings', filters],
        queryFn: () => billingService.getBillings(filters),
    });
};

export const useBilling = (id: string) => {
    return useQuery({
        queryKey: ['billing', id],
        queryFn: () => billingService.getBillingById(id),
        enabled: !!id,
    });
};

export const useCreateBilling = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBillingRequest) => billingService.createBilling(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['billings'] });
        },
    });
};

export const useUpdateBilling = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateBillingRequest }) =>
            billingService.updateBilling(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['billings'] });
            queryClient.invalidateQueries({ queryKey: ['billing', data.id] });
        },
    });
};

export const useDeleteBilling = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => billingService.deleteBilling(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['billings'] });
        },
    });
};
