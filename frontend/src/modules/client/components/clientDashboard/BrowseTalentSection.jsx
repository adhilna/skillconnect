import React from 'react';
import { Search, Filter } from 'lucide-react';

const BrowseTalentSection = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">Browse Talent</h3>
            <div className="flex items-center space-x-2">
                <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center space-x-2">
                    <Filter size={16} />
                    <span>Filters</span>
                </button>
                <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200">
                    Post Project
                </button>
            </div>
        </div>
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
            <Search size={48} className="text-white/30 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Find Perfect Freelancers</h4>
            <p className="text-white/70 mb-6">Browse thousands of talented professionals across all categories</p>
            <div className="text-white/50 text-sm">Advanced search and filtering system coming soon...</div>
        </div>
    </div>
);

export default BrowseTalentSection;