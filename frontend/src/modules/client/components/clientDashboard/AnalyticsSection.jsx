import React from 'react';
import { BarChart3 } from 'lucide-react';

const AnalyticsSection = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white">Project Analytics</h3>
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
            <BarChart3 size={48} className="text-white/30 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Project Insights</h4>
            <p className="text-white/70 mb-6">Track project performance, spending, and team productivity</p>
            <div className="text-white/50 text-sm">Advanced analytics dashboard in development...</div>
        </div>
    </div>
);

export default AnalyticsSection;