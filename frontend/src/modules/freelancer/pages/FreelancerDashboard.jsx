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
  X,
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
import { toast } from "react-toastify";

const FreelancerDashboard = () => {
  const { token } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [errors, setErrors] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Deep update function for nested fields
  const updateNestedField = (obj, path, value) => {
    const keys = path.includes(":") ? path.split(":") : path.split(".");
    let current = { ...obj };
    let parent = current;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = isNaN(keys[i]) ? keys[i] : parseInt(keys[i]);
      parent[key] = Array.isArray(parent[key]) ? [...parent[key]] : { ...parent[key] };
      parent = parent[key];
    }
    parent[keys[keys.length - 1]] = value;
    return current;
  };

  // Fetch profile data
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:8000/api/v1/profiles/freelancer/profile-setup/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("API Response:", res.data);
        const profile = Array.isArray(res.data) ? res.data[0] : res.data;
        if (profile) {
          const normalizedProfile = {
            ...profile,
            educations: (profile.educations || []).map((edu) => ({
              ...edu,
              id: edu.id || null,
              year: String(edu.year || ""),
              certificate: edu.certificate || null,
            })),
            experiences: (profile.experiences || []).map((exp) => ({
              ...exp,
              id: exp.id || null,
              certificate: exp.certificate || null,
            })),
            portfolios: (profile.portfolios || []).map((item) => ({
              ...item,
              id: item.id || null,
            })),
          };
          setProfileData(normalizedProfile);
          setProfileId(profile.id);
          setEditData({ ...normalizedProfile });
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
        toast.error("Failed to fetch profile data.");
      });
  }, [token]);

  // Update editData when profileData changes
  useEffect(() => {
    if (profileData) {
      setEditData({ ...profileData });
    }
  }, [profileData]);

  const handleInputChange = (field, value) => {
    setEditData((prev) => updateNestedField(prev, field, value));
    setFieldErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleArrayAdd = (field, value, setter) => {
    if (value && typeof value === "string" && value.trim()) {
      setEditData((prev) => ({
        ...prev,
        [field]: [...(prev[field] || []), { id: null, name: value.trim() }],
      }));
      setter("");
    } else if (value && typeof value === "object") {
      setEditData((prev) => ({
        ...prev,
        [field]: [...(prev[field] || []), { id: null, ...value }],
      }));
    }
    setFieldErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleArrayRemove = (field, index) => {
    setEditData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
    setFieldErrors((prev) => ({ ...prev, [field]: null }));
  };

  // Map frontend to backend format
  const mapFrontendToBackend = (frontendData) => {
    const formData = new FormData();
    const mappedData = {
      first_name: String(frontendData.first_name || ""),
      last_name: String(frontendData.last_name || ""),
      about: String(frontendData.about || ""),
      location: String(frontendData.location || ""),
      age: frontendData.age ? parseInt(frontendData.age) : null,
      is_available: !!frontendData.is_available,
      skills: (frontendData.skills || []).map((skill) => ({
        name: String(skill.name || ""),
      })).filter((skill) => skill.name.trim()),
      educations: (frontendData.educations || []).map((edu) => ({
        id: edu.id || null,
        college: String(edu.college || ""),
        degree: String(edu.degree || ""),
        year: String(edu.year || ""),
        certificate: typeof edu.certificate === "string" ? edu.certificate : null,
      })).filter((edu) => edu.college.trim() || edu.degree.trim() || edu.year.trim()),
      experiences: (frontendData.experiences || []).map((exp) => ({
        id: exp.id || null,
        role: String(exp.role || ""),
        company: String(exp.company || ""),
        start_date: String(exp.start_date || ""),
        end_date: exp.end_date ? String(exp.end_date) : null,
        description: String(exp.description || ""),
        certificate: typeof exp.certificate === "string" ? exp.certificate : null,
      })).filter((exp) => exp.role.trim() || exp.company.trim()),
      languages: (frontendData.languages || []).map((lang) => ({
        name: String(lang.name || ""),
        proficiency: String(lang.proficiency || ""),
      })).filter((lang) => lang.name.trim()),
      portfolios: (frontendData.portfolios || []).map((item) => ({
        id: item.id || null,
        title: String(item.title || ""),
        description: String(item.description || ""),
        project_link: String(item.project_link || ""),
      })).filter((item) => item.title.trim() || item.project_link.trim()),
      social_links: {
        github_url: String(frontendData.social_links?.github_url || ""),
        linkedin_url: String(frontendData.social_links?.linkedin_url || ""),
        twitter_url: String(frontendData.social_links?.twitter_url || ""),
        facebook_url: String(frontendData.social_links?.facebook_url || ""),
        instagram_url: String(frontendData.social_links?.instagram_url || ""),
      },
    };

    // Log mapped data
    console.log("Mapped data:", JSON.stringify(mappedData, null, 2));

    // Append JSON data
    formData.append("data", JSON.stringify(mappedData));

    // Append education certificates
    frontendData.educations.forEach((edu, index) => {
      if (edu.certificate instanceof File) {
        console.log(`Appending education_certificate_${index}:`, edu.certificate.name);
        formData.append(`education_certificate_${index}`, edu.certificate);
      }
    });

    // Append experience certificates
    frontendData.experiences.forEach((exp, index) => {
      if (exp.certificate instanceof File) {
        console.log(`Appending experience_certificate_${index}:`, exp.certificate.name);
        formData.append(`experience_certificate_${index}`, exp.certificate);
      }
    });

    // Append profile picture
    if (frontendData.profile_picture instanceof File) {
      console.log("Appending profile_picture:", frontendData.profile_picture.name);
      formData.append("profile_picture", frontendData.profile_picture);
    }

    // Log FormData entries
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    return formData;
  };

  function isValidUrl(url) {
    if (!url) return true; // Allow empty strings
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Validate required fields
  const validateData = (data) => {
    const errors = {};
    if (!data.first_name?.trim()) errors.first_name = "First name is required";
    if (!data.last_name?.trim()) errors.last_name = "Last name is required";
    if (!data.location?.trim()) errors.location = "Location is required";
    if (!data.skills?.length || data.skills.some((s) => !s.name?.trim())) {
      errors.skills = "At least one valid skill is required";
    }
    if (
      !data.educations?.length ||
      data.educations.some((e) => !e.college?.trim() || !e.degree?.trim() || !e.year?.trim())
    ) {
      errors.educations = "At least one valid education entry is required";
      data.educations.forEach((edu, idx) => {
        if (!edu.college?.trim()) errors[`educations:${idx}:college`] = "College is required";
        if (!edu.degree?.trim()) errors[`educations:${idx}:degree`] = "Degree is required";
        if (!edu.year?.trim()) errors[`educations:${idx}:year`] = "Year is required";
      });
    }
    if (
      !data.experiences?.length ||
      data.experiences.some((e) => !e.company?.trim() || !e.role?.trim() || !e.start_date?.trim())
    ) {
      errors.experiences = "At least one valid experience entry is required";
      data.experiences.forEach((exp, idx) => {
        if (!exp.company?.trim()) errors[`experiences:${idx}:company`] = "Company is required";
        if (!exp.role?.trim()) errors[`experiences:${idx}:role`] = "Role is required";
        if (!exp.start_date?.trim()) errors[`experiences:${idx}:start_date`] = "Start date is required";
      });
    }
    if (
      !data.languages?.length ||
      data.languages.some((l) => !l.name?.trim() || !l.proficiency?.trim())
    ) {
      errors.languages = "At least one valid language is required";
      data.languages.forEach((lang, idx) => {
        if (!lang.name?.trim()) errors[`languages:${idx}:name`] = "Language name is required";
        if (!lang.proficiency?.trim()) errors[`languages:${idx}:proficiency`] = "Proficiency is required";
      });
    }
    if (
      !data.portfolios?.length ||
      data.portfolios.some((p) => !p.title?.trim() || !p.project_link?.trim())
    ) {
      errors.portfolios = "At least one valid portfolio is required";
      data.portfolios.forEach((pf, idx) => {
        if (!pf.title?.trim()) errors[`portfolios:${idx}:title`] = "Project title is required";
        if (!pf.project_link?.trim()) errors[`portfolios:${idx}:project_link`] = "Project link is required";
      });
    }
    if (data.social_links) {
      const socialKeys = [
        "github_url",
        "linkedin_url",
        "twitter_url",
        "facebook_url",
        "instagram_url",
      ];
      socialKeys.forEach((key) => {
        const value = data.social_links[key];
        if (value && !isValidUrl(value)) {
          errors[`social_links.${key}`] = "Please enter a valid URL.";
        }
      });
    }
    console.log("Validating editData:", data);
    return errors;
  };

  const handleSave = async () => {
    if (!profileId || !editData) {
      toast.error("Profile data is missing.");
      return;
    }
    setErrors(null);
    setFieldErrors({});

    // Validate data
    const validationErrors = validateData(editData);
    if (Object.keys(validationErrors).length) {
      setFieldErrors(validationErrors);
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const formData = mapFrontendToBackend(editData);
      console.log("Sending FormData:", formData);

      const response = await axios.put(
        `http://localhost:8000/api/v1/profiles/freelancer/profile-setup/${profileId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response data:", response.data);
      console.log("Experiences:", response.data.experiences);

      const normalizedResponse = {
        ...response.data,
        educations: (response.data.educations || []).map((edu) => ({
          ...edu,
          id: edu.id || null,
          year: String(edu.year || ""),
          certificate: edu.certificate || null,
        })),
        experiences: (response.data.experiences || []).map((exp) => ({
          ...exp,
          id: exp.id || null,
          certificate: exp.certificate || null,
        })),
        portfolios: (response.data.portfolios || []).map((item) => ({
          ...item,
          id: item.id || null,
        })),
        social_links: response.data.social_links || {
          github_url: "",
          linkedin_url: "",
          twitter_url: "",
          facebook_url: "",
          instagram_url: "",
        },
      };
      setProfileData(normalizedResponse);
      setEditData(normalizedResponse);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err);
      console.log("Raw backend errors:", err.response?.data);
      if (err.response?.data) {
        const backendErrors = {};
        Object.keys(err.response.data).forEach((key) => {
          if (Array.isArray(err.response.data[key])) {
            err.response.data[key].forEach((item, index) => {
              if (typeof item === "object" && item !== null) {
                Object.entries(item).forEach(([subKey, value]) => {
                  backendErrors[`${key}:${index}:${subKey}`] = Array.isArray(value) ? value[0] : value;
                });
              } else {
                backendErrors[`${key}:${index}`] = item;
              }
            });
          } else if (typeof err.response.data[key] === "object" && err.response.data[key] !== null) {
            Object.entries(err.response.data[key]).forEach(([subKey, value]) => {
              backendErrors[`${key}:${subKey}`] = Array.isArray(value) ? value[0] : value;
            });
          } else {
            backendErrors[key] = err.response.data[key];
          }
        });
        console.log("Backend validation errors:", backendErrors);
        setFieldErrors(backendErrors);
        setErrors("Failed to update profile. Please check the errors.");
        toast.error("Failed to update profile. Please check the errors.");
      } else {
        setErrors("Something went wrong. Please try again.");
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
    setErrors(null);
    setFieldErrors({});
  };

  const firstLetter = profileData?.first_name?.charAt(0)?.toUpperCase() || "F";

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
            onArrayAdd={handleArrayAdd}
            onArrayRemove={handleArrayRemove}
            onEdit={() => setIsEditing(true)}
            onSave={handleSave}
            onCancel={handleCancel}
            errors={errors}
            fieldErrors={fieldErrors}
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
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigationItems={navigationItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="lg:ml-64">
        <Header
          activeSection={activeSection}
          setSidebarOpen={setSidebarOpen}
          profileData={profileData}
          firstLetter={firstLetter}
        />
        <main className="p-6">{getCurrentSectionContent()}</main>
      </div>
    </div>
  );
};

export default FreelancerDashboard;