import type {
    PaginatedResponse,
    CreateBillingRequest,
    UpdateBillingRequest,
    BillingFilters,
    ApiResponse,
} from '@/types/api';
import type { Billing, PaymentStatus } from '@/types/entities';
import apiClient, { extractData } from './client';

// Static billing database
let STATIC_BILLINGS: Billing[] = [
    {
        id: '1',
        patientId: '1',
        medicalRecordId: 'mr-1',
        items: [
            { description: 'Consultation Fee', quantity: 1, unitPrice: 150, total: 150 },
            { description: 'Blood Test', quantity: 1, unitPrice: 50, total: 50 },
        ],
        subtotal: 200,
        tax: 20,
        discount: 0,
        total: 220,
        status: 'PENDING' as PaymentStatus,
        createdAt: new Date('2024-03-20').toISOString(),
        updatedAt: new Date('2024-03-20').toISOString(),
    },
    {
        id: '2',
        patientId: '2',
        medicalRecordId: 'mr-2',
        items: [
            { description: 'X-Ray', quantity: 1, unitPrice: 100, total: 100 },
        ],
        subtotal: 100,
        tax: 10,
        discount: 10,
        total: 100,
        status: 'PAID' as PaymentStatus,
        createdAt: new Date('2024-03-18').toISOString(),
        updatedAt: new Date('2024-03-18').toISOString(),
    },
];

const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const calculateTotals = (items: { quantity: number; unitPrice: number }[], tax: number = 0, discount: number = 0) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const total = subtotal + tax - discount;
    return { subtotal, total };
};

const paginateResults = <T>(
    data: T[],
    page: number = 1,
    pageSize: number = 10
): PaginatedResponse<T> => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);

    return {
        data: paginatedData,
        pagination: {
            page,
            pageSize,
            total: data.length,
            totalPages: Math.ceil(data.length / pageSize),
        },
    };
};

export const billingService = {
    async getBillings(filters?: BillingFilters): Promise<PaginatedResponse<Billing>> {
        try {
            const response = await apiClient.get<ApiResponse<PaginatedResponse<Billing>>>('/billing', {
                params: filters,
            });
            return extractData(response.data);
        } catch (error) {
            console.warn('API getBillings failed, using static data:', error);
            await new Promise((resolve) => setTimeout(resolve, 300));

            let filtered = [...STATIC_BILLINGS];

            if (filters?.status) {
                filtered = filtered.filter(b => b.status === filters.status);
            }
            if (filters?.patientId) {
                filtered = filtered.filter(b => b.patientId === filters.patientId);
            }

            return paginateResults(filtered, filters?.page, filters?.pageSize);
        }
    },

    async getBillingById(id: string): Promise<Billing> {
        try {
            const response = await apiClient.get<ApiResponse<Billing>>(`/billing/${id}`);
            return extractData(response.data);
        } catch (error) {
            console.warn(`API getBillingById(${id}) failed, using static data:`, error);
            await new Promise((resolve) => setTimeout(resolve, 200));

            const billing = STATIC_BILLINGS.find((b) => b.id === id);
            if (!billing) {
                throw new Error('Billing not found');
            }
            return billing;
        }
    },

    async createBilling(data: CreateBillingRequest): Promise<Billing> {
        try {
            const response = await apiClient.post<ApiResponse<Billing>>('/billing', data);
            return extractData(response.data);
        } catch (error) {
            console.warn('API createBilling failed, using static data:', error);
            await new Promise((resolve) => setTimeout(resolve, 400));

            const { subtotal, total } = calculateTotals(data.items, data.tax, data.discount);

            const newBilling: Billing = {
                id: generateId(),
                patientId: data.patientId,
                medicalRecordId: data.medicalRecordId || '',
                items: data.items.map(item => ({
                    ...item,
                    total: item.quantity * item.unitPrice
                })),
                subtotal,
                tax: data.tax || 0,
                discount: data.discount || 0,
                total,
                status: data.status as PaymentStatus,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            STATIC_BILLINGS.unshift(newBilling);
            return newBilling;
        }
    },

    async updateBilling(id: string, data: UpdateBillingRequest): Promise<Billing> {
        try {
            const response = await apiClient.put<ApiResponse<Billing>>(`/billing/${id}`, data);
            return extractData(response.data);
        } catch (error) {
            console.warn(`API updateBilling(${id}) failed, using static data:`, error);
            await new Promise((resolve) => setTimeout(resolve, 400));

            const index = STATIC_BILLINGS.findIndex((b) => b.id === id);
            if (index === -1) {
                throw new Error('Billing not found');
            }

            const existing = STATIC_BILLINGS[index];
            if (!existing) {
                throw new Error('Billing not found');
            }

            const updatedItems = data.items
                ? data.items.map(item => ({ ...item, total: item.quantity * item.unitPrice }))
                : existing.items;

            const tax = data.tax !== undefined ? data.tax : existing.tax;
            const discount = data.discount !== undefined ? data.discount : existing.discount;

            const { subtotal, total } = data.items
                ? calculateTotals(data.items, tax, discount)
                : {
                    subtotal: existing.subtotal, // Naive update, ideally recalculate if tax/discount changed
                    total: existing.subtotal + tax - discount
                };

            // Recalculate if items were not provided but tax/discount were
            if (!data.items && (data.tax !== undefined || data.discount !== undefined)) {
                // re-use existing subtotal
            }

            const updatedBilling: Billing = {
                ...existing,
                ...data,
                items: updatedItems,
                subtotal, // Note: simplify for mock
                tax,
                discount,
                total,
                status: data.status ? (data.status as PaymentStatus) : existing.status,
                updatedAt: new Date().toISOString(),
            };

            STATIC_BILLINGS[index] = updatedBilling;
            return updatedBilling;
        }
    },

    async deleteBilling(id: string): Promise<void> {
        try {
            await apiClient.delete<ApiResponse<void>>(`/billing/${id}`);
        } catch (error) {
            console.warn(`API deleteBilling(${id}) failed, using static data:`, error);
            await new Promise((resolve) => setTimeout(resolve, 300));

            const index = STATIC_BILLINGS.findIndex((b) => b.id === id);
            if (index === -1) {
                throw new Error('Billing not found');
            }

            STATIC_BILLINGS.splice(index, 1);
        }
    }
};
