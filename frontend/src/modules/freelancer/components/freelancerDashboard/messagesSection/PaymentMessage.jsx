import React from 'react';
import { DollarSign } from 'lucide-react';

const PaymentMessage = ({ amount, description, status }) => {
  // Helper: Determine status text and styles
  const statusStyles = {
    pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', label: 'Pending', pulse: 'animate-pulse' },
    completed: { bg: 'bg-green-500/20', text: 'text-green-300', label: 'Completed', pulse: '' },
    failed: { bg: 'bg-red-500/20', text: 'text-red-300', label: 'Failed', pulse: '' },
    rejected: { bg: 'bg-red-500/20', text: 'text-red-300', label: 'Rejected', pulse: '' },
  };

  const currentStatus = statusStyles[status] || statusStyles.pending;

  // Message displayed below amount & status badge
  const statusMessage = {
    pending: 'Payment request sent, awaiting client action.',
    completed: 'Payment has been completed successfully.',
    failed: 'Payment failed. Please try again.',
    rejected: 'Payment request rejected by client.',
  };

  return (
    <div className="relative bg-white/3 backdrop-blur-xl border border-white/20 rounded-2xl p-5 max-w-xs shadow-2xl hover:shadow-white/10 transition-all duration-300 hover:scale-[1.02] group overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:rounded-2xl">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

      {/* Subtle top border accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400/60 to-transparent"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg backdrop-blur-sm">
              <DollarSign size={18} className="text-green-400 drop-shadow-sm" />
            </div>
            <span className="text-white font-bold text-lg tracking-wide drop-shadow-sm">
              ${amount}
            </span>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${currentStatus.bg} ${currentStatus.text} ${currentStatus.pulse} border border-current/20 backdrop-blur-sm shadow-lg`}>
            {currentStatus.label}
          </span>
        </div>

        <p className="text-white/90 text-sm mb-4 leading-relaxed font-medium">
          {description}
        </p>

        <div className="flex items-start space-x-2">
          <div className="w-1 h-4 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full mt-0.5 flex-shrink-0"></div>
          <div className="text-white/80 text-xs leading-relaxed font-medium">
            {statusMessage[status]}
          </div>
        </div>
      </div>

      {/* Subtle glass corner decoration */}
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/5 rounded-tl-full opacity-50"></div>
    </div>
  );
};

export default PaymentMessage;