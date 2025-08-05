import React from 'react';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  DollarSign,
  MessageSquare,
  MessageCircle,
  XCircle,
} from 'lucide-react';

const getStatusConfig = (status) => {
  switch (status) {
    case 'pending':
      return {
        bg: 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10',
        border: 'border-amber-400/30',
        text: 'text-amber-400',
        icon: Clock,
        badge: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      };
    case 'accepted':
      return {
        bg: 'bg-gradient-to-r from-emerald-500/10 to-green-500/10',
        border: 'border-emerald-400/30',
        text: 'text-emerald-400',
        icon: CheckCircle,
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      };
    case 'cancelled':
      return {
        bg: 'bg-gradient-to-r from-yellow-600/10 to-yellow-500/10',
        border: 'border-yellow-400/30',
        text: 'text-yellow-400',
        icon: XCircle,
        badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40',
      };
    case 'rejected':
      return {
        bg: 'bg-gradient-to-r from-red-500/10 to-rose-500/10',
        border: 'border-red-400/30',
        text: 'text-red-400',
        icon: AlertCircle,
        badge: 'bg-red-500/20 text-red-300 border-red-400/40',
      };
    default:
      return {
        bg: 'bg-gradient-to-r from-slate-500/10 to-gray-500/10',
        border: 'border-slate-400/30',
        text: 'text-slate-400',
        icon: AlertCircle,
        badge: 'bg-slate-500/20 text-slate-300 border-slate-400/40',
      };
  }
};

const OrderItem = ({
  title,
  client,
  status,
  amount,
  deadline,
  message,
  createdAt,
  onAccept,
  onReject,
  onCancel,
  orderType,
  orderId,
  onMessageClick,
}) => {
  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleMessage = () => {
    if (onMessageClick && orderType && orderId) {
      onMessageClick(orderType, orderId);
    } else {
      alert('Cannot open chat: missing required info.');
    }
  };

  return (
    <div
      className={`
      relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-200 hover:scale-[1.01]
      ${statusConfig.bg} ${statusConfig.border}
    `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />

      <div className="relative p-4">
        {/* Compact Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-white font-semibold text-lg leading-tight mb-1 truncate">
              {title}
            </h3>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-slate-300">
                <User size={14} className="mr-1.5 text-slate-400" />
                <span>{client}</span>
              </div>
              <div className="flex items-center text-slate-400">
                <Calendar size={12} className="mr-1" />
                <span>{formatDate(createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border shrink-0
            ${statusConfig.badge}
          `}
          >
            <StatusIcon size={12} className="mr-1" />
            <span className="capitalize">{status}</span>
          </span>
        </div>

        {/* Amount and Deadline */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <DollarSign size={16} className="text-emerald-400 mr-1" />
            <span className="text-emerald-400 font-bold">{amount}</span>
          </div>
          <div className="text-slate-300 text-sm">
            <span className="text-slate-400">Delivery: </span>
            <span className="font-medium">{deadline}</span>
          </div>
        </div>

        {/* Message Preview */}
        {message && (
          <div className="mb-3 p-3 bg-slate-800/40 rounded-lg border border-slate-600/20">
            <div className="flex items-center mb-1">
              <MessageSquare size={14} className="mr-2 text-blue-400" />
              <span className="text-slate-300 text-sm font-medium">Client Message</span>
            </div>
            <p className="text-slate-200 text-sm line-clamp-2 leading-relaxed">{message}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {status === 'pending' && (onAccept || onReject) && (
            <>
              {onAccept && (
                <button
                  onClick={onAccept}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center text-sm"
                >
                  <CheckCircle size={16} className="mr-1.5" />
                  Accept
                </button>
              )}
              {onReject && (
                <button
                  onClick={onReject}
                  className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center text-sm"
                >
                  <AlertCircle size={16} className="mr-1.5" />
                  Reject
                </button>
              )}
            </>
          )}

          {status === 'accepted' && (
            <>
              <button
                onClick={handleMessage}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center text-sm"
              >
                <MessageCircle size={16} className="mr-1.5" />
                Message Client
              </button>
              {/* Cancel button */}
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center text-sm"
                >
                  <XCircle size={16} className="mr-1.5" />
                  Cancel
                </button>
              )}
            </>
          )}
        </div>

        {/* Status Messages - Compact */}
        {status === 'accepted' && (
          <div className="mt-3 p-2 bg-emerald-500/10 border border-emerald-400/20 rounded-lg">
            <div className="flex items-center">
              <CheckCircle size={16} className="text-emerald-400 mr-2" />
              <div>
                <p className="text-emerald-300 font-medium text-sm">Order Accepted</p>
                <p className="text-emerald-400/80 text-xs">Start working on this project!</p>
              </div>
            </div>
          </div>
        )}

        {status === 'cancelled' && (
          <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
            <div className="flex items-center">
              <XCircle size={16} className="text-yellow-400 mr-2" />
              <div>
                <p className="text-yellow-300 font-medium text-sm">Order Cancelled</p>
                <p className="text-yellow-400/80 text-xs">This order has been cancelled.</p>
              </div>
            </div>
          </div>
        )}

        {status === 'rejected' && (
          <div className="mt-3 p-2 bg-red-500/10 border border-red-400/20 rounded-lg">
            <div className="flex items-center">
              <AlertCircle size={16} className="text-red-400 mr-2" />
              <div>
                <p className="text-red-300 font-medium text-sm">Order Rejected</p>
                <p className="text-red-400/80 text-xs">This order has been declined.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderItem;
