import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, change, trend, subtitle }) => {
    const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-white/70';

    return (
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30">
                    <Icon size={24} className="text-white" />
                </div>
                <span className={`text-sm font-medium ${trendColor} flex items-center space-x-1`}>
                    {trend === 'up' && <TrendingUp size={14} />}
                    <span>{change}</span>
                </span>
            </div>
            <div>
                <p className="text-3xl font-bold text-white mb-1">{value}</p>
                <p className="text-white/70 text-sm font-medium">{title}</p>
                {subtitle && <p className="text-white/50 text-xs mt-1">{subtitle}</p>}
            </div>
        </div>
    );
};

export default StatCard;