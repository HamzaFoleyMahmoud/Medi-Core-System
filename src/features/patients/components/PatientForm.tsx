import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { patientSchema, type PatientFormData } from '../validation/patient.schema';
import type { Patient } from '@/types/entities';

interface PatientFormProps {
    initialData?: Patient;
    onSubmit: (data: PatientFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const PatientForm: React.FC<PatientFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
}) => {
    const [allergiesInput, setAllergiesInput] = useState('');
    const [conditionsInput, setConditionsInput] = useState('');

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<PatientFormData>({
        resolver: zodResolver(patientSchema),
        defaultValues: initialData
            ? {
                firstName: initialData.firstName,
                lastName: initialData.lastName,
                dateOfBirth: initialData.dateOfBirth.split('T')[0],
                gender: initialData.gender,
                phone: initialData.phone,
                email: initialData.email,
                address: initialData.address,
                emergencyContact: initialData.emergencyContact,
                bloodGroup: initialData.bloodGroup,
                allergies: initialData.allergies,
                chronicConditions: initialData.chronicConditions,
            }
            : {
                allergies: [],
                chronicConditions: [],
            },
    });

    const handleFormSubmit = async (data: PatientFormData) => {
        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        {...register('firstName')}
                        error={errors.firstName?.message}
                        required
                        fullWidth
                    />
                    <Input
                        label="Last Name"
                        {...register('lastName')}
                        error={errors.lastName?.message}
                        required
                        fullWidth
                    />
                    <Input
                        label="Date of Birth"
                        type="date"
                        {...register('dateOfBirth')}
                        error={errors.dateOfBirth?.message}
                        required
                        fullWidth
                    />
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Gender"
                                {...field}
                                options={[
                                    { value: 'MALE', label: 'Male' },
                                    { value: 'FEMALE', label: 'Female' },
                                    { value: 'OTHER', label: 'Other' },
                                ]}
                                placeholder="Select gender"
                                error={errors.gender?.message}
                                required
                                fullWidth
                            />
                        )}
                    />
                </div>
            </div>

            {/* Contact Information */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Phone"
                        type="tel"
                        {...register('phone')}
                        error={errors.phone?.message}
                        required
                        fullWidth
                    />
                    <Input
                        label="Email"
                        type="email"
                        {...register('email')}
                        error={errors.email?.message}
                        required
                        fullWidth
                    />
                </div>
                <div className="mt-4">
                    <Input
                        label="Address"
                        {...register('address')}
                        error={errors.address?.message}
                        required
                        fullWidth
                    />
                </div>
            </div>

            {/* Emergency Contact */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        label="Name"
                        {...register('emergencyContact.name')}
                        error={errors.emergencyContact?.name?.message}
                        required
                        fullWidth
                    />
                    <Input
                        label="Relationship"
                        {...register('emergencyContact.relationship')}
                        error={errors.emergencyContact?.relationship?.message}
                        required
                        fullWidth
                    />
                    <Input
                        label="Phone"
                        type="tel"
                        {...register('emergencyContact.phone')}
                        error={errors.emergencyContact?.phone?.message}
                        required
                        fullWidth
                    />
                </div>
            </div>

            {/* Medical Information */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Blood Group"
                        {...register('bloodGroup')}
                        error={errors.bloodGroup?.message}
                        placeholder="e.g., A+, O-, AB+"
                        fullWidth
                    />
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isLoading}>
                    {initialData ? 'Update Patient' : 'Create Patient'}
                </Button>
            </div>
        </form>
    );
};
