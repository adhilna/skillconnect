import React from 'react';
import { Briefcase, Plus } from 'lucide-react';

const ProjectsSection = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">My Projects</h3>
            <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2">
                <Plus size={18} />
                <span>New Project</span>
            </button>
        </div>
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
            <Briefcase size={48} className="text-white/30 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Project Management</h4>
            <p className="text-white/70 mb-6">Track progress, manage milestones, and communicate with your team</p>
            <div className="text-white/50 text-sm">Comprehensive project management tools in development...</div>
        </div>
    </div>
);

export default ProjectsSection;
