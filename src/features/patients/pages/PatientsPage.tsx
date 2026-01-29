import { useState } from 'react';
import { PatientList } from '../components/PatientList';
import { PatientForm } from '../components/PatientForm';
import { PatientDetail } from '../components/PatientDetail';
import { Modal } from '@/components/ui/Modal';
import { useCreatePatient, useUpdatePatient, usePatient } from '../hooks/usePatients';
import type { PatientFormData } from '../validation/patient.schema';

type ViewMode = 'list' | 'detail';

export const PatientsPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPatientId, setEditingPatientId] = useState<string | null>(null);

    const createPatient = useCreatePatient();
    const updatePatient = useUpdatePatient();
    const { data: editingPatient } = usePatient(editingPatientId || '');

    const handlePatientClick = (patientId: string) => {
        setSelectedPatientId(patientId);
        setViewMode('detail');
    };

    const handleAddPatient = () => {
        setEditingPatientId(null);
        setIsFormOpen(true);
    };

    const handleEditPatient = (patientId: string) => {
        setEditingPatientId(patientId);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (data: PatientFormData) => {
        try {
            if (editingPatientId) {
                await updatePatient.mutateAsync({ id: editingPatientId, data });
            } else {
                await createPatient.mutateAsync(data);
            }
            setIsFormOpen(false);
            setEditingPatientId(null);
        } catch (error) {
            console.error('Failed to save patient:', error);
        }
    };

    const handleFormCancel = () => {
        setIsFormOpen(false);
        setEditingPatientId(null);
    };

    const handleCloseDetail = () => {
        setViewMode('list');
        setSelectedPatientId(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Manage patient records and information
                </p>
            </div>

            {viewMode === 'list' ? (
                <PatientList
                    onPatientClick={handlePatientClick}
                    onAddPatient={handleAddPatient}
                    onEditPatient={handleEditPatient}
                />
            ) : (
                selectedPatientId && (
                    <PatientDetail
                        patientId={selectedPatientId}
                        onEdit={() => handleEditPatient(selectedPatientId)}
                        onClose={handleCloseDetail}
                    />
                )
            )}

            {/* Patient Form Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={handleFormCancel}
                title={editingPatientId ? 'Edit Patient' : 'Add New Patient'}
                size="xl"
            >
                <PatientForm
                    initialData={editingPatient}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    isLoading={createPatient.isPending || updatePatient.isPending}
                />
            </Modal>
        </div>
    );
};
