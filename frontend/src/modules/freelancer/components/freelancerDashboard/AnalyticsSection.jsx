import React from 'react';
import { BarChart3, Filter, Eye, Percent, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, change, trend, subtitle }) => {
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-white/70';
  return (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border0purple-500/30">
          <Icon size={24} className="text-white" />
        </div>
        <span className={`text-sm font-medium ${trendColor} flex items-center space-x-1`}>
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

const AnalyticsSection = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold text-white">Analytics</h3>
      <div className="flex items-center space-x-2">
        <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center space-x-2">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>
    </div>
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Profile Views"
          value="124"
          icon={Eye}
          change="+8%"
          trend="up"
          subtitle="This week"
        />
        <StatCard
          title="Application Rate"
          value="12%"
          icon={Percent}
          change="-2%"
          trend="down"
          subtitle="This week"
        />
        <StatCard
          title="Avg. Response Time"
          value="4h"
          icon={Clock}
          change="+0.5h"
          trend="down"
          subtitle="This week"
        />
      </div>
    </div>
  </div>
);

export default AnalyticsSection;
