import React from 'react';
import { Activity } from 'lucide-react';

const ActivityItem = ({ icon: Icon, text, time }) => (
    <div className="flex items-center space-x-3">
        <div className="p-2 bg-white/10 rounded-lg">
            <Icon size={16} className="text-white/70" />
        </div>
        <div className="flex-1">
            <p className="text-white text-sm">{text}</p>
            <p className="text-white/50 text-xs">{time}</p>
        </div>
    </div>
);

export default ActivityItem;