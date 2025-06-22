import React from 'react';
import { CreditCard } from 'lucide-react';

const InvoicesSection = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">Invoices & Payments</h3>
            <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors">
                Payment Methods
            </button>
        </div>
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
            <CreditCard size={48} className="text-white/30 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Financial Management</h4>
            <p className="text-white/70 mb-6">Track expenses, manage invoices, and handle secure payments</p>
            <div className="text-white/50 text-sm">Comprehensive billing system in development...</div>
        </div>
    </div>
);

export default InvoicesSection;