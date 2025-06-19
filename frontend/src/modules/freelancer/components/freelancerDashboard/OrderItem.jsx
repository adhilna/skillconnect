import React from 'react';
import { CheckCircle, Clock, Eye, AlertCircle } from 'lucide-react';

const OrderItem = ({ title, client, status, amount, deadline }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={14} />;
      case 'in-progress': return <Clock size={14} />;
      case 'review': return <Eye size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
      <div className="flex-1">
        <h4 className="font-medium text-white mb-1">{title}</h4>
        <p className="text-white/60 text-sm">{client}</p>
      </div>
      <div className="flex items-center space-x-4">
        <div>
          <p className="text-white font-medium text-right">{amount}</p>
          <p className="text-white/60 text-xs text-right">{deadline}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(status)}`}>
          {getStatusIcon(status)}
          <span className="capitalize">{status.replace('-', ' ')}</span>
        </span>
      </div>
    </div>
  );
};

export default OrderItem;
