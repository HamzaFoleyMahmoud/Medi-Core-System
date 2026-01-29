import { useState } from 'react';
import { AppointmentList } from '../components/AppointmentList';
import { AppointmentForm } from '../components/AppointmentForm';
import { Modal } from '@/components/ui/Modal';
import { useCreateAppointment, useUpdateAppointment, useAppointment } from '../hooks/useAppointments';
import type { AppointmentFormData } from '../validation/appointment.schema';

export const AppointmentsPage: React.FC = () => {
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);

    const createAppointment = useCreateAppointment();
    const updateAppointment = useUpdateAppointment();
    const { data: editingAppointment } = useAppointment(editingAppointmentId || '');

    const handleAppointmentClick = (appointmentId: string) => {
        setSelectedAppointmentId(appointmentId);
        // Could open a detail modal here
    };

    const handleBookAppointment = () => {
        setEditingAppointmentId(null);
        setIsFormOpen(true);
    };

    const handleEditAppointment = (appointmentId: string) => {
        setEditingAppointmentId(appointmentId);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (data: AppointmentFormData) => {
        try {
            if (editingAppointmentId) {
                await updateAppointment.mutateAsync({ id: editingAppointmentId, data });
            } else {
                await createAppointment.mutateAsync(data);
            }
            setIsFormOpen(false);
            setEditingAppointmentId(null);
        } catch (error) {
            console.error('Failed to save appointment:', error);
        }
    };

    const handleFormCancel = () => {
        setIsFormOpen(false);
        setEditingAppointmentId(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Manage and schedule patient appointments
                </p>
            </div>

            <AppointmentList
                onAppointmentClick={handleAppointmentClick}
                onBookAppointment={handleBookAppointment}
                onEditAppointment={handleEditAppointment}
            />

            {/* Appointment Form Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={handleFormCancel}
                title={editingAppointmentId ? 'Edit Appointment' : 'Book New Appointment'}
                size="lg"
            >
                <AppointmentForm
                    initialData={editingAppointment}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    isLoading={createAppointment.isPending || updateAppointment.isPending}
                />
            </Modal>
        </div>
    );
};
