import { z } from 'zod';

export const patientSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
        required_error: 'Gender is required',
    }),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    email: z.string().email('Invalid email address'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    emergencyContact: z.object({
        name: z.string().min(2, 'Emergency contact name is required'),
        relationship: z.string().min(2, 'Relationship is required'),
        phone: z.string().min(10, 'Emergency contact phone is required'),
    }),
    bloodGroup: z.string().optional(),
    allergies: z.array(z.string()).optional(),
    chronicConditions: z.array(z.string()).optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;
