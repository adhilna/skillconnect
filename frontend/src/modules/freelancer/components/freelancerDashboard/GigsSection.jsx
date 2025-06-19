import React from 'react';
import { Briefcase, Plus } from 'lucide-react';

const GigsSection = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold text-white">My Gigs</h3>
      <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2">
        <Plus size={18} />
        <span>Create New Gig</span>
      </button>
    </div>
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
      <Briefcase size={48} className="text-white/30 mx-auto mb-4" />
      <h4 className="text-xl font-semibold text-white mb-2">Gigs Management</h4>
      <p className="text-white/70 mb-6">Create, edit, and manage your service offerings</p>
      <div className="text-white/50 text-sm">Coming soon</div>
    </div>
  </div>
);

export default GigsSection;
