import apiClient from './client';
import type { ApiResponse, PaginatedResponse, DoctorFilters, CreateDoctorRequest } from '@/types/api';
import { type Doctor, UserRole } from '@/types/entities';

// Static doctors database
const STATIC_DOCTORS: Doctor[] = [
    {
        id: '1',
        userId: 'd1',
        departmentId: 'dept1',
        specialization: 'Cardiology',
        licenseNumber: 'LIC-001',
        yearsOfExperience: 15,
        qualifications: ['MBBS', 'MD', 'FACC'],
        availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
        consultationFee: 150,
        createdAt: new Date('2023-01-01').toISOString(),
        updatedAt: new Date('2023-01-01').toISOString(),
        user: {
            id: 'd1',
            email: 'sarah.connor@medicore.com',
            firstName: 'Sarah',
            lastName: 'Connor',
            role: UserRole.DOCTOR,
            phone: '+1234567890',
            createdAt: new Date('2023-01-01').toISOString(),
            updatedAt: new Date('2023-01-01').toISOString(),
        }
    },
    {
        id: '2',
        userId: 'd2',
        departmentId: 'dept2',
        specialization: 'Pediatrics',
        licenseNumber: 'LIC-002',
        yearsOfExperience: 10,
        qualifications: ['MBBS', 'DCH'],
        availableSlots: ['09:30', '10:30', '11:30', '14:30', '15:30'],
        consultationFee: 100,
        createdAt: new Date('2023-02-01').toISOString(),
        updatedAt: new Date('2023-02-01').toISOString(),
        user: {
            id: 'd2',
            email: 'james.wilson@medicore.com',
            firstName: 'James',
            lastName: 'Wilson',
            role: UserRole.DOCTOR,
            phone: '+1234567891',
            createdAt: new Date('2023-02-01').toISOString(),
            updatedAt: new Date('2023-02-01').toISOString(),
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

export const doctorsService = {
    /**
     * Get paginated list of doctors (Hybrid: API -> Static)
     */
    async getDoctors(filters?: DoctorFilters): Promise<PaginatedResponse<Doctor>> {
        try {
            const response = await apiClient.get<ApiResponse<PaginatedResponse<Doctor>>>(
                '/doctors',
                { params: filters }
            );
            return response.data.data;
        } catch (error) {
            console.warn('API getDoctors failed, using static data:', error);
            await new Promise((resolve) => setTimeout(resolve, 300));

            let filtered = [...STATIC_DOCTORS];

            if (filters?.search) {
                const searchLower = filters.search.toLowerCase();
                filtered = filtered.filter(d =>
                    d.user?.firstName.toLowerCase().includes(searchLower) ||
                    d.user?.lastName.toLowerCase().includes(searchLower) ||
                    d.specialization.toLowerCase().includes(searchLower)
                );
            }

            if (filters?.specialization) {
                filtered = filtered.filter(d => d.specialization === filters.specialization);
            }

            if (filters?.departmentId) {
                filtered = filtered.filter(d => d.departmentId === filters.departmentId);
            }

            return paginateResults(filtered, filters?.page, filters?.pageSize);
        }
    },

    /**
     * Get doctor by ID (Hybrid: API -> Static)
     */
    async getDoctorById(id: string): Promise<Doctor> {
        try {
            const response = await apiClient.get<ApiResponse<Doctor>>(`/doctors/${id}`);
            return response.data.data;
        } catch (error) {
            console.warn(`API getDoctorById(${id}) failed, using static data:`, error);
            await new Promise((resolve) => setTimeout(resolve, 200));

            const doctor = STATIC_DOCTORS.find(d => d.id === id);
            if (!doctor) throw new Error('Doctor not found');
            return doctor;
        }
    },

    /**
     * Create new doctor (Hybrid: API -> Static)
     */
    async createDoctor(data: CreateDoctorRequest): Promise<Doctor> {
        try {
            const response = await apiClient.post<ApiResponse<Doctor>>('/doctors', data);
            return response.data.data;
        } catch (error) {
            console.warn('API createDoctor failed, using static data:', error);
            await new Promise((resolve) => setTimeout(resolve, 400));

            const newDoctor: Doctor = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                userId: data.userId || `u-${Date.now()}`,
                departmentId: data.departmentId,
                specialization: data.specialization,
                licenseNumber: data.licenseNumber,
                yearsOfExperience: data.yearsOfExperience,
                qualifications: data.qualifications,
                availableSlots: data.availableSlots || [],
                consultationFee: data.consultationFee,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                user: {
                    id: data.userId || `u-${Date.now()}`,
                    // Mock user data since we don't have a user creation flow in this mock
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: UserRole.DOCTOR,
                    phone: data.phone,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            };

            STATIC_DOCTORS.push(newDoctor);
            return newDoctor;
        }
    },

    /**
     * Get doctors by department (Hybrid: API -> Static)
     */
    async getDoctorsByDepartment(departmentId: string): Promise<Doctor[]> {
        try {
            const response = await apiClient.get<ApiResponse<Doctor[]>>(
                `/doctors/by-department/${departmentId}`
            );
            return response.data.data;
        } catch (error) {
            console.warn(`API getDoctorsByDepartment(${departmentId}) failed, using static data:`, error);
            await new Promise((resolve) => setTimeout(resolve, 200));

            return STATIC_DOCTORS.filter(d => d.departmentId === departmentId);
        }
    },
};
