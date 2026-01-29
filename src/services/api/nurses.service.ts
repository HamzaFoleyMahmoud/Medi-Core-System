import apiClient from './client';
import type { ApiResponse, PaginatedResponse, NurseFilters, CreateNurseRequest } from '@/types/api';
import { type Nurse, UserRole } from '@/types/entities';

// Static nurses database
const STATIC_NURSES: Nurse[] = [
    {
        id: '1',
        userId: 'n1',
        departmentId: 'dept1',
        shift: 'MORNING',
        licenseNumber: 'NLIC-001',
        yearsOfExperience: 5,
        createdAt: new Date('2023-01-15').toISOString(),
        updatedAt: new Date('2023-01-15').toISOString(),
        user: {
            id: 'n1',
            email: 'amy.pond@medicore.com',
            firstName: 'Amy',
            lastName: 'Pond',
            role: UserRole.NURSE,
            phone: '+1234567892',
            createdAt: new Date('2023-01-15').toISOString(),
            updatedAt: new Date('2023-01-15').toISOString(),
        }
    },
    {
        id: '2',
        userId: 'n2',
        departmentId: 'dept2',
        shift: 'NIGHT',
        licenseNumber: 'NLIC-002',
        yearsOfExperience: 8,
        createdAt: new Date('2023-03-10').toISOString(),
        updatedAt: new Date('2023-03-10').toISOString(),
        user: {
            id: 'n2',
            email: 'rory.williams@medicore.com',
            firstName: 'Rory',
            lastName: 'Williams',
            role: UserRole.NURSE,
            phone: '+1234567893',
            createdAt: new Date('2023-03-10').toISOString(),
            updatedAt: new Date('2023-03-10').toISOString(),
        }
    }
];

// Helper for pagination
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

export const nursesService = {
    /**
     * Get paginated list of nurses (Hybrid: API -> Static)
     */
    async getNurses(filters?: NurseFilters): Promise<PaginatedResponse<Nurse>> {
        try {
            const response = await apiClient.get<ApiResponse<PaginatedResponse<Nurse>>>(
                '/nurses',
                { params: filters }
            );
            return response.data.data;
        } catch (error) {
            console.warn('API getNurses failed, using static data:', error);
            await new Promise((resolve) => setTimeout(resolve, 300));

            let filtered = [...STATIC_NURSES];

            if (filters?.search) {
                const searchLower = filters.search.toLowerCase();
                filtered = filtered.filter(n =>
                    n.user?.firstName.toLowerCase().includes(searchLower) ||
                    n.user?.lastName.toLowerCase().includes(searchLower) ||
                    n.departmentId.toLowerCase().includes(searchLower)
                );
            }

            if (filters?.shift) {
                filtered = filtered.filter(n => n.shift === filters.shift);
            }

            if (filters?.departmentId) {
                filtered = filtered.filter(n => n.departmentId === filters.departmentId);
            }

            return paginateResults(filtered, filters?.page, filters?.pageSize);
        }
    },

    /**
     * Get nurse by ID (Hybrid: API -> Static)
     */
    async getNurseById(id: string): Promise<Nurse> {
        try {
            const response = await apiClient.get<ApiResponse<Nurse>>(`/nurses/${id}`);
            return response.data.data;
        } catch (error) {
            console.warn(`API getNurseById(${id}) failed, using static data:`, error);
            await new Promise((resolve) => setTimeout(resolve, 200));

            const nurse = STATIC_NURSES.find(n => n.id === id);
            if (!nurse) throw new Error('Nurse not found');
            return nurse;
        }
    },

    /**
     * Create new nurse (Hybrid: API -> Static)
     */
    async createNurse(data: CreateNurseRequest): Promise<Nurse> {
        try {
            const response = await apiClient.post<ApiResponse<Nurse>>('/nurses', data);
            return response.data.data;
        } catch (error) {
            console.warn('API createNurse failed, using static data:', error);
            await new Promise((resolve) => setTimeout(resolve, 400));

            const newNurse: Nurse = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                userId: data.userId || `u-${Date.now()}`,
                departmentId: data.departmentId,
                shift: data.shift,
                licenseNumber: data.licenseNumber,
                yearsOfExperience: data.yearsOfExperience,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                user: {
                    id: data.userId || `u-${Date.now()}`,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: UserRole.NURSE,
                    phone: data.phone,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            };

            STATIC_NURSES.push(newNurse);
            return newNurse;
        }
    }
};
