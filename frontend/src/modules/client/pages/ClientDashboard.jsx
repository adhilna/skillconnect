import React, { useState, useEffect, useContext } from 'react';
import {
    Home, Search, MessageCircle, Users, BarChart3,
    User, Settings, Briefcase, CreditCard, Compass, ShoppingCart
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/clientDashboard/Sidebar';
import Header from '../components/clientDashboard/Header';
import DashboardOverview from '../components/clientDashboard/DashboardOverview';
import BrowseTalentSection from '../components/clientDashboard/BrowseTalentSection';
import ProposalsSection from '../components/clientDashboard/ProposalsSection';
import MessagesSection from '../components/clientDashboard/MessagesSection';
import FreelancersSection from '../components/clientDashboard/FreelancersSection';
import PaymentSection from '../components/clientDashboard/PaymentSection';
import AnalyticsSection from '../components/clientDashboard/AnalyticsSection';
import ProfileSection from '../components/clientDashboard/ProfileSection';
import SettingsSection from '../components/clientDashboard/SettingsSection';
import ExploreServicesSection from '../components/clientDashboard/ExploreServicesSection';
import { AuthContext } from '../../../context/AuthContext';
import api from '../../../api/api';
import OrderSection from '../components/clientDashboard/OrderSection';


const ClientDashboard = () => {
    const { token } = useContext(AuthContext);
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [profileId, setProfileId] = useState(null);
    const [freelancers, setFreelancers] = useState([]);
    const [loadingFreelancers, setLoadingFreelancers] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const [activeConversationId, setActiveConversationId] = useState(null);

    const [paymentSectionView, setPaymentSectionView] = useState('dashboard'); // 'dashboard' or 'payment'
    const [paymentSelectedPayment, setPaymentSelectedPayment] = useState(null);

    const openPaymentFlow = async (messagePaymentData) => {
        try {
            console.log("🟢 Parent openPaymentFlow received message payment:", messagePaymentData);

            // 1️⃣ Fetch real payment object from backend using message data
            // Assuming you have an endpoint like `/payments/?message_id=224` or something similar
            const res = await api.get(`/api/v1/messaging/payment-requests/${messagePaymentData.id}/`);
            // Or use messagePaymentData.payment_id if available

            console.log("✅ Real payment data fetched:", res.data);

            // 2️⃣ Set it to parent state
            setPaymentSelectedPayment(res.data);

            // 3️⃣ Switch section
            setPaymentSectionView('payment');
            setActiveSection('payments');
        } catch (err) {
            console.error("❌ Failed to fetch payment details:", err);
            // Optional: show toast
        }
    };


    useEffect(() => {
        if (location.state?.section) {
            setActiveSection(location.state.section);
        }
    }, [location.state]);

    const startChatForConversation = (conversationId) => {
        setActiveConversationId(conversationId);
        setActiveSection('messages');
    };

    useEffect(() => {
        if (!token) return;
        api.get('/api/v1/profiles/client/profile-setup/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                // Handle both array and object responses
                const profile = Array.isArray(res.data) ? res.data[0] : res.data;
                if (profile) {
                    setProfileData(profile);
                    setProfileId(profile.id);
                } else {
                    // No profile exists for this user
                    setProfileData(null);
                    setProfileId(null);
                }
            })
            .catch(err => {
                console.error('Error fetching profile:', err);
                setProfileData(null);
                setProfileId(null);
            });
    }, [token]);

    useEffect(() => {
        const fetchFreelancers = async () => {
            setLoadingFreelancers(true);
            try {
                const res = await api.get('/api/v1/profiles/freelancers/browse/', {
                    params: { page: 1, ordering: '-rating' },
                    headers: { Authorization: `Bearer ${token}` }
                });

                const transformed = (res.data.results || []).map(freelancer => ({
                    ...freelancer,
                    availability: freelancer.is_available ? 'Available' : 'Busy',
                    reviewCount: freelancer.review_count ?? 0,
                    bio: freelancer.about ?? '',
                    skills: freelancer.skills || [],
                }));

                setFreelancers(transformed);
            } catch (err) {
                console.error('Error fetching freelancers:', err);
                setFreelancers([]);
            } finally {
                setLoadingFreelancers(false);
            }
        };

        if (token) fetchFreelancers();
    }, [token]);

    useEffect(() => {
        if (profileData) {
            setEditData({ ...profileData });
        }
    }, [profileData]);

    const handleInputChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayAdd = (field, value, setter) => {
        if (value.trim()) {
            setEditData(prev => ({
                ...prev,
                [field]: [...(prev[field] || []), value.trim()]
            }));
            setter('');
        }
    };

    const handleArrayRemove = (field, index) => {
        setEditData(prev => ({
            ...prev,
            [field]: (prev[field] || []).filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        if (!profileId) return;

        const formData = new FormData();

        // Flat fields
        formData.append("first_name", editData.first_name || "");
        formData.append("last_name", editData.last_name || "");
        formData.append("account_type", editData.account_type || "");
        formData.append("company_name", editData.company_name || "");
        formData.append("company_description", editData.company_description || "");
        formData.append("country", editData.country || "");
        formData.append("location", editData.location || "");
        formData.append("website", editData.website || "");
        formData.append("monthly_budget", editData.monthly_budget || "");
        formData.append("project_budget", editData.project_budget || "");
        formData.append("budget_range", editData.budget_range || "");
        formData.append("project_frequency", editData.project_frequency || "");
        formData.append("expected_timeline", editData.expected_timeline || "");
        formData.append("payment_method", editData.payment_method || "");
        formData.append("payment_timing", editData.payment_timing || "");
        formData.append("quality_importance", editData.quality_importance || "");
        formData.append("working_hours", editData.working_hours || "");
        formData.append("previous_experiences", editData.previous_experiences || "");
        formData.append("industry", editData.industry || "");
        formData.append("project_types", JSON.stringify(editData.project_types || []));
        formData.append("preferred_communications", JSON.stringify(editData.preferred_communications || []));
        formData.append("business_goals", JSON.stringify(editData.business_goals || []));
        formData.append("current_challenges", JSON.stringify(editData.current_challenges || []));

        // File field (optional - only if user updates profile pic)
        if (typeof editData.profile_picture === "object" && editData.profile_picture instanceof File) {
            formData.append("profile_picture", editData.profile_picture);
        }


        try {
            const response = await api.put(
                `/api/v1/profiles/client/profile-setup/${profileId}/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // Do not set Content-Type manually
                    },
                }
            );
            setProfileData(response.data);
            setIsEditing(false);
        } catch (err) {
            console.error("Full error response:", err.response?.data || err.message);
        }
    };


    const handleCancel = () => {
        setEditData({ ...profileData });
        setIsEditing(false);
    };



    const firstLetter = profileData?.first_name?.charAt(0)?.toUpperCase() || 'C';

    const navigationItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'browse', label: 'Browse Talent', icon: Search },
        { id: 'explore', label: 'Explore Services', icon: Compass },
        { id: 'proposals', label: 'My Proposals', icon: Briefcase },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'messages', label: 'Messages', icon: MessageCircle },
        { id: 'freelancers', label: 'My Freelancers', icon: Users },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'analytics', label: 'Project Analytics', icon: BarChart3 },
        { id: 'profile', label: 'Company Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const getCurrentSectionContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <DashboardOverview
                    profileData={profileData}
                    featuredFreelancers={freelancers.slice(0, 3)} // Only top 3
                    loading={loadingFreelancers}
                    setActiveSection={setActiveSection}
                />;
            case 'browse':
                return <BrowseTalentSection
                    preloadedFreelancers={freelancers}
                    loading={loadingFreelancers}
                />;
            case 'explore':
                return <ExploreServicesSection />;
            case 'proposals':
                return <ProposalsSection
                    selectedOrderId={selectedOrderId}
                    onSelectOrder={setSelectedOrderId}
                />;
            case 'orders':
                return <OrderSection
                    selectedOrderId={selectedOrderId}
                    onSelectOrder={setSelectedOrderId}
                    onStartChat={startChatForConversation}
                />;
            case 'messages':
                return <MessagesSection
                    conversationId={activeConversationId}
                    onOpenPaymentFlow={openPaymentFlow}
                    selectedPayment={paymentSelectedPayment}
                    setSelectedPayment={setPaymentSelectedPayment}
                />;
            case 'freelancers':
                return <FreelancersSection />;
            case 'payments':
                return <PaymentSection
                    currentView={paymentSectionView}
                    setCurrentView={setPaymentSectionView}
                    selectedPayment={paymentSelectedPayment}
                    setSelectedPayment={setPaymentSelectedPayment}
                />;
            case 'analytics':
                return <AnalyticsSection />;
            case 'profile':
                return <ProfileSection
                    profileData={isEditing ? editData : profileData}
                    isEditing={isEditing}
                    onInputChange={handleInputChange}
                    onArrayAdd={handleArrayAdd}
                    onArrayRemove={handleArrayRemove}
                    onEdit={() => setIsEditing(true)}
                    onCancel={handleCancel}
                    onSave={handleSave}
                />;
            case 'settings':
                return <SettingsSection />;
            default:
                return <DashboardOverview profileData={profileData} />;
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
                    onNotificationClick={(notif) => {
                        setActiveSection('orders');
                        setSelectedOrderId(notif.id);
                    }}
                />

                {/* Page Content */}
                <main className="p-6">
                    {getCurrentSectionContent()}
                </main>
            </div>
        </div>
    );
};

export default ClientDashboard;