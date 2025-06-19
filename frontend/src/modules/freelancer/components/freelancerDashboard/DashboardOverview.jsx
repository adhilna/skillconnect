import React from 'react';
import { DollarSign, ShoppingCart, Briefcase, Star, TrendingUp, Plus, MessageCircle, BarChart3 } from 'lucide-react';
import StatCard from './StatCard';
import OrderItem from './OrderItem';

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Good Morning, John! 🌟</h3>
            <p className="text-white/80">You have 3 pending orders and 2 new messages waiting for you.</p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-white/60 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-white">98%</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Earnings" value="$2,847" icon={DollarSign} change="+12%" trend="up" subtitle="This month" />
        <StatCard title="Active Orders" value="8" icon={ShoppingCart} change="+3" trend="up" subtitle="In progress" />
        <StatCard title="Total Gigs" value="12" icon={Briefcase} change="2 new" trend="up" subtitle="Published" />
        <StatCard title="Rating" value="4.9" icon={Star} change="+0.1" trend="up" subtitle="Average score" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Orders</h3>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            <OrderItem title="Logo Design for Tech Startup" client="Sarah Wilson" status="in-progress" amount="$150" deadline="2 days left" />
            <OrderItem title="Website Redesign" client="Mike Johnson" status="review" amount="$450" deadline="5 days left" />
            <OrderItem title="Mobile App UI/UX" client="Anna Chen" status="completed" amount="$320" deadline="Delivered" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">This Week</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Orders Completed</span>
                <span className="text-white font-medium">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Revenue</span>
                <span className="text-white font-medium">$890</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Profile Views</span>
                <span className="text-white font-medium">124</span>
              </div>
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium text-left flex items-center space-x-2">
                <Plus size={16} />
                <span>Create New Gig</span>
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium text-left flex items-center space-x-2">
                <MessageCircle size={16} />
                <span>Message Clients</span>
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium text-left flex items-center space-x-2">
                <BarChart3 size={16} />
                <span>View Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
