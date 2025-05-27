import React from 'react';
import { Briefcase, Globe, Star, CheckCircle, Users } from 'lucide-react';

const getCategoryIcon = (category) => {
    const iconMap = {
        'Design': <Briefcase size={32} />,
        'Development': <Globe size={32} />,
        'Marketing': <Star size={32} />,
        'Writing': <CheckCircle size={32} />,
        'Video': <Users size={32} />,
        'Music': <Briefcase size={32} />,
        'Business': <Globe size={32} />
    };
    return iconMap[category] || <Briefcase size={32} />;
};

export const CategoryCard = ({ category, isSelected, onClick }) => (
    <div
        onClick={() => onClick(category)}
        className={`bg-white/10 backdrop-blur-md rounded-xl p-6 text-center hover:bg-white/20 transition-all transform hover:scale-105 cursor-pointer ${isSelected ? 'bg-purple-500/50 ring-2 ring-purple-400' : ''
            }`}
    >
        <div className="mx-auto mb-4">{getCategoryIcon(category)}</div>
        <h3 className="font-medium">{category}</h3>
    </div>
);