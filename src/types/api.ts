// ============================================
// API Request/Response Types
// ============================================

// Generic API Response
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

// Paginated Response
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

// Error Response
export interface ApiError {
    message: string;
    code: string;
    details?: Record<string, string[]>;
}

// Pagination Parameters
export interface PaginationParams {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// Filter Parameters
export interface FilterParams {
    search?: string;
    startDate?: string;
    endDate?: string;
}

// Auth Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
    token: string;
    refreshToken: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

// Patient API Types
export interface CreatePatientRequest {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phone: string;
    email: string;
    address: string;
    emergencyContact: {
        name: string;
        relationship: string;
        phone: string;
    };
    bloodGroup?: string;
    allergies?: string[];
    chronicConditions?: string[];
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> { }

export interface PatientFilters extends PaginationParams, FilterParams {
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    bloodGroup?: string;
}

// Appointment API Types
export interface CreateAppointmentRequest {
    patientId: string;
    doctorId: string;
    scheduledAt: string;
    duration: number;
    reason: string;
    notes?: string;
}

export interface UpdateAppointmentRequest extends Partial<CreateAppointmentRequest> {
    status?: string;
}

export interface AppointmentFilters extends PaginationParams, FilterParams {
    patientId?: string;
    doctorId?: string;
    status?: string;
    date?: string;
}

// Doctor API Types
export interface CreateDoctorRequest {
    userId?: string; // Optional if we create user implicitly or separately
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    departmentId: string;
    specialization: string;
    licenseNumber: string;
    yearsOfExperience: number;
    qualifications: string[];
    consultationFee: number;
    availableSlots?: string[];
}

export interface UpdateDoctorRequest extends Partial<CreateDoctorRequest> { }

export interface DoctorFilters extends PaginationParams, FilterParams {
    departmentId?: string;
    specialization?: string;
}

// Nurse API Types
export interface CreateNurseRequest {
    userId?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    departmentId: string;
    shift: 'MORNING' | 'EVENING' | 'NIGHT' | 'ROTATING';
    licenseNumber: string;
    yearsOfExperience: number;
}

export interface UpdateNurseRequest extends Partial<CreateNurseRequest> { }

export interface NurseFilters extends PaginationParams, FilterParams {
    departmentId?: string;
    shift?: string;
}

// Medical Record API Types
export interface CreateMedicalRecordRequest {
    appointmentId: string;
    patientId: string;
    doctorId: string;
    diagnosis: string;
    symptoms: string[];
    vitalSigns: {
        bloodPressure?: string;
        heartRate?: number;
        temperature?: number;
        weight?: number;
        height?: number;
    };
    notes: string;
}

export interface UpdateMedicalRecordRequest extends Partial<CreateMedicalRecordRequest> { }

// Billing API Types
export interface CreateBillingRequest {
    patientId: string;
    medicalRecordId?: string;
    items: {
        description: string;
        quantity: number;
        unitPrice: number;
    }[];
    tax?: number;
    discount?: number;
    status: 'PENDING' | 'PAID' | 'PARTIALLY_PAID';
    dueDate?: string;
}

export interface UpdateBillingRequest extends Partial<CreateBillingRequest> { }

export interface BillingFilters extends PaginationParams, FilterParams {
    patientId?: string;
    status?: string;
    minAmount?: number;
    maxAmount?: number;
}
