import { z } from 'zod';

export const appointmentSchema = z.object({
    patientId: z.string().min(1, 'Patient is required'),
    doctorId: z.string().min(1, 'Doctor is required'),
    scheduledAt: z.string().min(1, 'Date and time are required'),
    duration: z.number().min(15, 'Duration must be at least 15 minutes'),
    reason: z.string().min(5, 'Reason must be at least 5 characters'),
    notes: z.string().optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
