import React, { useState } from 'react';
import { useCreateBilling } from '../hooks/useBilling';
import type { CreateBillingRequest } from '@/types/api';

interface CreateBillingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateBillingModal: React.FC<CreateBillingModalProps> = ({ isOpen, onClose }) => {
    const { mutate: createBilling, isPending } = useCreateBilling();
    const [formData, setFormData] = useState<CreateBillingRequest>({
        patientId: '',
        items: [{ description: '', quantity: 1, unitPrice: 0 }],
        status: 'PENDING',
        tax: 0,
        discount: 0,
        dueDate: new Date().toISOString().split('T')[0],
    });

    if (!isOpen) return null;

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { description: '', quantity: 1, unitPrice: 0 }],
        });
    };

    const handleRemoveItem = (index: number) => {
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== index),
        });
    };

    const handleItemChange = (index: number, field: string, value: string | number) => {
        const newItems = [...formData.items];
        const currentItem = newItems[index];
        if (!currentItem) return;
        // Safe update ensuring strict typing
        newItems[index] = {
            description: currentItem?.description,
            quantity: currentItem?.quantity,
            unitPrice: currentItem?.unitPrice,
            [field]: value
        } as CreateBillingRequest['items'][number];
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createBilling(formData, {
            onSuccess: () => {
                onClose();
                // Reset form
                setFormData({
                    patientId: '',
                    items: [{ description: '', quantity: 1, unitPrice: 0 }],
                    status: 'PENDING',
                    tax: 0,
                    discount: 0,
                });
            },
        });
    };

    const calculateSubtotal = () => {
        return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    };

    const subtotal = calculateSubtotal();
    const total = subtotal + (formData.tax || 0) - (formData.discount || 0);

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit} className="p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Create New Invoice</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Patient ID</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={formData.patientId}
                                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                    placeholder="Enter Patient ID (e.g., 1)"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-gray-700">Items</label>
                                    <button
                                        type="button"
                                        onClick={handleAddItem}
                                        className="text-sm text-indigo-600 hover:text-indigo-500"
                                    >
                                        + Add Item
                                    </button>
                                </div>
                                {formData.items.map((item, index) => (
                                    <div key={index} className="flex gap-2 items-start bg-gray-50 p-3 rounded-md">
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="text"
                                                placeholder="Description"
                                                className="block w-full border-gray-300 rounded-md text-sm"
                                                value={item.description}
                                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                required
                                            />
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    placeholder="Qty"
                                                    className="block w-20 border-gray-300 rounded-md text-sm"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                                    min="1"
                                                    required
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Price"
                                                    className="block w-24 border-gray-300 rounded-md text-sm"
                                                    value={item.unitPrice}
                                                    onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                />
                                                <div className="flex items-center text-sm text-gray-500">
                                                    ${(item.quantity * item.unitPrice).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                        {formData.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                &times;
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tax</label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
                                        value={formData.tax}
                                        onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) })}
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Discount</label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
                                        value={formData.discount}
                                        onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <span className="font-medium text-gray-900">Total Amount:</span>
                                <span className="text-xl font-bold text-indigo-600">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {isPending ? 'Creating...' : 'Create Invoice'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
