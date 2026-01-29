import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { appointmentSchema, type AppointmentFormData } from '../validation/appointment.schema';
import type { Appointment } from '@/types/entities';
import { useQuery } from '@tanstack/react-query';
import { patientsService } from '@/services/api/patients.service';
import { doctorsService } from '@/services/api/doctors.service';

interface AppointmentFormProps {
    initialData?: Appointment;
    onSubmit: (data: AppointmentFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
}) => {
    // Fetch patients for dropdown
    const { data: patientsData } = useQuery({
        queryKey: ['patients', 'all'],
        queryFn: () => patientsService.getPatients({ pageSize: 100 }),
    });

    // Fetch doctors for dropdown
    const { data: doctorsData } = useQuery({
        queryKey: ['doctors', 'all'],
        queryFn: () => doctorsService.getDoctors({ pageSize: 100 }),
    });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<AppointmentFormData>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: initialData
            ? {
                patientId: initialData.patientId,
                doctorId: initialData.doctorId,
                scheduledAt: initialData.scheduledAt.slice(0, 16), // Format for datetime-local
                duration: initialData.duration,
                reason: initialData.reason,
                notes: initialData.notes,
            }
            : {
                duration: 30,
            },
    });

    const handleFormSubmit = async (data: AppointmentFormData) => {
        await onSubmit(data);
    };

    const patientOptions =
        patientsData?.data.map((patient) => ({
            value: patient.id,
            label: `${patient.firstName} ${patient.lastName}`,
        })) || [];

    const doctorOptions =
        doctorsData?.data.map((doctor) => ({
            value: doctor.id,
            label: `Dr. ${doctor.user?.firstName} ${doctor.user?.lastName} - ${doctor.specialization}`,
        })) || [];

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Patient and Doctor Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                    name="patientId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Patient"
                            {...field}
                            options={patientOptions}
                            placeholder="Select patient"
                            error={errors.patientId?.message}
                            required
                            fullWidth
                        />
                    )}
                />
                <Controller
                    name="doctorId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Doctor"
                            {...field}
                            options={doctorOptions}
                            placeholder="Select doctor"
                            error={errors.doctorId?.message}
                            required
                            fullWidth
                        />
                    )}
                />
            </div>

            {/* Date, Time, and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Date & Time"
                    type="datetime-local"
                    {...register('scheduledAt')}
                    error={errors.scheduledAt?.message}
                    required
                    fullWidth
                />
                <Controller
                    name="duration"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                        <Select
                            label="Duration (minutes)"
                            {...field}
                            value={value?.toString()}
                            onChange={(e) => onChange(parseInt(e.target.value))}
                            options={[
                                { value: '15', label: '15 minutes' },
                                { value: '30', label: '30 minutes' },
                                { value: '45', label: '45 minutes' },
                                { value: '60', label: '1 hour' },
                                { value: '90', label: '1.5 hours' },
                                { value: '120', label: '2 hours' },
                            ]}
                            error={errors.duration?.message}
                            required
                            fullWidth
                        />
                    )}
                />
            </div>

            {/* Reason */}
            <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Visit <span className="text-danger-500">*</span>
                </label>
                <textarea
                    id="reason"
                    {...register('reason')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Describe the reason for this appointment..."
                />
                {errors.reason && (
                    <p className="mt-1 text-sm text-danger-600">{errors.reason.message}</p>
                )}
            </div>

            {/* Notes */}
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                </label>
                <textarea
                    id="notes"
                    {...register('notes')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Any additional information..."
                />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isLoading}>
                    {initialData ? 'Update Appointment' : 'Book Appointment'}
                </Button>
            </div>
        </form>
    );
};
