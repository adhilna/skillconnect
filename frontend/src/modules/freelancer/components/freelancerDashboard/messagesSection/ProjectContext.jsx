import React from 'react';
import { Calendar } from 'lucide-react';

const ProjectContext = ({ project, budget, deadline, status }) => (
    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-3 m-4 mb-2">
        <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium text-sm">{project}</h4>
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'In Progress'
                    ? 'bg-blue-500/20 text-blue-300'
                    : status === 'Review'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-green-500/20 text-green-300'
                    }`}
            >
                {status}
            </span>
        </div>
        <div className="flex items-center justify-between text-xs">
            <span className="text-green-400 font-medium">{budget}</span>
            <div className="flex items-center text-gray-400">
                <Calendar size={15} className="mr-1" />
                {deadline ? new Date(deadline).toLocaleDateString() : 'N/A'}
            </div>
        </div>
    </div>
);

export default ProjectContext;