import React, { useState } from 'react';
import {
    Home,
    Search,
    Save,
    Edit3,
    ShoppingCart,
    MessageCircle,
    Users,
    BarChart3,
    User,
    Settings,
    Bell,
    Menu,
    X,
    DollarSign,
    Star,
    TrendingUp,
    Clock,
    Eye,
    Plus,
    Filter,
    Calendar,
    CheckCircle,
    AlertCircle,
    Target,
    Award,
    Activity,
    Briefcase,
    FileText,
    CreditCard,
    BookOpen,
    Heart,
    Zap,
    Shield
} from 'lucide-react';
import Sidebar from '../components/clientDashboard/Sidebar';
import Header from '../components/clientDashboard/Header';

const ClientDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileData, setProfileData] = useState(null);

    const firstLetter = profileData?.first_name?.charAt(0)?.toUpperCase() || 'C';

    const navigationItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'browse', label: 'Browse Talent', icon: Search },
        { id: 'projects', label: 'My Projects', icon: Briefcase },
        { id: 'messages', label: 'Messages', icon: MessageCircle },
        { id: 'freelancers', label: 'My Freelancers', icon: Users },
        { id: 'invoices', label: 'Invoices & Payments', icon: CreditCard },
        { id: 'analytics', label: 'Project Analytics', icon: BarChart3 },
        { id: 'profile', label: 'Company Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const getCurrentSectionContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <DashboardOverview profileData={profileData} />;
            case 'browse':
                return <BrowseTalentSection />;
            case 'projects':
                return <ProjectsSection />;
            case 'messages':
                return <MessagesSection />;
            case 'freelancers':
                return <FreelancersSection />;
            case 'invoices':
                return <InvoicesSection />;
            case 'analytics':
                return <AnalyticsSection />;
            case 'profile':
                return <ProfileSection profileData={profileData} onUpdate={setProfileData} />;
            case 'settings':
                return <SettingsSection />;
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                navigationItems={navigationItems}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Top Header */}
                <Header
                    activeSection={activeSection}
                    setSidebarOpen={setSidebarOpen}
                    profileData={profileData}
                    firstLetter={firstLetter}
                />

                {/* Page Content */}
                <main className="p-6">
                    {getCurrentSectionContent()}
                </main>
            </div>
        </div>
    );
};

// Enhanced Dashboard Overview for Clients
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

const ProjectItem = ({ title, freelancer, status, budget, deadline, progress }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'planning': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            default: return 'bg-white/10 text-white/70 border-white/20';
        }
    };

    return (
        <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">{title}</h4>
                    <p className="text-white/60 text-sm">by {freelancer}</p>
                </div>
                <div className="text-right">
                    <p className="text-white font-medium">{budget}</p>
                    <p className="text-white/60 text-xs">{deadline}</p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                    <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                    <span className="capitalize">{status.replace('-', ' ')}</span>
                </span>
            </div>
        </div>
    );
};

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

const FreelancerCard = ({ name, title, rating, rate, skills, avatar }) => (
    <div className="bg-white/5 rounded-lg border border-white/10 p-4 hover:bg-white/10 transition-colors">
        <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{avatar}</span>
            </div>
            <div className="flex-1">
                <h4 className="font-medium text-white">{name}</h4>
                <p className="text-white/60 text-sm">{title}</p>
            </div>
            <div className="text-right">
                <div className="flex items-center space-x-1">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-white text-sm">{rating}</span>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between mb-3">
            <span className="text-white font-medium">{rate}</span>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                Contact
            </button>
        </div>

        <div className="flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="bg-white/10 text-white/70 px-2 py-1 rounded text-xs">
                    {skill}
                </span>
            ))}
        </div>
    </div>
);

// Enhanced sections for client-specific features
const BrowseTalentSection = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">Browse Talent</h3>
            <div className="flex items-center space-x-2">
                <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center space-x-2">
                    <Filter size={16} />
                    <span>Filters</span>
                </button>
                <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200">
                    Post Project
                </button>
            </div>
        </div>
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
            <Search size={48} className="text-white/30 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Find Perfect Freelancers</h4>
            <p className="text-white/70 mb-6">Browse thousands of talented professionals across all categories</p>
            <div className="text-white/50 text-sm">Advanced search and filtering system coming soon...</div>
        </div>
    </div>
);

const ProjectsSection = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">My Projects</h3>
            <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2">
                <Plus size={18} />
                <span>New Project</span>
            </button>
        </div>
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
            <Briefcase size={48} className="text-white/30 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Project Management</h4>
            <p className="text-white/70 mb-6">Track progress, manage milestones, and communicate with your team</p>
            <div className="text-white/50 text-sm">Comprehensive project management tools in development...</div>
        </div>
    </div>
);

const MessagesSection = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">Messages</h3>
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">5 Unread</span>
        </div>
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
            <MessageCircle size={48} className="text-white/30 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Team Communication</h4>
            <p className="text-white/70 mb-6">Chat with freelancers, share files, and manage conversations</p>
            <div className="text-white/50 text-sm">Real-time messaging system in development...</div>
        </div>
    </div>
);

const FreelancersSection = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">My Freelancers</h3>
            <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center space-x-2">
                <Heart size={16} />
                <span>Favorites</span>
            </button>
        </div>
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
            <Users size={48} className="text-white/30 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Your Freelancer Network</h4>
            <p className="text-white/70 mb-6">Manage your trusted freelancers and build long-term relationships</p>
            <div className="text-white/50 text-sm">Freelancer relationship management coming soon...</div>
        </div>
    </div>
);

const InvoicesSection = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">Invoices & Payments</h3>
            <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors">
                Payment Methods
            </button>
        </div>
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
            <CreditCard size={48} className="text-white/30 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Financial Management</h4>
            <p className="text-white/70 mb-6">Track expenses, manage invoices, and handle secure payments</p>
            <div className="text-white/50 text-sm">Comprehensive billing system in development...</div>
        </div>
    </div>
);

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

const ProfileSection = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: 'John',
        lastName: 'Smith',
        companyName: 'TechCorp',
        accountType: 'business',
        industry: 'Technology',
        companySize: 'Medium company (51-200)',
        website: 'https://techcorp.com',
        location: 'San Francisco, CA',
        companyDescription: 'Leading technology solutions provider specializing in enterprise software development and digital transformation.',
        projectTypes: ['Web Development', 'Mobile App Development', 'UI/UX Design'],
        budgetRange: '$10,000 - $25,000',
        projectFrequency: 'Monthly',
        preferredCommunication: ['Email', 'Slack', 'Zoom'],
        workingHours: 'EST 9AM-6PM',
        businessGoals: ['Scale business operations', 'Digital transformation', 'Improve efficiency'],
        currentChallenges: ['Finding reliable freelancers', 'Project management', 'Quality control'],
        paymentMethod: 'credit-card',
        monthlyBudget: '15000',
        projectBudget: '5000',
        paymentTiming: 'milestone-based'
    });

    const [editData, setEditData] = useState({ ...profileData });
    const [newProjectType, setNewProjectType] = useState('');
    const [newCommunicationMethod, setNewCommunicationMethod] = useState('');
    const [newBusinessGoal, setNewBusinessGoal] = useState('');
    const [newChallenge, setNewChallenge] = useState('');

    // Predefined options
    const accountTypes = ['business', 'individual', 'enterprise'];
    const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing', 'Consulting', 'Media', 'Other'];
    const companySizes = ['Small company (1-50)', 'Medium company (51-200)', 'Large company (201-1000)', 'Enterprise (1000+)'];
    const budgetRanges = ['$1,000 - $5,000', '$5,000 - $10,000', '$10,000 - $25,000', '$25,000 - $50,000', '$50,000+'];
    const projectFrequencies = ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'As needed'];
    const paymentMethods = ['credit-card', 'bank-transfer', 'paypal', 'cryptocurrency'];
    const paymentTimings = ['upfront', 'milestone-based', 'monthly', 'project-completion'];

    const handleInputChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayAdd = (field, value, setter) => {
        if (value.trim()) {
            setEditData(prev => ({
                ...prev,
                [field]: [...prev[field], value.trim()]
            }));
            setter('');
        }
    };

    const handleArrayRemove = (field, index) => {
        setEditData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSave = () => {
        setProfileData({ ...editData });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({ ...profileData });
        setIsEditing(false);
        // Reset all temporary input states
        setNewProjectType('');
        setNewCommunicationMethod('');
        setNewBusinessGoal('');
        setNewChallenge('');
    };

    const EditableField = ({ label, value, field, type = 'text', options = null, isTextarea = false }) => {
        if (!isEditing) {
            return (
                <div>
                    <label className="text-white/70 text-sm">{label}</label>
                    <p className="text-white font-medium mt-1">{type === 'currency' ? `$${parseInt(value || 0).toLocaleString()}` : value}</p>
                </div>
            );
        }

        if (options) {
            return (
                <div>
                    <label className="text-white/70 text-sm mb-2 block">{label}</label>
                    <select
                        value={editData[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {options.map(option => (
                            <option key={option} value={option} className="bg-gray-800">{option}</option>
                        ))}
                    </select>
                </div>
            );
        }

        if (isTextarea) {
            return (
                <div>
                    <label className="text-white/70 text-sm mb-2 block">{label}</label>
                    <textarea
                        value={editData[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        rows={3}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>
            );
        }

        return (
            <div>
                <label className="text-white/70 text-sm mb-2 block">{label}</label>
                <input
                    type={type}
                    value={editData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        );
    };

    const EditableArrayField = ({ label, field, items, newValue, setNewValue, placeholder }) => {
        if (!isEditing) {
            return (
                <div>
                    <label className="text-white/70 text-sm">{label}</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {items.map((item, index) => (
                            <span key={index} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/30">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div>
                <label className="text-white/70 text-sm mb-2 block">{label}</label>
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {editData[field].map((item, index) => (
                            <div key={index} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/30 flex items-center space-x-2">
                                <span>{item}</span>
                                <button
                                    onClick={() => handleArrayRemove(field, index)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            placeholder={placeholder}
                            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleArrayAdd(field, newValue, setNewValue);
                                }
                            }}
                        />
                        <button
                            onClick={() => handleArrayAdd(field, newValue, setNewValue)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Company Profile</h3>
                <div className="flex space-x-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleCancel}
                                className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg font-medium hover:bg-red-500/30 transition-all duration-200 flex items-center space-x-2"
                            >
                                <X size={16} />
                                <span>Cancel</span>
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center space-x-2"
                            >
                                <Save size={16} />
                                <span>Save Changes</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2"
                        >
                            <Edit3 size={16} />
                            <span>Edit Profile</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Overview */}
                <div className="lg:col-span-1">
                    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <User size={32} className="text-white" />
                            </div>
                            <h4 className="text-xl font-semibold text-white">{isEditing ? editData.companyName : profileData.companyName}</h4>
                            <p className="text-white/70 text-sm capitalize">{isEditing ? editData.accountType : profileData.accountType} Account</p>
                            <div className="flex items-center justify-center space-x-1 mt-2">
                                <Shield size={14} className="text-green-400" />
                                <span className="text-green-400 text-xs">Verified</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <User size={16} className="text-white/50" />
                                <span className="text-white text-sm">
                                    {isEditing ? `${editData.firstName} ${editData.lastName}` : `${profileData.firstName} ${profileData.lastName}`}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Target size={16} className="text-white/50" />
                                <span className="text-white text-sm">{isEditing ? editData.industry : profileData.industry}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users size={16} className="text-white/50" />
                                <span className="text-white text-sm">{isEditing ? editData.companySize : profileData.companySize}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <DollarSign size={16} className="text-white/50" />
                                <span className="text-white text-sm">{isEditing ? editData.budgetRange : profileData.budgetRange}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                        <h5 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                            <Briefcase size={20} />
                            <span>Basic Information</span>
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EditableField label="First Name" value={profileData.firstName} field="firstName" />
                            <EditableField label="Last Name" value={profileData.lastName} field="lastName" />
                            <EditableField label="Company Name" value={profileData.companyName} field="companyName" />
                            <EditableField label="Account Type" value={profileData.accountType} field="accountType" options={accountTypes} />
                            <EditableField label="Industry" value={profileData.industry} field="industry" options={industries} />
                            <EditableField label="Company Size" value={profileData.companySize} field="companySize" options={companySizes} />
                            <EditableField label="Location" value={profileData.location} field="location" />
                            <EditableField label="Website" value={profileData.website} field="website" type="url" />
                            <div className="md:col-span-2">
                                <EditableField
                                    label="Company Description"
                                    value={profileData.companyDescription}
                                    field="companyDescription"
                                    isTextarea={true}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Project Preferences */}
                    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                        <h5 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                            <Target size={20} />
                            <span>Project Preferences</span>
                        </h5>
                        <div className="space-y-4">
                            <EditableArrayField
                                label="Project Types"
                                field="projectTypes"
                                items={profileData.projectTypes}
                                newValue={newProjectType}
                                setNewValue={setNewProjectType}
                                placeholder="Add project type"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <EditableField label="Budget Range" value={profileData.budgetRange} field="budgetRange" options={budgetRanges} />
                                <EditableField label="Project Frequency" value={profileData.projectFrequency} field="projectFrequency" options={projectFrequencies} />
                                <EditableField label="Working Hours" value={profileData.workingHours} field="workingHours" />
                            </div>
                            <EditableArrayField
                                label="Preferred Communication"
                                field="preferredCommunication"
                                items={profileData.preferredCommunication}
                                newValue={newCommunicationMethod}
                                setNewValue={setNewCommunicationMethod}
                                placeholder="Add communication method"
                            />
                        </div>
                    </div>

                    {/* Business Goals & Challenges */}
                    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                        <h5 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                            <Award size={20} />
                            <span>Business Overview</span>
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <EditableArrayField
                                    label="Business Goals"
                                    field="businessGoals"
                                    items={profileData.businessGoals}
                                    newValue={newBusinessGoal}
                                    setNewValue={setNewBusinessGoal}
                                    placeholder="Add business goal"
                                />
                            </div>
                            <div>
                                <EditableArrayField
                                    label="Current Challenges"
                                    field="currentChallenges"
                                    items={profileData.currentChallenges}
                                    newValue={newChallenge}
                                    setNewValue={setNewChallenge}
                                    placeholder="Add challenge"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                        <h5 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                            <CreditCard size={20} />
                            <span>Payment & Budget</span>
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <EditableField label="Payment Method" value={profileData.paymentMethod} field="paymentMethod" options={paymentMethods} />
                            <EditableField label="Monthly Budget" value={profileData.monthlyBudget} field="monthlyBudget" type="number" />
                            <EditableField label="Project Budget" value={profileData.projectBudget} field="projectBudget" type="number" />
                            <EditableField label="Payment Timing" value={profileData.paymentTiming} field="paymentTiming" options={paymentTimings} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsSection = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white">Settings</h3>
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
            <Settings size={48} className="text-white/30 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Account Settings</h4>
            <p className="text-white/70 mb-6">Manage notifications, billing preferences, and security settings</p>
            <div className="text-white/50 text-sm">Settings panel coming soon...</div>
        </div>
    </div>
);

export default ClientDashboard;