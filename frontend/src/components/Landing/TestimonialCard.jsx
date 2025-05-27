import React from 'react';
import { Star } from 'lucide-react';

export const TestimonialCard = ({ name, role, text }) => (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all transform hover:scale-105">
        <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="text-yellow-400 fill-current" />
            ))}
        </div>
        <p className="mb-6 text-purple-100">"{text}"</p>
        <div>
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-purple-300">{role}</p>
        </div>
    </div>
);