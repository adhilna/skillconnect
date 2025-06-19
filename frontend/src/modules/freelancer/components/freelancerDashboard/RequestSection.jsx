import React from 'react';
import { Search, Filter } from 'lucide-react';
import RequestItem from './RequestItem';

const RequestSection = ({ requests }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold text-white">Buyer Requests</h3>
      <div className="flex items-center space-x-2">
        <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center space-x-2">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>
    </div>
    {requests && requests.length > 0 ? (
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 space-y-4">
        {requests.map((req, index) => (
          <RequestItem
            key={index}
            title={req.title}
            client={req.client}
            status={req.status}
          />
        ))}
      </div>
    ) : (
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
        <Search size={48} className="text-white/30 mx-auto mb-4" />
        <h4 className="text-xl font-semibold text-white mb-2">Request Management</h4>
        <p className="text-white/70 mb-6">Discover and respond to new buyer requests</p>
        <div className="text-white/50 text-sm">No requests found. Enhanced request features coming soon...</div>
      </div>
    )}
  </div>
);

export default RequestSection;
