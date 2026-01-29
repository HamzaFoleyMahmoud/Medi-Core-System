import type {
    PaginatedResponse,
    CreatePatientRequest,
    UpdatePatientRequest,
    PatientFilters,
    ApiResponse,
} from '@/types/api';
import type { Patient } from '@/types/entities';
import apiClient, { extractData } from './client';

// Static patient database
let STATIC_PATIENTS: Patient[] = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1985-03-15',
        gender: 'MALE',
        phone: '+1234567890',
        email: 'john.doe@example.com',
        address: '123 Main St, New York, NY 10001',
        emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Spouse',
            phone: '+1234567891',
        },
        bloodGroup: 'O+',
        allergies: ['Penicillin'],
        chronicConditions: ['Hypertension'],
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-01-15').toISOString(),
    },
    {
        id: '2',
        firstName: 'Mary',
        lastName: 'Smith',
        dateOfBirth: '1990-07-22',
        gender: 'FEMALE',
        phone: '+1234567892',
        email: 'mary.smith@example.com',
        address: '456 Oak Ave, Los Angeles, CA 90001',
        emergencyContact: {
            name: 'Robert Smith',
            relationship: 'Father',
            phone: '+1234567893',
        },
        bloodGroup: 'A+',
        allergies: [],
        chronicConditions: ['Diabetes Type 2'],
        createdAt: new Date('2024-02-10').toISOString(),
        updatedAt: new Date('2024-02-10').toISOString(),
    },
    {
        id: '3',
        firstName: 'James',
        lastName: 'Wilson',
        dateOfBirth: '1978-11-30',
        gender: 'MALE',
        phone: '+1234567894',
        email: 'james.wilson@example.com',
        address: '789 Pine Rd, Chicago, IL 60601',
        emergencyContact: {
            name: 'Linda Wilson',
            relationship: 'Wife',
            phone: '+1234567895',
        },
        bloodGroup: 'B+',
        allergies: ['Latex', 'Aspirin'],
        chronicConditions: [],
        createdAt: new Date('2024-03-05').toISOString(),
        updatedAt: new Date('2024-03-05').toISOString(),
    },
];

// Helper to generate unique IDs
const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

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

// Helper for filtering patients
const filterPatients = (patients: Patient[], filters?: PatientFilters): Patient[] => {
    let filtered = [...patients];

    if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
            (p) =>
                p.firstName.toLowerCase().includes(searchLower) ||
                p.lastName.toLowerCase().includes(searchLower) ||
                p.email.toLowerCase().includes(searchLower) ||
                p.phone.includes(searchLower)
        );
    }

    if (filters?.gender) {
        filtered = filtered.filter((p) => p.gender === filters.gender);
    }

    if (filters?.bloodGroup) {
        filtered = filtered.filter((p) => p.bloodGroup === filters.bloodGroup);
    }

    return filtered;
};

export const patientsService = {
    /**
     * Get paginated list of patients (Hybrid: API -> Static)
     */
    async getPatients(filters?: PatientFilters): Promise<PaginatedResponse<Patient>> {
        try {
            const response = await apiClient.get<ApiResponse<PaginatedResponse<Patient>>>('/patients', {
                params: filters,
            });
            return extractData(response.data);
        } catch (error) {
            console.warn('API getPatients failed, using static data:', error);
            // Simulate network delay for consistency
            await new Promise((resolve) => setTimeout(resolve, 300));

            const filtered = filterPatients(STATIC_PATIENTS, filters);
            return paginateResults(filtered, filters?.page, filters?.pageSize);
        }
    },

    /**
     * Get patient by ID (Hybrid: API -> Static)
     */
    async getPatientById(id: string): Promise<Patient> {
        try {
            const response = await apiClient.get<ApiResponse<Patient>>(`/patients/${id}`);
            return extractData(response.data);
        } catch (error) {
            console.warn(`API getPatientById(${id}) failed, using static data:`, error);
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 200));

            const patient = STATIC_PATIENTS.find((p) => p.id === id);
            if (!patient) {
                throw new Error('Patient not found');
            }
            return patient;
        }
    },

    /**
     * Create new patient (Hybrid: API -> Static)
     */
    async createPatient(data: CreatePatientRequest): Promise<Patient> {
        try {
            const response = await apiClient.post<ApiResponse<Patient>>('/patients', data);
            return extractData(response.data);
        } catch (error) {
            console.warn('API createPatient failed, using static data:', error);
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 400));

            const newPatient: Patient = {
                id: generateId(),
                ...data,
                allergies: data.allergies || [],
                chronicConditions: data.chronicConditions || [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            STATIC_PATIENTS.push(newPatient);
            return newPatient;
        }
    },

    /**
     * Update existing patient (Hybrid: API -> Static)
     */
    async updatePatient(id: string, data: UpdatePatientRequest): Promise<Patient> {
        try {
            const response = await apiClient.put<ApiResponse<Patient>>(`/patients/${id}`, data);
            return extractData(response.data);
        } catch (error) {
            console.warn(`API updatePatient(${id}) failed, using static data:`, error);
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 400));

            const index = STATIC_PATIENTS.findIndex((p) => p.id === id);
            if (index === -1) {
                throw new Error('Patient not found');
            }

            const existingPatient = STATIC_PATIENTS[index];
            if (!existingPatient) {
                throw new Error('Patient not found');
            }

            const updatedPatient: Patient = {
                ...existingPatient,
                ...data,
                updatedAt: new Date().toISOString(),
            };

            STATIC_PATIENTS[index] = updatedPatient;
            return updatedPatient;
        }
    },

    /**
     * Delete patient (Hybrid: API -> Static)
     */
    async deletePatient(id: string): Promise<void> {
        try {
            await apiClient.delete<ApiResponse<void>>(`/patients/${id}`);
        } catch (error) {
            console.warn(`API deletePatient(${id}) failed, using static data:`, error);
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 300));

            const index = STATIC_PATIENTS.findIndex((p) => p.id === id);
            if (index === -1) {
                throw new Error('Patient not found');
            }

            STATIC_PATIENTS.splice(index, 1);
        }
    },

    /**
     * Search patients by name or phone (Hybrid: API -> Static)
     */
    async searchPatients(query: string): Promise<Patient[]> {
        try {
            const response = await apiClient.get<ApiResponse<Patient[]>>('/patients/search', {
                params: { query },
            });
            return extractData(response.data);
        } catch (error) {
            console.warn('API searchPatients failed, using static data:', error);
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 200));

            const queryLower = query.toLowerCase();
            return STATIC_PATIENTS.filter(
                (p) =>
                    p.firstName.toLowerCase().includes(queryLower) ||
                    p.lastName.toLowerCase().includes(queryLower) ||
                    p.phone.includes(query) ||
                    p.email.toLowerCase().includes(queryLower)
            );
        }
    },
};
