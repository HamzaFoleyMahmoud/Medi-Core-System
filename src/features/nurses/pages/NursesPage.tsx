import { useState } from 'react';
import { NurseList } from '../components/NurseList';
import { AddNurseModal } from '../components/AddNurseModal';
import { Button } from '@/components/ui/Button';

export const NursesPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Nurses</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage and view all registered nurses
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
                    Add Nurse
                </Button>
            </div>

            <NurseList />

            <AddNurseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};
