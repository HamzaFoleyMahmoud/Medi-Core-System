import React, { useState } from 'react';
import { useBillings } from '../hooks/useBilling';
import { BillingList } from '../components/BillingList';
import { CreateBillingModal } from '../components/CreateBillingModal';
import type { Billing } from '@/types/entities';

export const BillingPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, isLoading } = useBillings({ page, pageSize: 10 });

    const handleViewBilling = (billing: Billing) => {
        // TODO: Implement detail view logic
        console.log('View billing', billing);
        alert(`Details for Invoice #${billing.id}\nTotal: $${billing.total}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Create Invoice
                </button>
            </div>

            <CreateBillingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">$12,450.00</p>
                    <span className="text-sm text-green-600">+12% from last month</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">$3,200.00</p>
                    <span className="text-sm text-yellow-600">8 invoices pending</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">$850.00</p>
                    <span className="text-sm text-red-600">2 invoices overdue</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
                </div>

                <BillingList
                    billings={data?.data || []}
                    isLoading={isLoading}
                    onView={handleViewBilling}
                />

                {/* Pagination */}
                {data?.pagination && (
                    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                            Showing page {data.pagination.page} of {data.pagination.totalPages}
                        </div>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                disabled={page === data.pagination.totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
