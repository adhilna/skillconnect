import React from 'react';
import { Users, Heart } from 'lucide-react';

const FreelancersSection = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">My Freelancers</h3>
            <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center space-x-2">
                <Heart size={16} />
                <span>Favorites</span>
            </button>
        </div>
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
            <Users size={48} className="text-white/30 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Your Freelancer Network</h4>
            <p className="text-white/70 mb-6">Manage your trusted freelancers and build long-term relationships</p>
            <div className="text-white/50 text-sm">Freelancer relationship management coming soon...</div>
        </div>
    </div>
);

export default FreelancersSection;