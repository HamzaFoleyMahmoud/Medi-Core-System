import { useState } from 'react';
import { usePatient } from '../hooks/usePatients';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';

interface PatientDetailProps {
    patientId: string;
    onEdit: () => void;
    onClose: () => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({
    patientId,
    onEdit,
    onClose,
}) => {
    const { data: patient, isLoading, error, refetch } = usePatient(patientId);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !patient) {
        return (
            <ErrorMessage
                message={(error as Error)?.message || 'Failed to load patient details'}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {patient.firstName} {patient.lastName}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Patient ID: {patient.id}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={onEdit} variant="primary" size="sm">
                        Edit
                    </Button>
                    <Button onClick={onClose} variant="ghost" size="sm">
                        Close
                    </Button>
                </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {format(new Date(patient.dateOfBirth), 'MMMM dd, yyyy')}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Gender</dt>
                        <dd className="mt-1 text-sm text-gray-900">{patient.gender}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Blood Group</dt>
                        <dd className="mt-1 text-sm text-gray-900">{patient.bloodGroup || 'N/A'}</dd>
                    </div>
                </dl>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="mt-1 text-sm text-gray-900">{patient.phone}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-sm text-gray-900">{patient.email}</dd>
                    </div>
                    <div className="md:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Address</dt>
                        <dd className="mt-1 text-sm text-gray-900">{patient.address}</dd>
                    </div>
                </dl>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{patient.emergencyContact.name}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Relationship</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {patient.emergencyContact.relationship}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="mt-1 text-sm text-gray-900">{patient.emergencyContact.phone}</dd>
                    </div>
                </dl>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                <dl className="space-y-4">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Allergies</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {patient.allergies && patient.allergies.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {patient.allergies.map((allergy, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800"
                                        >
                                            {allergy}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                'None reported'
                            )}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Chronic Conditions</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {patient.chronicConditions && patient.chronicConditions.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {patient.chronicConditions.map((condition, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800"
                                        >
                                            {condition}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                'None reported'
                            )}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};
