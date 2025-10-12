import React, { useState, useContext, useEffect, useMemo } from 'react';
import {
  Home, Briefcase, ShoppingCart, MessageCircle, Search, BarChart3,
  User, Settings, Bell, Menu, X, DollarSign, Star, TrendingUp, Clock,
  Eye, Plus, Filter, Calendar, CheckCircle, AlertCircle, Compass
} from 'lucide-react';
import api from '../../../api/api';
import { AuthContext } from '../../../context/AuthContext';
import NotificationDropdown from '../components/notifications/NotificationDropdown';
import ProfileSection from '../components/freelancerDashboard/ProfileSection';
import SettingsSection from '../components/freelancerDashboard/SettingsSection';
import DashboardOverview from '../components/freelancerDashboard/DashboardOverview';
import MessagesSection from '../components/freelancerDashboard/MessagesSection';
import ServicesSection from '../components/freelancerDashboard/ServicesSection';
import BrowseClientSection from '../components/freelancerDashboard/BrowseClientSection';
import OrderSection from '../components/freelancerDashboard/OrderSection';
import ExploreProposalsSection from '../components/freelancerDashboard/ExploreProposalsSection';
import AnalyticsSection from '../components/freelancerDashboard/AnalyticsSection';
import { OrdersProvider } from "../../../context/freelancer/OrdersContext";


const FreelancerDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);


  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [clientsError, setClientsError] = useState(null);

  const [freelancers, setFreelancers] = useState([]);

  const { token } = useContext(AuthContext);

  // analyticsSection States
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // active projects states
  const [activeProjects, setActiveProjects] = useState(0);
  const [loadingActive, setLoadingActive] = useState(true);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'browse', label: 'Browse Clients', icon: Search },
    { id: 'explore', label: 'Explore Proposals', icon: Compass },
    { id: 'gigs', label: 'My Services', icon: Briefcase },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'requests', label: 'Buyer Requests', icon: Search },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    if (activeSection === 'browse') {
      const fetchClients = async () => {
        setLoadingClients(true);
        setClientsError(null);
        try {
          const res = await api.get('/api/v1/profiles/clients/browse/', {
            params: { page: 1, ordering: '-created_at' }, // adjust as needed
            headers: { Authorization: `Bearer ${token}` }, // omit if your api adds it globally
          });

          // Transform data to your desired shape for minimal listing
          const transformedClients = (res.data.results || []).map(client => ({
            id: client.id,
            companyName: client.company_name,
            profilePicture: client.profile_picture,
            location: client.location,
            country: client.country,
            industry: client.industry,
            accountType: client.account_type,
          }));

          setClients(transformedClients);
        } catch (err) {
          console.error('Error fetching clients:', err);
          setClientsError('Failed to load clients');
          setClients([]);
        } finally {
          setLoadingClients(false);
        }
      };

      if (token) fetchClients();
    }
  }, [activeSection, token]);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const res = await api.get('/api/v1/profiles/freelancer/profile-setup/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFreelancers(res.data || []);
      } catch (err) {
        setFreelancers([]);
        console.error(err);
      }
    };

    if (token) {
      fetchFreelancers();
    }
  }, [token]);

  // Fetch payment history for analytics
  useEffect(() => {
    const fetchPayments = async () => {
      setLoadingPayments(true);
      try {
        const response = await api.get(
          `/api/v1/messaging/payment-requests-full/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;
        if (Array.isArray(data)) {
          setPaymentHistory(data);
          setTotalPages(1);
        } else {
          setPaymentHistory(data.results || []);
          setTotalPages(data.total_pages || 1);
        }
      } catch (error) {
        console.error("Failed to fetch payment requests:", error);
      } finally {
        setLoadingPayments(false);
      }
    };
    if (token) fetchPayments();
  }, [token]);

  // fetch active projects count
  useEffect(() => {
    const fetchActiveProjects = async () => {
      setLoadingActive(true);
      try {
        const response = await api.get("/api/v1/messaging/contracts/active/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setActiveProjects(response.data);
      } catch (error) {
        console.error("Failed to fetch active projects:", error);
      } finally {
        setLoadingActive(false);
      }
    };

    if (token) fetchActiveProjects();
  }, [token]);

  const analytics = useMemo(() => {
    const payments = Array.isArray(paymentHistory) ? paymentHistory : [];
    const projects = Array.isArray(activeProjects) ? activeProjects : [];

    const successfulPayments = payments.filter(
      (t) => t.status?.toLowerCase() === "completed"
    );

    const completedProjects = projects.filter(
      (p) => ["completed", "paid"].includes(p.status?.toLowerCase())
    );

    const pendingPayments = payments.filter(
      (p) => p.status?.toLowerCase() === "pending"
    );

    const inProgressProjects = projects.filter(
      (p) => ['planning',
        'advance',
        'draft',
        'submitted',
        'in-progress',
        'milestone-1',
        'revision',
        'final-review',].includes(p.status?.toLowerCase())
    );

    const totalAmount = successfulPayments.reduce(
      (sum, t) => sum + Number(t.amount),
      0
    );
    const commission = successfulPayments.length * 150;
    const totalCommission = successfulPayments.reduce(
      (sum, t) => sum + Number(t.platform_fee || 0),
      0
    );
    const pendingAmount = pendingPayments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    const ratingsAverage = successfulPayments
      .filter(p => p.rating)
      .reduce((sum, p, _, arr) => sum + p.rating / arr.length, 0);

    const averageProjectValue = successfulPayments.length > 0
      ? totalAmount / successfulPayments.length
      : 0;

    const successRate =
      paymentHistory.length > 0
        ? (successfulPayments.length / paymentHistory.length) * 100
        : 0;

    const avgRatingGiven =
      successfulPayments.length > 0
        ? (4.5 + (successfulPayments.length % 5) * 0.1).toFixed(1)
        : "—";

    return {
      totalAmount,
      completedProjectsCount: completedProjects.length,
      commission,
      totalCommission,
      averageProjectValue,
      pendingAmount,
      pendingPaymentsLength: pendingPayments.length,
      ratingsAverage,
      inProgressCount: inProgressProjects.length,
      totalProjects: projects.length, // ✅ now safe
      avgRatingGiven,
      successRate
    };
  }, [paymentHistory, activeProjects]); // ✅ recompute when data arrives

  const startChatForConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    setActiveSection('messages');
  };

  const getCurrentSectionContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview
          analytics={analytics}
          loadingPayments={loadingPayments}
          loadingActive={loadingActive}
          activeProjects={activeProjects}
          activeProjectsCount={activeProjects.length || 0}
          setActiveSection={setActiveSection}
        />;
      case 'browse':
        return <BrowseClientSection
          clients={clients}
          loading={loadingClients}
          error={clientsError}
        />
      case 'explore':
        return <ExploreProposalsSection />;
      case 'gigs':
        return <ServicesSection />;
      case 'orders':
        return <OrderSection
          selectedOrderId={selectedOrderId}
          onSelectOrder={setSelectedOrderId}
          onStartChat={startChatForConversation}
        />;
      case 'messages':
        return <MessagesSection
          conversationId={activeConversationId}
        />;
      case 'requests':
        return <RequestsSection />;
      case 'analytics':
        return <AnalyticsSection
          paymentHistory={paymentHistory}
          setPaymentHistory={setPaymentHistory}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          loadingPayments={loadingPayments}
          activeProjects={activeProjects}
          loadingActive={loadingActive}
        />;
      case 'profile':
        return <ProfileSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <OrdersProvider>
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">FreelanceHub</h1>
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
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeSection === item.id
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white shadow-lg border border-purple-500/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    <Icon size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{item.label}</span>
                    {item.id === 'messages' && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                    )}
                    {item.id === 'orders' && (
                      <span className="ml-auto bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <button
                onClick={() => setActiveSection('gigs')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg">
                <Plus size={18} />
                <span>Create New Service</span>
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
                  <p className="text-white/60 text-sm">
                    Welcome back, {freelancers.length > 0 ? `${freelancers[0].first_name} ` : 'John Doe'}!
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
                  <Calendar size={16} className="text-white/70" />
                  <span className="text-white/70 text-sm">{new Date().toLocaleDateString()}</span>
                </div>
                <NotificationDropdown
                  onNotificationClick={(notif) => {
                    setActiveSection('orders');     // Switch to orders tab
                    setSelectedOrderId(notif.id);   // Set to specific order ID
                  }}
                />

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full shadow-lg overflow-hidden border-2 border-gradient-to-r from-purple-400 to-pink-500">
                    {freelancers.length > 0 && freelancers[0].profile_picture ? (
                      <img
                        src={freelancers[0].profile_picture}
                        alt={`${freelancers[0].first_name} profile`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-white" />
                    )}
                  </div>

                  <div className="hidden sm:block">
                    <p className="text-white font-medium">{freelancers.length > 0 ? `${freelancers[0].first_name} ${freelancers[0].last_name}` : 'user'}</p>
                    <p className="text-white/60 text-xs">Pro Freelancer</p>
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
    </OrdersProvider>
  );
};


const StatCard = ({ title, value, icon: Icon, change, trend, subtitle }) => {
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-white/70';

  return (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
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

const OrderItem = ({ title, client, status, amount, deadline }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={14} />;
      case 'in-progress': return <Clock size={14} />;
      case 'review': return <Eye size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
      <div className="flex-1">
        <h4 className="font-medium text-white mb-1">{title}</h4>
        <p className="text-white/60 text-sm">{client}</p>
      </div>
      <div className="flex items-center space-x-4">
        <div>
          <p className="text-white font-medium text-right">{amount}</p>
          <p className="text-white/60 text-xs text-right">{deadline}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(status)}`}>
          {getStatusIcon(status)}
          <span className="capitalize">{status.replace('-', ' ')}</span>
        </span>
      </div>
    </div>
  );
};


const RequestsSection = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold text-white">Buyer Requests</h3>
      <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors">
        Refresh
      </button>
    </div>
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
      <Search size={48} className="text-white/30 mx-auto mb-4" />
      <h4 className="text-xl font-semibold text-white mb-2">Find New Opportunities</h4>
      <p className="text-white/70 mb-6">Browse and respond to buyer requests</p>
      <div className="text-white/50 text-sm">Request browsing system coming soon...</div>
    </div>
  </div>
);

export default FreelancerDashboard;
