import { useState } from 'react';
import { DoctorList } from '../components/DoctorList';
import { AddDoctorModal } from '../components/AddDoctorModal';
import { Button } from '@/components/ui/Button';

export const DoctorsPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage and view all registered doctors
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} variant="primary">
                    <svg
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                    Add Doctor
                </Button>
            </div>

            <DoctorList />

            <AddDoctorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};
