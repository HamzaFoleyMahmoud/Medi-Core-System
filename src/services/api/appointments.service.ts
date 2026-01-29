import apiClient from './client';
import type {
    ApiResponse,
    PaginatedResponse,
    CreateAppointmentRequest,
    UpdateAppointmentRequest,
    AppointmentFilters,
} from '@/types/api';
import { type Appointment, AppointmentStatus } from '@/types/entities';
import { patientsService } from './patients.service';
import { doctorsService } from './doctors.service';

// Static appointments database
let STATIC_APPOINTMENTS: Appointment[] = [
    {
        id: '1',
        patientId: '1', // Matches John Doe
        doctorId: '1',
        scheduledAt: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Tomorrow
        duration: 30,
        status: AppointmentStatus.SCHEDULED,
        reason: 'Regular checkup',
        notes: 'Patient reports mild headache',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        patientId: '2', // Matches Mary Smith
        doctorId: '2',
        scheduledAt: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), // Day after tomorrow
        duration: 45,
        status: AppointmentStatus.CONFIRMED,
        reason: 'Follow up on blood pressure',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        patientId: '3', // Matches James Wilson
        doctorId: '1',
        scheduledAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Yesterday
        duration: 30,
        status: AppointmentStatus.COMPLETED,
        reason: 'Annual physical',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
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

// Helper to enrich appointment with patient and doctor details
const enrichAppointment = async (appointment: Appointment): Promise<Appointment> => {
    try {
        const [patient, doctor] = await Promise.all([
            patientsService.getPatientById(appointment.patientId).catch(() => undefined),
            doctorsService.getDoctorById(appointment.doctorId).catch(() => undefined)
        ]);

        return {
            ...appointment,
            patient,
            doctor,
        };
    } catch (error) {
        console.warn('Failed to enrich appointment:', error);
        return appointment;
    }
};

export const appointmentsService = {
    /**
     * Get paginated list of appointments (Hybrid: API -> Static)
     */
    async getAppointments(
        filters?: AppointmentFilters
    ): Promise<PaginatedResponse<Appointment>> {
        try {
            const response = await apiClient.get<ApiResponse<PaginatedResponse<Appointment>>>(
                '/appointments',
                { params: filters }
            );
            return response.data.data;
        } catch (error) {
            console.warn('API getAppointments failed, using static data:', error);
            await new Promise((resolve) => setTimeout(resolve, 300));

            let filtered = [...STATIC_APPOINTMENTS];

            if (filters?.status) {
                filtered = filtered.filter(a => a.status === filters.status);
            }

            if (filters?.doctorId) {
                filtered = filtered.filter(a => a.doctorId === filters.doctorId);
            }

            if (filters?.patientId) {
                filtered = filtered.filter(a => a.patientId === filters.patientId);
            }

            if (filters?.startDate && filters?.endDate) {
                const start = new Date(filters.startDate).getTime();
                const end = new Date(filters.endDate).getTime();
                filtered = filtered.filter(a => {
                    const time = new Date(a.scheduledAt).getTime();
                    return time >= start && time <= end;
                });
            } else if (filters?.date) {
                const targetDate = new Date(filters.date).toDateString();
                filtered = filtered.filter(a =>
                    new Date(a.scheduledAt).toDateString() === targetDate
                );
            }

            const paginated = paginateResults(filtered, filters?.page, filters?.pageSize);

            // Enrich the paginated data
            const enrichedData = await Promise.all(
                paginated.data.map(enrichAppointment)
            );

            return {
                ...paginated,
                data: enrichedData
            };
        }
    },

    /**
     * Get appointment by ID (Hybrid: API -> Static)
     */
    async getAppointmentById(id: string): Promise<Appointment> {
        try {
            const response = await apiClient.get<ApiResponse<Appointment>>(
                `/appointments/${id}`
            );
            return response.data.data;
        } catch (error) {
            console.warn(`API getAppointmentById(${id}) failed, using static data:`, error);
            await new Promise((resolve) => setTimeout(resolve, 200));

            const appointment = STATIC_APPOINTMENTS.find(a => a.id === id);
            if (!appointment) throw new Error('Appointment not found');
            return enrichAppointment(appointment);
        }
    },

    /**
     * Create new appointment (Hybrid: API -> Static)
     */
    async createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
        try {
            const response = await apiClient.post<ApiResponse<Appointment>>(
                '/appointments',
                data
            );
            return response.data.data;
        } catch (error) {
            console.warn('API createAppointment failed, using static data:', error);
            await new Promise((resolve) => setTimeout(resolve, 400));

            const newAppointment: Appointment = {
                id: generateId(),
                ...data,
                status: AppointmentStatus.SCHEDULED,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            STATIC_APPOINTMENTS.push(newAppointment);
            return enrichAppointment(newAppointment);
        }
    },

    /**
     * Update existing appointment (Hybrid: API -> Static)
     */
    async updateAppointment(
        id: string,
        data: UpdateAppointmentRequest
    ): Promise<Appointment> {
        try {
            const response = await apiClient.patch<ApiResponse<Appointment>>(
                `/appointments/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            console.warn(`API updateAppointment(${id}) failed, using static data:`, error);
            await new Promise((resolve) => setTimeout(resolve, 400));

            const index = STATIC_APPOINTMENTS.findIndex(a => a.id === id);
            if (index === -1) throw new Error('Appointment not found');

            const existing = STATIC_APPOINTMENTS[index];
            if (!existing) throw new Error('Appointment not found');

            const updatedAppointment: Appointment = {
                ...existing,
                patientId: data.patientId ?? existing.patientId,
                doctorId: data.doctorId ?? existing.doctorId,
                scheduledAt: data.scheduledAt ?? existing.scheduledAt,
                duration: data.duration ?? existing.duration,
                reason: data.reason ?? existing.reason,
                notes: data.notes ?? existing.notes,
                status: (data.status as AppointmentStatus) || existing.status,
                updatedAt: new Date().toISOString(),
            };

            STATIC_APPOINTMENTS[index] = updatedAppointment;
            return enrichAppointment(updatedAppointment);
        }
    },

    /**
     * Cancel appointment (Hybrid: API -> Static)
     */
    async cancelAppointment(id: string): Promise<Appointment> {
        try {
            const response = await apiClient.patch<ApiResponse<Appointment>>(
                `/appointments/${id}/cancel`
            );
            return response.data.data;
        } catch (error) {
            console.warn(`API cancelAppointment(${id}) failed, using static data:`, error);
            await new Promise((resolve) => setTimeout(resolve, 300));

            const index = STATIC_APPOINTMENTS.findIndex(a => a.id === id);
            if (index === -1) throw new Error('Appointment not found');

            const existing = STATIC_APPOINTMENTS[index];
            if (!existing) throw new Error('Appointment not found');

            const updatedAppointment: Appointment = {
                ...existing,
                status: AppointmentStatus.CANCELLED,
                updatedAt: new Date().toISOString(),
            };

            STATIC_APPOINTMENTS[index] = updatedAppointment;
            return enrichAppointment(updatedAppointment);
        }
    },

    /**
     * Get appointments for a specific date (Hybrid: API -> Static)
     */
    async getAppointmentsByDate(date: string): Promise<Appointment[]> {
        try {
            const response = await apiClient.get<ApiResponse<Appointment[]>>(
                '/appointments/by-date',
                { params: { date } }
            );
            return response.data.data;
        } catch (error) {
            console.warn('API getAppointmentsByDate failed, using static data:', error);
            await new Promise((resolve) => setTimeout(resolve, 200));

            const targetDate = new Date(date).toDateString();
            const appointments = STATIC_APPOINTMENTS.filter(a =>
                new Date(a.scheduledAt).toDateString() === targetDate
            );
            return Promise.all(appointments.map(enrichAppointment));
        }
    },

    /**
     * Check doctor availability (Hybrid: API -> Static)
     */
    async checkDoctorAvailability(
        doctorId: string,
        date: string,
        duration: number
    ): Promise<{ available: boolean; slots: string[] }> {
        try {
            const response = await apiClient.get<
                ApiResponse<{ available: boolean; slots: string[] }>
            >('/appointments/check-availability', {
                params: { doctorId, date, duration },
            });
            return response.data.data;
        } catch (error) {
            console.warn('API checkDoctorAvailability failed, using static data:', error);
            await new Promise((resolve) => setTimeout(resolve, 300));

            // Mock implementation: always return some slots
            return {
                available: true,
                slots: [
                    '09:00', '09:30', '10:00', '10:30',
                    '11:00', '11:30', '14:00', '14:30',
                    '15:00', '15:30'
                ]
            };
        }
    },
};
