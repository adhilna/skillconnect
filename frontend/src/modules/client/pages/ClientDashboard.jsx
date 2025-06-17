import React, { useState } from 'react';
import { 
  Home, 
  Search, 
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

const ClientDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        return <DashboardOverview />;
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
        return <ProfileSection />;
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
      <div className={`fixed left-0 top-0 h-full w-64 bg-black/20 backdrop-blur-lg border-r border-white/10 z-50 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">FreelanceHub</h1>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white transition-colors"
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
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white shadow-lg border border-blue-500/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.label}</span>
                  {item.id === 'messages' && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">5</span>
                  )}
                  {item.id === 'projects' && (
                    <span className="ml-auto bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg">
              <Plus size={18} />
              <span>Post New Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white/70 hover:text-white transition-colors"
              >
                <Menu size={24} />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-white capitalize">
                  {activeSection === 'dashboard' ? 'Dashboard Overview' : activeSection.replace(/([A-Z])/g, ' $1')}
                </h2>
                <p className="text-white/60 text-sm">Welcome back, TechCorp!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
                <Calendar size={16} className="text-white/70" />
                <span className="text-white/70 text-sm">{new Date().toLocaleDateString()}</span>
              </div>
              
              <button className="relative p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                  <User size={20} className="text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-white font-medium">TechCorp</p>
                  <p className="text-white/60 text-xs">Premium Client</p>
                </div>
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

const ProfileSection = () => (
  <div className="space-y-6">
    <h3 className="text-2xl font-bold text-white">Company Profile</h3>
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
      <User size={48} className="text-white/30 mx-auto mb-4" />
      <h4 className="text-xl font-semibold text-white mb-2">Your Company Profile</h4>
      <p className="text-white/70 mb-6">Manage your company information, requirements, and preferences</p>
      <div className="text-white/50 text-sm">Company profile editor coming soon...</div>
    </div>
  </div>
);

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