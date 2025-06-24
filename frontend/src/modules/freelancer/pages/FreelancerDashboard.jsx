import React, { useState, useEffect, useContext } from "react";
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
  Star,
  TrendingUp,
  Clock,
  Eye,
  Plus,
  Filter,
  Calendar,
  CheckCircle,
  AlertCircle,
  Users,
  Target,
  Award,
  Activity,
} from "lucide-react";
import Sidebar from "../components/freelancerDashboard/Sidebar";
import Header from "../components/freelancerDashboard/Header";
import DashboardOverview from "../components/freelancerDashboard/DashboardOverview";
import GigsSection from "../components/freelancerDashboard/GigsSection";
import OrderSection from "../components/freelancerDashboard/OrderSection";
import MessagesSection from "../components/freelancerDashboard/MessagesSection";
import RequestSection from "../components/freelancerDashboard/RequestSection";
import AnalyticsSection from "../components/freelancerDashboard/AnalyticsSection";
import ProfileSection from "../components/freelancerDashboard/ProfileSection";
import SettingsSection from "../components/freelancerDashboard/SettingsSection";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";

const FreelancerDashboard = () => {
  const { token } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [profileId, setProfileId] = useState(null);

  // Fetch profile data
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:8000/api/v1/profiles/freelancer/profile-setup/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const profile = Array.isArray(res.data) ? res.data[0] : res.data;
        if (profile) {
          setProfileData(profile);
          setProfileId(profile.id);
          setEditData({ ...profile });
        } else {
          setProfileData(null);
          setProfileId(null);
          setEditData(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setProfileData(null);
        setProfileId(null);
        setEditData(null);
      });
  }, [token]);

  // Update editData when profileData changes
  useEffect(() => {
    if (profileData) {
      setEditData({ ...profileData });
    }
  }, [profileData]);

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleAddItem = (field, newItem) => {
    setEditData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), newItem],
    }));
  };

  const handleRemoveItem = (field, index) => {
    setEditData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!profileId || !editData) return;
    const cleanedEditData = { ...editData };
    // Remove fields that shouldn't be sent to the backend
    delete cleanedEditData.verification;
    console.log("Sending data:", cleanedEditData);
    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/profiles/freelancer/profile-setup/${profileId}/`,
        cleanedEditData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileData(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err);
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const firstLetter = profileData?.first_name?.charAt(0)?.toUpperCase() || "U";

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "gigs", label: "My Gigs", icon: Briefcase },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "requests", label: "Buyer Requests", icon: Search },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const getCurrentSectionContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview profileData={profileData} />;
      case "gigs":
        return <GigsSection />;
      case "orders":
        return <OrderSection />;
      case "messages":
        return <MessagesSection />;
      case "requests":
        return <RequestSection />;
      case "analytics":
        return <AnalyticsSection />;
      case "profile":
        return (
          <ProfileSection
            profileData={profileData}
            editData={editData}
            isEditing={isEditing}
            onInputChange={handleInputChange}
            onArrayChange={handleArrayChange}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      case "settings":
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
        <main className="p-6">{getCurrentSectionContent()}</main>
      </div>
    </div>
  );
};

export default FreelancerDashboard;