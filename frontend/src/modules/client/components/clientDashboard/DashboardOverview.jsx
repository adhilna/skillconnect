import React from 'react';
import { DollarSign, Users, Briefcase, Star, CheckCircle, FileText, Search, Plus, MessageCircle, BarChart3 } from 'lucide-react';
import StatCard from './StatCard';
import ProjectItem from './ProjectItem';
import ActivityItem from './ActivityItem';
import FreelancerCard from './FreelancerCard';

const DashboardOverview = () => {
    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl border border-blue-500/30 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Welcome back, TechCorp! 🚀</h3>
                        <p className="text-white/80">You have 3 active projects and 5 new freelancer proposals to review.</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="text-right">
                            <p className="text-white/60 text-sm">Success Rate</p>
                            <p className="text-2xl font-bold text-white">94%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Spent"
                    value="$12,450"
                    icon={DollarSign}
                    change="+8%"
                    trend="up"
                    subtitle="This month"
                />
                <StatCard
                    title="Active Projects"
                    value="6"
                    icon={Briefcase}
                    change="+2"
                    trend="up"
                    subtitle="In progress"
                />
                <StatCard
                    title="Hired Freelancers"
                    value="23"
                    icon={Users}
                    change="+5 new"
                    trend="up"
                    subtitle="Total team"
                />
                <StatCard
                    title="Avg. Rating Given"
                    value="4.8"
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
                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All</button>
                    </div>
                    <div className="space-y-4">
                        <ProjectItem
                            title="E-commerce Website Development"
                            freelancer="Alex Rodriguez"
                            status="in-progress"
                            budget="$2,500"
                            deadline="8 days left"
                            progress={65}
                        />
                        <ProjectItem
                            title="Mobile App UI/UX Design"
                            freelancer="Sarah Kim"
                            status="review"
                            budget="$1,200"
                            deadline="3 days left"
                            progress={90}
                        />
                        <ProjectItem
                            title="Content Marketing Strategy"
                            freelancer="Mike Johnson"
                            status="planning"
                            budget="$800"
                            deadline="12 days left"
                            progress={25}
                        />
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Recent Activity */}
                    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            <ActivityItem
                                icon={MessageCircle}
                                text="New message from Alex Rodriguez"
                                time="2 min ago"
                            />
                            <ActivityItem
                                icon={CheckCircle}
                                text="Logo design project completed"
                                time="1 hour ago"
                            />
                            <ActivityItem
                                icon={Users}
                                text="Sarah Kim accepted your project"
                                time="3 hours ago"
                            />
                            <ActivityItem
                                icon={FileText}
                                text="New proposal received"
                                time="5 hours ago"
                            />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium text-left flex items-center space-x-2">
                                <Plus size={16} />
                                <span>Post New Project</span>
                            </button>
                            <button className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium text-left flex items-center space-x-2">
                                <Search size={16} />
                                <span>Browse Freelancers</span>
                            </button>
                            <button className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium text-left flex items-center space-x-2">
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
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FreelancerCard
                        name="Emma Watson"
                        title="Full-Stack Developer"
                        rating="4.9"
                        rate="$45/hr"
                        skills={['React', 'Node.js', 'Python']}
                        avatar="EW"
                    />
                    <FreelancerCard
                        name="James Chen"
                        title="UI/UX Designer"
                        rating="4.8"
                        rate="$35/hr"
                        skills={['Figma', 'Adobe XD', 'Sketch']}
                        avatar="JC"
                    />
                    <FreelancerCard
                        name="Maria Garcia"
                        title="Digital Marketing Expert"
                        rating="5.0"
                        rate="$40/hr"
                        skills={['SEO', 'Google Ads', 'Analytics']}
                        avatar="MG"
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;