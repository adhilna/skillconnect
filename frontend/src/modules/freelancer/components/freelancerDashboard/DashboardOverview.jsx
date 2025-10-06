import React from 'react';
import { DollarSign, ShoppingCart, Briefcase, Star, TrendingUp, Plus, MessageCircle, BarChart3 } from 'lucide-react';
import StatCard from './StatCard';
import ProjectItem from './messagesSection/ProjectItem';

const DashboardOverview = (props) => {
  const { profileData, analytics, loadingPayments, loadingActive, activeProjects } = props;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const latestProjects = Array.isArray(activeProjects)
    ? [...activeProjects]
      .sort((a, b) => b.id - a.id) // higher ID = newer
      .slice(0, 3)
    : [];

  const getDeadlineText = (deadline) => {
    if (!deadline) return "No deadline";

    const deadlineDate = new Date(deadline);
    const today = new Date();

    // Calculate days difference
    const msInDay = 1000 * 60 * 60 * 24;
    const daysDiff = Math.floor(
      (deadlineDate - today) / msInDay
    );

    if (daysDiff >= 0) {
      return `${daysDiff} day${daysDiff !== 1 ? "s" : ""} left`;
    } else {
      return (
        <span className="text-red-500">
          {Math.abs(daysDiff)} day{Math.abs(daysDiff) !== 1 ? "s" : ""} exceeded
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Here&apos;s your dashboard {profileData?.first_name} 🌟</h3>
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
        <StatCard
          title="Total Earnings"
          value={
            loadingPayments ? (
              <span className="inline-block w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin mx-auto"></span>
            ) : (
              `${formatCurrency(analytics.totalAmount)}`
            )
          }
          icon={DollarSign}
          change="+12%"
          trend="up"
          subtitle="This month"
        />
        <StatCard
          title="Active Orders"
          value={
            loadingActive ? (
              <span className="inline-block w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin mx-auto"></span>
            ) : (
              `${analytics.inProgressCount}`
            )
          }
          icon={ShoppingCart}
          change="+3"
          trend="up"
          subtitle="In progress"
        />
        <StatCard
          title="Total Projects"
          value={
            loadingActive ? (
              <span className="inline-block w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin mx-auto"></span>
            ) : (
              `${analytics.totalProjects}`
            )
          }
          icon={Briefcase}
          change="2 new"
          trend="up"
          subtitle="Published"
        />
        <StatCard
          title="Rating"
          value="4.9"
          icon={Star}
          change="+0.1"
          trend="up"
          subtitle="Average score"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Active Projects</h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {latestProjects.map((project) => (
              <ProjectItem
                key={project.id}
                title={project.category || "Untitled Category"}
                freelancer={project.freelancer || "Unknown Freelancer"}
                status={project.status}
                budget={`₹${project.amount?.toLocaleString("en-IN") || 0}`}
                deadline={getDeadlineText(project.deadline)}
                progress={project.progress || 0}
              />
            ))}
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
