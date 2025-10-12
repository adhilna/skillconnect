import React from 'react';
import { Users, Briefcase, Star, CheckCircle, FileText, Search, Compass, MessageCircle, IndianRupee } from 'lucide-react';
import StatCard from './StatCard';
import ProjectItem from './ProjectItem';
import ActivityItem from './ActivityItem';
import FreelancerCard from './FreelancerCard';
import { useOrders } from "../../../../context/client/OrdersContext"

const DashboardOverview = (props) => {
    const { profileData, featuredFreelancers, loading, setActiveSection, summaryMetrics, loadingPayments, activeProjectsCount, loadingActive, hiredFreelancersCount, activeProjects } = props;

    const { orders, loadingOrders, ordersError } = useOrders();
    const totalOrders = orders?.length || 0;


    // Helper to get initials from a name string
    const getInitials = (name) => {
        if (!name || typeof name !== 'string') return 'NA';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
    };

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

    const latestProjects = Array.isArray(activeProjects)
        ? [...activeProjects]
            .sort((a, b) => b.id - a.id) // higher ID = newer
            .slice(0, 4)
        : [];


    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl border border-blue-500/30 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Here&apos;s your dashboard {profileData?.first_name} 🌟</h3>
                        <p className="text-white/80">You have {activeProjectsCount} active projects and {totalOrders} are from your proposals.</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="text-right">
                            <p className="text-white/60 text-sm">Success Rate</p>
                            <p className="text-2xl font-bold text-white">₹{summaryMetrics.successRate.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Spent"
                    value={
                        loadingPayments ? (
                            <span className="inline-block w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin mx-auto"></span>
                        ) : (
                            `${summaryMetrics.totalAmount.toLocaleString()}`
                        )
                    }
                    icon={IndianRupee}
                    change="+8%"
                    trend="up"
                    subtitle="This month"
                />
                <StatCard
                    title="Active Projects"
                    value={
                        loadingActive ? (
                            <span className="inline-block w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin mx-auto"></span>
                        ) : (
                            activeProjectsCount
                        )
                    }
                    icon={Briefcase}
                    change="+2"
                    trend="up"
                    subtitle="In progress"
                />
                <StatCard
                    title="Hired Freelancers"
                    value={hiredFreelancersCount ?? 0}
                    icon={Users}
                    change={`+${hiredFreelancersCount}`}
                    trend="up"
                    subtitle="Total team"
                />
                <StatCard
                    title="Avg. Rating Given"
                    value={
                        loadingPayments ? (
                            <span className="inline-block w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin mx-auto"></span>
                        ) : (
                            `${summaryMetrics.avgRatingGiven}`
                        )
                    }
                    icon={Star}
                    change="+0.2"
                    trend="up"
                    subtitle="Your reviews"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Projects */}
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
                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Recent Activity */}
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
                                                    <span className="font-semibold text-white">
                                                        {order.freelancer?.name || "Unknown Freelancer"}
                                                    </span>{" "}
                                                    completed
                                                </span>
                                                <span className="text-xs bg-white/10 px-2 py-1 rounded-md w-fit text-purple-300 mt-1">
                                                    {order.proposal?.title || "Untitled Project"}
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

                    {/* Quick Actions */}
                    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => setActiveSection('explore')}
                                className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium text-left flex items-center space-x-2">
                                <Compass size={16} />
                                <span>Explore Services</span>
                            </button>
                            <button
                                onClick={() => setActiveSection('browse')}
                                className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium text-left flex items-center space-x-2">
                                <Search size={16} />
                                <span>Browse Freelancers</span>
                            </button>
                            <button
                                onClick={() => setActiveSection('messages')}
                                className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium text-left flex items-center space-x-2">
                                <MessageCircle size={16} />
                                <span>Check Messages</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Freelancers */}
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Recommended Freelancers</h3>
                    <button
                        onClick={() => setActiveSection('browse')}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                        View All
                    </button>
                </div>

                {loading ? (
                    <div className="w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin mx-auto"></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredFreelancers.map((freelancer) => (
                            <FreelancerCard
                                key={freelancer.id}
                                name={freelancer.name}
                                title={freelancer.title}
                                rating={freelancer.rating ?? 'N/A'}
                                rate={`$${freelancer.hourly_rate || 0}/hr`}
                                skills={freelancer.skills?.map((s) => s.name) || []}
                                avatar={freelancer.profile_picture ?? getInitials(freelancer.name)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardOverview;