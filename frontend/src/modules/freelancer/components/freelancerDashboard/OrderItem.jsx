import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, User, Calendar, DollarSign, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

const getStatusConfig = (status) => {
  switch (status) {
    case 'pending': 
      return {
        bg: 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10',
        border: 'border-amber-400/30',
        text: 'text-amber-400',
        icon: Clock,
        badge: 'bg-amber-500/20 text-amber-300 border-amber-400/40'
      };
    case 'accepted': 
      return {
        bg: 'bg-gradient-to-r from-emerald-500/10 to-green-500/10',
        border: 'border-emerald-400/30',
        text: 'text-emerald-400',
        icon: CheckCircle,
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
      };
    case 'rejected': 
      return {
        bg: 'bg-gradient-to-r from-red-500/10 to-rose-500/10',
        border: 'border-red-400/30',
        text: 'text-red-400',
        icon: AlertCircle,
        badge: 'bg-red-500/20 text-red-300 border-red-400/40'
      };
    default: 
      return {
        bg: 'bg-gradient-to-r from-slate-500/10 to-gray-500/10',
        border: 'border-slate-400/30',
        text: 'text-slate-400',
        icon: AlertCircle,
        badge: 'bg-slate-500/20 text-slate-300 border-slate-400/40'
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
  onReject
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`
      relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
      ${statusConfig.bg} ${statusConfig.border}
      transform hover:-translate-y-1
    `}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className="relative p-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
          {/* Left Section - Order Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white font-bold text-xl leading-tight pr-4 break-words">
                {title}
              </h3>
              {/* Status Badge */}
              <span className={`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border shrink-0
                ${statusConfig.badge}
              `}>
                <StatusIcon size={14} className="mr-1.5" />
                <span className="capitalize">{status}</span>
              </span>
            </div>
            
            {/* Client Info */}
            <div className="flex items-center text-slate-300 mb-2">
              <User size={16} className="mr-2 text-slate-400" />
              <span className="font-medium">{client}</span>
            </div>

            {/* Created Date */}
            <div className="flex items-center text-slate-400 text-sm">
              <Calendar size={14} className="mr-2" />
              <span>Ordered on {formatDate(createdAt)}</span>
            </div>
          </div>

          {/* Right Section - Amount & Deadline */}
          <div className="flex lg:flex-col gap-4 lg:gap-2 lg:items-end">
            <div className="flex items-center">
              <DollarSign size={16} className="text-emerald-400 mr-1" />
              <span className="text-emerald-400 font-bold text-lg">{amount}</span>
            </div>
            <div className="text-slate-300 text-sm lg:text-right">
              <span className="text-slate-400">Delivery: </span>
              <span className="font-medium">{deadline}</span>
            </div>
          </div>
        </div>

        {/* Message Section */}
        {message && (
          <div className="mb-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-slate-300 hover:text-white transition-colors mb-2"
            >
              <MessageSquare size={16} className="mr-2 text-blue-400" />
              <span className="font-medium">Client Message</span>
              {isExpanded ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
            </button>
            
            <div className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-16 opacity-80'}
            `}>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                <p className={`text-slate-200 leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
                  {message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons for Pending Orders */}
        {status === 'pending' && (onAccept || onReject) && (
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            {onAccept && (
              <button
                onClick={onAccept}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
              >
                <CheckCircle size={18} className="mr-2" />
                Accept Order
              </button>
            )}
            {onReject && (
              <button
                onClick={onReject}
                className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
              >
                <AlertCircle size={18} className="mr-2" />
                Reject Order
              </button>
            )}
          </div>
        )}

        {/* Status Messages */}
        {status === 'accepted' && (
          <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-400/20 rounded-xl">
            <div className="flex items-center">
              <CheckCircle size={18} className="text-emerald-400 mr-3" />
              <div>
                <p className="text-emerald-300 font-semibold">Order Accepted</p>
                <p className="text-emerald-400/80 text-sm">You have successfully accepted this order. Start working on it!</p>
              </div>
            </div>
          </div>
        )}

        {status === 'rejected' && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-400/20 rounded-xl">
            <div className="flex items-center">
              <AlertCircle size={18} className="text-red-400 mr-3" />
              <div>
                <p className="text-red-300 font-semibold">Order Rejected</p>
                <p className="text-red-400/80 text-sm">This order has been declined.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderItem;