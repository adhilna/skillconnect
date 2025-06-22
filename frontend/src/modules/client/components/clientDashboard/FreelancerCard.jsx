import React from 'react';
import { Star } from 'lucide-react';

const FreelancerCard = ({ name, title, rating, rate, skills, avatar }) => (
    <div className="bg-white/5 rounded-lg border border-white/10 p-4 hover:bg-white/10 transition-colors">
        <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{avatar}</span>
            </div>
            <div className="flex-1">
                <h4 className="font-medium text-white">{name}</h4>
                <p className="text-white/60 text-sm">{title}</p>
            </div>
            <div className="text-right">
                <div className="flex items-center space-x-1">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-white text-sm">{rating}</span>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between mb-3">
            <span className="text-white font-medium">{rate}</span>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                Contact
            </button>
        </div>

        <div className="flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="bg-white/10 text-white/70 px-2 py-1 rounded text-xs">
                    {skill}
                </span>
            ))}
        </div>
    </div>
);

export default FreelancerCard;