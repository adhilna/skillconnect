import React from 'react';
import { Briefcase, DollarSign, Calendar, CheckCircle } from 'lucide-react';

const ProjectItem = ({ title, freelancer, status, budget, deadline, progress }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'planning':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'advance':
                return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'draft':
                return 'bg-gray-500/20 text-gray-400 border-white-500/30';
            case 'submitted':
                return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
            case 'in-progress':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'milestone-1':
                return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'revision':
                return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
            case 'final-review':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default: return 'bg-white/10 text-white/70 border-white/20';
        }
    };

    return (
        <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">{title}</h4>
                    <p className="text-white/60 text-sm">by {freelancer}</p>
                </div>
                <div className="text-right">
                    <p className="text-white font-medium">{budget}</p>
                    <p className="text-white/60 text-xs">{deadline}</p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                    <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                    <span className="capitalize">{status.replace('-', ' ')}</span>
                </span>
            </div>
        </div>
    );
};

export default ProjectItem;