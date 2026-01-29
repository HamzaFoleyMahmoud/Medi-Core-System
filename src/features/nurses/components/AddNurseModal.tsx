import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateNurse } from '../hooks/useNurses';
import { Button } from '@/components/ui/Button';

const nurseSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    departmentId: z.string().min(1, 'Department is required'),
    shift: z.enum(['MORNING', 'EVENING', 'NIGHT', 'ROTATING']),
    licenseNumber: z.string().min(5, 'License number is required'),
    yearsOfExperience: z.number().min(0, 'Experience must be a positive number'),
});

type NurseFormData = z.infer<typeof nurseSchema>;

interface AddNurseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddNurseModal: React.FC<AddNurseModalProps> = ({ isOpen, onClose }) => {
    const createNurse = useCreateNurse();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<NurseFormData>({
        resolver: zodResolver(nurseSchema),
        defaultValues: {
            yearsOfExperience: 0,
            shift: 'MORNING',
        },
    });

    const onSubmit = async (data: NurseFormData) => {
        try {
            await createNurse.mutateAsync(data);
            reset();
            onClose();
        } catch (error) {
            console.error('Failed to create nurse:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Nurse</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        {...register('firstName')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    />
                                    {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        {...register('lastName')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    />
                                    {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        {...register('email')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input
                                        type="text"
                                        {...register('phone')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    />
                                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Department ID</label>
                                    <input
                                        type="text"
                                        {...register('departmentId')}
                                        placeholder="dept1, dept2..."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    />
                                    {errors.departmentId && <p className="mt-1 text-xs text-red-500">{errors.departmentId.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Shift</label>
                                    <select
                                        {...register('shift')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    >
                                        <option value="MORNING">Morning</option>
                                        <option value="EVENING">Evening</option>
                                        <option value="NIGHT">Night</option>
                                        <option value="ROTATING">Rotating</option>
                                    </select>
                                    {errors.shift && <p className="mt-1 text-xs text-red-500">{errors.shift.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">License Number</label>
                                    <input
                                        type="text"
                                        {...register('licenseNumber')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    />
                                    {errors.licenseNumber && <p className="mt-1 text-xs text-red-500">{errors.licenseNumber.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                                    <input
                                        type="number"
                                        {...register('yearsOfExperience', { valueAsNumber: true })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    />
                                    {errors.yearsOfExperience && <p className="mt-1 text-xs text-red-500">{errors.yearsOfExperience.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                            <Button type="submit" variant="primary" isLoading={createNurse.isPending}>
                                Add Nurse
                            </Button>
                            <Button type="button" variant="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
