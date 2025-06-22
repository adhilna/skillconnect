import React, { useState } from 'react';
import {
    Home, Search, MessageCircle, Users, BarChart3,
    User, Settings, Briefcase, CreditCard,
} from 'lucide-react';
import Sidebar from '../components/clientDashboard/Sidebar';
import Header from '../components/clientDashboard/Header';
import DashboardOverview from '../components/clientDashboard/DashboardOverview';
import BrowseTalentSection from '../components/clientDashboard/BrowseTalentSection';
import ProjectsSection from '../components/clientDashboard/ProjectsSection';
import MessagesSection from '../components/clientDashboard/MessagesSection';
import FreelancersSection from '../components/clientDashboard/FreelancersSection';
import InvoicesSection from '../components/clientDashboard/InvoicesSection';
import AnalyticsSection from '../components/clientDashboard/AnalyticsSection';
import ProfileSection from '../components/clientDashboard/ProfileSection';
import SettingsSection from '../components/clientDashboard/SettingsSection';

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

export default ClientDashboard;