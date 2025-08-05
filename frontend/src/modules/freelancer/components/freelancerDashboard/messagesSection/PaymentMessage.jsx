import React from 'react';
import { DollarSign } from 'lucide-react';

const PaymentMessage = ({ amount, description, status, isRequest, onPayment }) => (
    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 max-w-xs">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
                <DollarSign size={16} className="text-green-400" />
                <span className="text-white font-medium">${amount}</span>
            </div>
            <span
                className={`px-2 py-1 rounded-full text-xs ${status === 'completed'
                        ? 'bg-green-500/20 text-green-300'
                        : status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-red-500/20 text-red-300'
                    }`}
            >
                {status}
            </span>
        </div>
        <p className="text-white/80 text-sm mb-3">{description}</p>
        {isRequest && status === 'pending' && (
            <button
                onClick={onPayment}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
            >
                Pay Now
            </button>
        )}
    </div>
);

export default PaymentMessage;
