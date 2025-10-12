import React from 'react';
import { DollarSign, ShoppingCart, Briefcase, Star, Search, MessageCircle, Compass, CheckCircle } from 'lucide-react';
import StatCard from './StatCard';
import ActivityItem from './ActivityItem';
import ProjectItem from './messagesSection/ProjectItem';
import { useOrders } from "../../../../context/freelancer/OrdersContext"

const DashboardOverview = (props) => {
  const { profileData, analytics, loadingPayments, loadingActive, activeProjects, setActiveSection, activeProjectsCount } = props;

  const { orders, loadingOrders, ordersError } = useOrders();
  const totalOrders = orders?.length || 0;

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
      .slice(0, 4)
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
            <p className="text-white/80">You have {activeProjectsCount} active projects and {totalOrders} are from your Services.</p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-white/60 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-white">₹{analytics.successRate.toLocaleString()}</p>
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
          value={
            loadingPayments ? (
              <span className="inline-block w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin mx-auto"></span>
            ) : (
              `${analytics.avgRatingGiven}`
            )
          }
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
            {latestProjects.length > 0 && (
              <button
                onClick={() => setActiveSection('analytics')}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All</button>
            )}
          </div>
          <div className="space-y-4">
            {latestProjects.length > 0 ? (
              latestProjects.map((project) => (
                <ProjectItem
                  key={project.id}
                  title={project.category || "Untitled Category"}
                  freelancer={project.freelancer || "Unknown Freelancer"}
                  status={project.status}
                  budget={`₹${project.amount?.toLocaleString("en-IN") || 0}`}
                  deadline={getDeadlineText(project.deadline)}
                  progress={project.progress || 0}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No active projects yet</p>
                <p className="text-gray-500 text-sm mt-2">Your projects will appear here once you get started</p>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>

            {loadingOrders && <p className="text-white">Loading...</p>}
            {ordersError && <p className="text-red-500">{ordersError}</p>}

            <div className="space-y-4">
              {!loadingOrders && !ordersError && orders.length > 0 ? (
                orders.slice(0, 4).map((order) => (
                  <ActivityItem
                    key={order.id}
                    icon={CheckCircle}
                    text={
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-300">
                          <span className="font-semibold text-white">{order.client?.name}</span> completed
                        </span>
                        <span className="text-xs bg-white/10 px-2 py-1 rounded-md w-fit text-purple-300 mt-1">
                          {order.service?.title || "Untitled Project"}
                        </span>
                      </div>
                    }
                    time={new Date(order.created_at).toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      month: "short",
                      day: "numeric",
                    })}
                  />
                ))
              ) : (
                !loadingOrders && !ordersError && (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-base">No recent orders</p>
                    <p className="text-gray-500 text-sm mt-2">Your order history will appear here</p>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setActiveSection('browse')}
                className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium text-left flex items-center space-x-2">
                <Search size={16} />
                <span>Browse Clients</span>
              </button>
              <button
                onClick={() => setActiveSection('messages')}
                className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium text-left flex items-center space-x-2">
                <MessageCircle size={16} />
                <span>Message Clients</span>
              </button>
              <button
                onClick={() => setActiveSection('explore')}
                className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium text-left flex items-center space-x-2">
                <Compass size={16} />
                <span>Explore Proposals</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
