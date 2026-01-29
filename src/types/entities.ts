// ============================================
// Domain Entity Types
// ============================================

export enum UserRole {
    ADMIN = 'ADMIN',
    DOCTOR = 'DOCTOR',
    NURSE = 'NURSE',
    RECEPTIONIST = 'RECEPTIONIST',
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phone: string;
    createdAt: string;
    updatedAt: string;
}

export interface Department {
    id: string;
    name: string;
    description: string;
    headDoctorId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Doctor {
    id: string;
    userId: string;
    user?: User;
    departmentId: string;
    department?: Department;
    specialization: string;
    licenseNumber: string;
    yearsOfExperience: number;
    qualifications: string[];
    availableSlots: string[]; // ISO time strings
    consultationFee: number;
    createdAt: string;
    updatedAt: string;
}

export interface Nurse {
    id: string;
    userId: string;
    user?: User;
    departmentId: string;
    department?: Department;
    shift: 'MORNING' | 'EVENING' | 'NIGHT' | 'ROTATING';
    licenseNumber: string;
    yearsOfExperience: number;
    createdAt: string;
    updatedAt: string;
}

export interface Patient {
    id: string;
    userId?: string;
    user?: User;
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
    allergies: string[];
    chronicConditions: string[];
    createdAt: string;
    updatedAt: string;
}

export enum AppointmentStatus {
    SCHEDULED = 'SCHEDULED',
    CONFIRMED = 'CONFIRMED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    NO_SHOW = 'NO_SHOW',
}

export interface Appointment {
    id: string;
    patientId: string;
    patient?: Patient;
    doctorId: string;
    doctor?: Doctor;
    scheduledAt: string;
    duration: number; // in minutes
    status: AppointmentStatus;
    reason: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface MedicalRecord {
    id: string;
    appointmentId: string;
    appointment?: Appointment;
    patientId: string;
    patient?: Patient;
    doctorId: string;
    doctor?: Doctor;
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
    createdAt: string;
    updatedAt: string;
}

export interface Prescription {
    id: string;
    medicalRecordId: string;
    medicalRecord?: MedicalRecord;
    medications: {
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions?: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    PARTIALLY_PAID = 'PARTIALLY_PAID',
    REFUNDED = 'REFUNDED',
    CANCELLED = 'CANCELLED',
}

export interface Billing {
    id: string;
    medicalRecordId: string;
    medicalRecord?: MedicalRecord;
    patientId: string;
    patient?: Patient;
    items: {
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    status: PaymentStatus;
    createdAt: string;
    updatedAt: string;
}

export interface Payment {
    id: string;
    billingId: string;
    billing?: Billing;
    amount: number;
    method: 'CASH' | 'CARD' | 'INSURANCE' | 'ONLINE';
    transactionId?: string;
    paidAt: string;
    createdAt: string;
    updatedAt: string;
}
