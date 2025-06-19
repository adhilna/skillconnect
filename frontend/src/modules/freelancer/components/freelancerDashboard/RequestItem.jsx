import React from 'react';
const RequestItem = ({ title, client, status }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
      <div className="flex-1">
        <h4 className="font-medium text-white mb-1">{title}</h4>
        <p className="text-white/60 text-sm">From {client}</p>
      </div>
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
        {status}
      </span>
    </div>
  );
};

export default RequestItem;
