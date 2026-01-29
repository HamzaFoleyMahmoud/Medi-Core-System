import React from 'react';
import type { Billing } from '@/types/entities';
import { format } from 'date-fns';

interface BillingListProps {
    billings: Billing[];
    isLoading: boolean;
    onView: (billing: Billing) => void;
}

export const BillingList: React.FC<BillingListProps> = ({ billings, isLoading, onView }) => {
    if (isLoading) {
        return <div className="p-4 text-center text-gray-500">Loading invoices...</div>;
    }

    if (billings.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                No invoices found
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patient ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {billings.map((billing) => (
                        <tr key={billing.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #{billing.id.slice(0, 8)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {billing.patientId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {format(new Date(billing.createdAt), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${billing.status === 'PAID' ? 'bg-green-100 text-green-800' : ''}
                                    ${billing.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                                    ${billing.status === 'PARTIALLY_PAID' ? 'bg-blue-100 text-blue-800' : ''}
                                    ${['CANCELLED', 'REFUNDED'].includes(billing.status) ? 'bg-gray-100 text-gray-800' : ''}
                                `}>
                                    {billing.status.replace('_', ' ')}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                                ${billing.total.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onView(billing)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
