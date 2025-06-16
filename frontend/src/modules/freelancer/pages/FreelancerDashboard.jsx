import React, { useState } from 'react';
import {
    Home,
    Briefcase,
    ShoppingCart,
    MessageCircle,
    Search,
    BarChart3,
    User,
    Settings,
    Bell,
    Menu,
    X,
    DollarSign,
    Star
} from 'lucide-react';

const FreelancerDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigationItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'gigs', label: 'My Gigs', icon: Briefcase },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'messages', label: 'Messages', icon: MessageCircle },
        { id: 'requests', label: 'Buyer Requests', icon: Search },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const getCurrentSectionContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <DashboardOverview />;
            case 'gigs':
                return <GigsSection />;
            case 'orders':
                return <OrdersSection />;
            case 'messages':
                return <MessagesSection />;
            case 'requests':
                return <RequestsSection />;
            case 'analytics':
                return <AnalyticsSection />;
            case 'profile':
                return <ProfileSection />;
            case 'settings':
                return <SettingsSection />;
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-64 bg-black/20 backdrop-blur-lg border-r border-white/10 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                <div className="p-6">
                    {/* Logo/Brand */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-bold text-white">FreelanceHub</h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-white/70 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveSection(item.id);
                                        setSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeSection === item.id
                                            ? 'bg-white/20 text-white shadow-lg'
                                            : 'text-white/70 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Top Header */}
                <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-white/70 hover:text-white"
                            >
                                <Menu size={24} />
                            </button>
                            <h2 className="text-xl font-semibold text-white capitalize">
                                {activeSection === 'dashboard' ? 'Dashboard Overview' : activeSection.replace(/([A-Z])/g, ' $1')}
                            </h2>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                                <Bell size={20} />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                    <User size={18} className="text-white" />
                                </div>
                                <span className="text-white font-medium">John Doe</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {getCurrentSectionContent()}
                </main>
            </div>
        </div>
    );
};

// Dashboard Overview Component (Phase 2 preview)
const DashboardOverview = () => {
    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Earnings"
                    value="$2,847"
                    icon={DollarSign}
                    change="+12%"
                    trend="up"
                />
                <StatCard
                    title="Active Orders"
                    value="8"
                    icon={ShoppingCart}
                    change="+3"
                    trend="up"
                />
                <StatCard
                    title="Total Gigs"
                    value="12"
                    icon={Briefcase}
                    change="0"
                    trend="neutral"
                />
                <StatCard
                    title="Rating"
                    value="4.9"
                    icon={Star}
                    change="+0.1"
                    trend="up"
                />
            </div>

            {/* Placeholder for more content */}
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                <p className="text-white/70">This section will be expanded in Phase 2...</p>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, change, trend }) => {
    const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-white/70';

    return (
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                    <Icon size={24} className="text-white" />
                </div>
                <span className={`text-sm font-medium ${trendColor}`}>
                    {change !== '0' && (trend === 'up' ? '+' : '')}{change}
                </span>
            </div>
            <div>
                <p className="text-2xl font-bold text-white mb-1">{value}</p>
                <p className="text-white/70 text-sm">{title}</p>
            </div>
        </div>
    );
};

// Placeholder components for other sections
const GigsSection = () => (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
        <h3 className="text-xl font-semibold text-white mb-4">My Gigs</h3>
        <p className="text-white/70">Gigs management section - Coming in Phase 3...</p>
    </div>
);

const OrdersSection = () => (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
        <h3 className="text-xl font-semibold text-white mb-4">Orders</h3>
        <p className="text-white/70">Orders management section - Coming in Phase 4...</p>
    </div>
);

const MessagesSection = () => (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
        <h3 className="text-xl font-semibold text-white mb-4">Messages</h3>
        <p className="text-white/70">Messages section - Coming in Phase 4...</p>
    </div>
);

const RequestsSection = () => (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
        <h3 className="text-xl font-semibold text-white mb-4">Buyer Requests</h3>
        <p className="text-white/70">Buyer requests section - Coming later...</p>
    </div>
);

const AnalyticsSection = () => (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
        <h3 className="text-xl font-semibold text-white mb-4">Analytics</h3>
        <p className="text-white/70">Analytics section - Coming in Phase 5...</p>
    </div>
);

const ProfileSection = () => (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
        <h3 className="text-xl font-semibold text-white mb-4">Profile</h3>
        <p className="text-white/70">Profile management section - Coming in Phase 5...</p>
    </div>
);

const SettingsSection = () => (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
        <h3 className="text-xl font-semibold text-white mb-4">Settings</h3>
        <p className="text-white/70">Settings section - Coming later...</p>
    </div>
);

export default FreelancerDashboard;