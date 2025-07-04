import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Briefcase,
  GraduationCap,
  Star,
  Shield,
  CheckCircle,
  MapPin,
  Calendar,
  X,
  Save,
  Edit3,
  Plus,
  Trash2,
  FileText,
  ExternalLink,
  Mail,
  Phone,
  Video,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  AlertCircle,
  Loader2,
} from "lucide-react";

// API Configuration
const API_BASE_URL = "http://localhost:8000/api/v1/profiles/freelancer/profile-setup";

// Utility functions
const getAuthToken = () => {
  return localStorage.getItem('access') || sessionStorage.getItem('authtoken');
};

const createApiHeaders = (isMultipart = false) => {
  const token = getAuthToken();
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

// API service functions
const apiService = {
  async getProfile() {
    try {
      const response = await axios.get(`${API_BASE_URL}/me/`, {
        headers: createApiHeaders(),
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data || error.message };
    }
  },

  async updateProfile(formData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/me/`, formData, {
        headers: createApiHeaders(true),
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data || error.message };
    }
  },

  async createProfile(formData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/`, formData, {
        headers: createApiHeaders(true),
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data || error.message };
    }
  }
};

// Notification component
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-500/20 border-red-500/30' : 'bg-green-500/20 border-green-500/30';
  const textColor = type === 'error' ? 'text-red-300' : 'text-green-300';
  const Icon = type === 'error' ? AlertCircle : CheckCircle;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${bgColor} ${textColor} flex items-center gap-2 min-w-[300px]`}>
      <Icon size={20} />
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-white/50 hover:text-white">
        <X size={16} />
      </button>
    </div>
  );
};

// Loading component
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-lg rounded-3xl border border-white/10 p-8 text-center">
    <div className="flex items-center justify-center gap-3 mb-4">
      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      <span className="text-white text-lg font-medium">{message}</span>
    </div>
  </div>
);

// Reusable EditableField Component
const EditableField = ({
  label,
  value,
  field,
  type = "text",
  options = null,
  isTextarea = false,
  isEditing,
  onChange,
  error,
  required = false,
}) => {
  if (!isEditing) {
    return (
      <div>
        <label className="text-white/70 text-sm">{label}</label>
        <p className="text-white font-medium mt-1">
          {type === "currency"
            ? `$${parseInt(value || 0).toLocaleString()}`
            : value || "N/A"}
        </p>
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
    );
  }

  if (options) {
    return (
      <div>
        <label className="text-white/70 text-sm mb-2 block">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <select
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        >
          <option value="" className="bg-gray-800">
            Select...
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-gray-800">
              {option}
            </option>
          ))}
        </select>
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
    );
  }

  if (isTextarea) {
    return (
      <div>
        <label className="text-white/70 text-sm mb-2 block">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <textarea
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          rows={3}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
        />
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <label className="text-white/70 text-sm mb-2 block">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

const mapFrontendToBackend = (frontendData) => ({
  first_name: frontendData.first_name || '',
  last_name: frontendData.last_name || '',
  about: frontendData.about || '',
  country: frontendData.country || '',
  location: frontendData.location || '',
  age: frontendData.age || null,
  is_available: typeof frontendData.is_available === 'boolean' ? frontendData.is_available : false,
  profile_picture: frontendData.profile_picture || null,
  skills: (frontendData.skills || []).map(skill => ({
    id: skill.id,
    name: skill.name
  })),
  educations: (frontendData.educations || []).map(edu => ({
    college: edu.college || '',
    degree: edu.degree || '',
    start_year: Number(edu.start_year) || null,
    end_year: Number(edu.end_year) || null,
    certificate: edu.certificate || null,
  })),
  experiences: (frontendData.experiences || []).map(exp => ({
    role: exp.role || '',
    company: exp.company || '',
    start_date: exp.start_date || '',
    end_date: exp.ongoing ? null : exp.end_date,
    ongoing: typeof exp.ongoing === 'boolean' ? exp.ongoing : false,
    description: exp.description || '',
    certificate: exp.certificate || null,
  })),
  languages: (frontendData.languages || []).map(lang => ({
    name: lang.name || '',
    proficiency: lang.proficiency || '',
  })),
  portfolios: (frontendData.portfolios || []).map(item => ({
    title: item.title || '',
    description: item.description || '',
    project_link: item.project_link || '',
  })),
  social_links: {
    github_url: frontendData.social_links?.github_url || '',
    linkedin_url: frontendData.social_links?.linkedin_url || '',
    twitter_url: frontendData.social_links?.twitter_url || '',
    facebook_url: frontendData.social_links?.facebook_url || '',
    instagram_url: frontendData.social_links?.instagram_url || '',
  },
  verification: {
    email_verified: frontendData.verification?.email_verified || false,
    phone_verified: frontendData.verification?.phone_verified || false,
    id_verified: frontendData.verification?.id_verified || false,
    video_verified: frontendData.verification?.video_verified || false,
  },
});

const mapBackendToFrontend = (data) => ({
  id: data.id,
  first_name: data.first_name || '',
  last_name: data.last_name || '',
  about: data.about || '',
  country: data.country || '',
  location: data.location || '',
  age: data.age || '',
  is_available: data.is_available,
  profile_picture: data.profile_picture || null,
  skills: data.skills_output || [],
  educations: data.educations_output || [],
  experiences: data.experiences_output || [],
  languages: data.languages_output || [],
  portfolios: data.portfolios_output || [],
  verification: data.verification_output || {},
  social_links: data.social_links_output || {}
  // Add social_links if you have social_links_output in your API
});


// Main ProfileSection Component
const ProfileSection = () => {
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [certificateFiles, setCertificateFiles] = useState({});
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  // Initialize profile data
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const { data, error } = await apiService.getProfile();

    if (data) {
      const mapped = mapBackendToFrontend(data);
      setProfileData(mapped);
      setEditData(mapped);
      console.log("ProfileData:", mapped);
    } else {
      setNotification({
        type: 'error',
        message: 'Failed to load profile data'
      });
    }
    setLoading(false);
  };


  const handleInputChange = (field, value) => {
    setEditData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }

      if (field.includes(':')) {
        const [arrayName, indexStr, fieldName] = field.split(':');
        const index = parseInt(indexStr);
        const newArray = [...(prev[arrayName] || [])];

        if (fieldName === 'certificate' && value instanceof File) {
          const fileKey = `${arrayName}_certificate_${index}`;
          setCertificateFiles(prev => ({
            ...prev,
            [fileKey]: value
          }));
          newArray[index] = { ...newArray[index], certificate: value };
        } else {
          newArray[index] = { ...newArray[index], [fieldName]: value };
        }

        return {
          ...prev,
          [arrayName]: newArray
        };
      }

      if (field === 'profile_picture' && value instanceof File) {
        setProfilePictureFile(value);
      }

      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleArrayAdd = (arrayName, newItem) => {
    setEditData(prev => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] || []), newItem]
    }));
  };

  const handleArrayRemove = (arrayName, index) => {
    setEditData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const prepareFormData = () => {
    // Map frontend data to backend format
    const backendData = mapFrontendToBackend(editData);
    const formData = new FormData();

    // Basic fields
    formData.append('first_name', backendData.first_name);
    formData.append('last_name', backendData.last_name);
    formData.append('about', backendData.about);
    formData.append('age', backendData.age);
    formData.append('location', backendData.location);
    formData.append('country', backendData.country);
    formData.append('is_available', backendData.is_available);

    // Profile picture
    if (profilePictureFile) {
      formData.append('profile_picture', profilePictureFile);
    }

    // JSON fields
    formData.append('skills_input', JSON.stringify(backendData.skills));
    formData.append('educations_input', JSON.stringify(
      backendData.educations.map(({ certificate, ...rest }) => rest)
    ));
    formData.append('experiences_input', JSON.stringify(
      backendData.experiences.map(({ certificate, ...rest }) => rest)
    ));
    formData.append('languages_input', JSON.stringify(backendData.languages));
    formData.append('portfolios_input', JSON.stringify(backendData.portfolios));
    formData.append('social_links_input', JSON.stringify(backendData.social_links));
    formData.append('verification_input', JSON.stringify(backendData.verification));

    // Certificate files
    backendData.educations.forEach((edu, idx) => {
      if (edu.certificate && typeof edu.certificate !== 'string') {
        formData.append(`education_certificate_${idx}`, edu.certificate);
      }
    });
    backendData.experiences.forEach((exp, idx) => {
      if (exp.certificate && typeof exp.certificate !== 'string') {
        formData.append(`experience_certificate_${idx}`, exp.certificate);
      }
    });

    return formData;
  };


  const handleSave = async () => {
    setSaving(true);
    setFieldErrors({});

    try {
      const formData = prepareFormData();
      const { data, error } = profileData
        ? await apiService.updateProfile(formData)
        : await apiService.createProfile(formData);

      if (data) {
        setProfileData(data);
        setEditData(data);
        setIsEditing(false);
        setCertificateFiles({});
        setProfilePictureFile(null);
        setNotification({
          type: 'success',
          message: 'Profile saved successfully!'
        });
      } else {
        if (error && typeof error === 'object') {
          setFieldErrors(error);
        }
        setNotification({
          type: 'error',
          message: 'Failed to save profile. Please check the form for errors.'
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'An unexpected error occurred while saving.',
        consoleError: error.message || error.toString()
      });
    } finally {
      setSaving(false);
    }
  };


  const handleEdit = () => {
    setIsEditing(true);
    setFieldErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profileData || {});
    setFieldErrors({});
    setCertificateFiles({});
    setProfilePictureFile(null);
  };

  const getAvailabilityStatus = () => {
    const data = isEditing ? editData : profileData;
    return data?.is_available ? (
      <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-green-300 text-xs sm:text-sm font-medium">
          Available
        </span>
      </div>
    ) : (
      <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded-full">
        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
        <span className="text-red-300 text-xs sm:text-sm font-medium">Busy</span>
      </div>
    );
  };

  const renderCertificate = (certificate, idx, fieldPrefix) => {
    const fileKey = `${fieldPrefix}_certificate_${idx}`;
    const currentFile = certificateFiles[fileKey];

    if (isEditing) {
      return (
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setCertificateFiles(prev => ({
                  ...prev,
                  [fileKey]: file
                }));
                handleInputChange(`${fieldPrefix}:${idx}:certificate`, file);
              }
            }}
            className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm file:bg-purple-600/30 file:border-0 file:text-white file:px-3 file:py-1 file:rounded file:cursor-pointer file:hover:bg-purple-600/40"
          />
          {(currentFile || certificate) && (
            <button
              onClick={() => {
                setCertificateFiles(prev => {
                  const newFiles = { ...prev };
                  delete newFiles[fileKey];
                  return newFiles;
                });
                handleInputChange(`${fieldPrefix}:${idx}:certificate`, null);
              }}
              className="bg-red-600/30 hover:bg-red-600/40 px-3 py-1 rounded text-red-300 text-xs flex items-center gap-1"
            >
              <Trash2 size={12} /> Remove
            </button>
          )}
          {(currentFile || certificate) && (
            <span className="text-white/60 text-xs">
              Selected: {currentFile?.name || (typeof certificate === 'string' ? certificate.split('/').pop() : 'None')}
            </span>
          )}
        </div>
      );
    }

    return certificate && typeof certificate === 'string' ? (
      <a
        href={certificate}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 rounded-lg text-purple-300 text-xs font-medium border border-purple-500/30 transition-all duration-200"
      >
        <FileText size={14} /> View Certificate
      </a>
    ) : (
      <span className="text-white/60 text-sm">No certificate</span>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading Profile..." />;
  }

  if (!profileData && !isEditing) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-lg rounded-3xl border border-white/10 p-8 text-center">
        <User size={40} className="text-white/30 mx-auto mb-4" />
        <h4 className="text-xl font-semibold text-white mb-2">
          No Profile Found
        </h4>
        <p className="text-white/50 text-sm mb-4">
          Create your freelancer profile to get started.
        </p>
        <button
          onClick={() => {
            setIsEditing(true);
            setEditData({
              first_name: '',
              last_name: '',
              about: '',
              age: '',
              location: '',
              country: '',
              is_available: true,
              skills: [],
              educations: [],
              experiences: [],
              languages: [],
              portfolios: [],
              social_links: {},
              verifications: {}
            });
          }}
          className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 px-4 py-2 rounded-lg text-white transition-all duration-200 border border-purple-500/30"
        >
          Create Profile
        </button>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "portfolio", label: "Portfolio", icon: Star },
    { id: "verification", label: "Verification", icon: Shield },
    { id: "availability", label: "Availability", icon: CheckCircle },
    { id: "skills", label: "Skills", icon: null },
    { id: "languages", label: "Languages", icon: null },
  ];

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-3xl border border-white/10 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <div className="flex items-start gap-4 w-full sm:w-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              {profilePictureFile ? (
                <img
                  src={URL.createObjectURL(profilePictureFile)}
                  alt="Profile Preview"
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : profileData?.profile_picture ? (
                <img
                  src={profileData.profile_picture}
                  alt="Profile"
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <User size={24} className="text-white" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {(isEditing ? editData.first_name : profileData?.first_name) || 'Your Name'} {(isEditing ? editData.last_name : profileData?.last_name) || ''}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="flex items-center gap-1 text-white/70">
                  <MapPin size={14} />
                  <span className="text-sm">
                    {(isEditing ? editData.location : profileData?.location) || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-white/70">
                  <Calendar size={14} />
                  <span className="text-sm">
                    {(isEditing ? editData.age : profileData?.age) || "N/A"} years old
                  </span>
                </div>
                {getAvailabilityStatus()}
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-gray-300 hover:text-white transition-all duration-200 text-sm bg-gray-700/30 hover:bg-gray-700/40 disabled:opacity-50"
                >
                  <X size={12} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 px-3 py-2 rounded-xl text-white transition-all duration-200 border border-purple-500/30 text-sm disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Save size={12} />
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 px-3 py-2 rounded-xl text-white transition-all duration-200 border border-purple-500/30 text-sm"
              >
                <Edit3 size={12} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">About</h3>
          <EditableField
            label="About"
            value={isEditing ? editData.about : profileData?.about}
            field="about"
            isTextarea={true}
            isEditing={isEditing}
            onChange={handleInputChange}
            error={fieldErrors.about}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-2 bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 text-sm ${activeTab === id
              ? "bg-gradient-to-r from-purple-600/40 to-blue-600/40 text-white border border-purple-500/30"
              : "text-white/60 hover:text-white/80 hover:bg-white/5"
              }`}
          >
            {Icon && <Icon size={12} />}
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="bg-black/20 backdrop-blur-lg rounded-3xl border border-white/10 p-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField
                  label="First Name"
                  value={isEditing ? editData.first_name : profileData?.first_name}
                  field="first_name"
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  error={fieldErrors.first_name}
                  required={true}
                />
                <EditableField
                  label="Last Name"
                  value={isEditing ? editData.last_name : profileData?.last_name}
                  field="last_name"
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  error={fieldErrors.last_name}
                  required={true}
                />
                <EditableField
                  label="Location"
                  value={isEditing ? editData.location : profileData?.location}
                  field="location"
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  error={fieldErrors.location}
                />
                <EditableField
                  label="Country"
                  value={isEditing ? editData.country : profileData?.country}
                  field="country"
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  error={fieldErrors.country}
                />
                <EditableField
                  label="Age"
                  value={isEditing ? editData.age : profileData?.age}
                  field="age"
                  type="number"
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  error={fieldErrors.age}
                />
              </div>

              {isEditing && (
                <div>
                  <label className="text-white/70 text-sm mb-2 block">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setProfilePictureFile(file);
                        handleInputChange("profile_picture", file);
                      }
                    }}
                    className="w-full bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm file:bg-purple-600/30 file:border-0 file:text-white file:px-3 file:py-1 file:rounded file:cursor-pointer file:hover:bg-purple-600/40"
                  />
                  {fieldErrors.profile_picture && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.profile_picture}</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Social Links</h3>
              <div className="space-y-3">
                {[
                  { key: "github_url", label: "GitHub", icon: Github },
                  { key: "linkedin_url", label: "LinkedIn", icon: Linkedin },
                  { key: "twitter_url", label: "Twitter", icon: Twitter },
                  { key: "facebook_url", label: "Facebook", icon: Facebook },
                  { key: "instagram_url", label: "Instagram", icon: Instagram },
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center gap-2">
                    <Icon size={16} className="text-white/50 flex-shrink-0" />
                    <div className="flex-1">
                      <EditableField
                        label={label}
                        value={
                          isEditing
                            ? editData.social_links?.[key]
                            : profileData?.social_links?.[key]
                        }
                        field={`social_links.${key}`}
                        type="url"
                        isEditing={isEditing}
                        onChange={handleInputChange}
                        error={fieldErrors[`social_links.${key}`]}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Skills Section */}
        {activeTab === "skills" && (
          <div className="space-y-3">
            {(isEditing ? editData.skills : profileData?.skills || []).map((skill, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <EditableField
                  label={`Skill #${idx + 1}`}
                  value={skill.name}
                  field={`skills:${idx}:name`}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  error={fieldErrors[`skills.${idx}.name`]}
                />
                {isEditing && (
                  <button
                    onClick={() => handleArrayRemove("skills", idx)}
                    className="text-red-400 hover:text-red-600"
                    title="Remove Skill"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (editData.skills?.length === 0) && (
              <p className="text-white/50 text-sm">No skills added yet.</p>
            )}
          </div>
        )}


        {/* Languages Section */}
        {activeTab === "languages" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Languages</h3>
              {isEditing && (
                <button
                  onClick={() => handleArrayAdd("languages", { name: "", proficiency: "" })}
                  className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-3 py-1 rounded-lg text-green-300 text-sm transition-colors"
                >
                  <Plus size={12} />
                  Add Language
                </button>
              )}
            </div>
            <div className="space-y-3">
              {(isEditing ? editData.languages : profileData?.languages || []).map((lang, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <EditableField
                    label="Language"
                    value={lang.name}
                    field={`languages:${idx}:name`}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    error={fieldErrors[`languages.${idx}.name`]}
                  />
                  <EditableField
                    label="Proficiency"
                    value={lang.proficiency}
                    field={`languages:${idx}:proficiency`}
                    options={["beginner", "intermediate", "advanced", "native"]}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    error={fieldErrors[`languages.${idx}.proficiency`]}
                  />
                  {isEditing && (
                    <button
                      onClick={() => handleArrayRemove("languages", idx)}
                      className="text-red-400 hover:text-red-600"
                      title="Remove Language"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (editData.languages?.length === 0) && (
                <p className="text-white/50 text-sm">No languages added yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Education Section */}
        {activeTab === "education" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Education</h3>
              {isEditing && (
                <button
                  onClick={() =>
                    handleArrayAdd("educations", {
                      college: "",
                      degree: "",
                      start_year: "",
                      end_year: "",
                      certificate: null,
                    })
                  }
                  className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-3 py-1 rounded-lg text-green-300 text-sm transition-colors"
                >
                  <Plus size={12} />
                  Add Education
                </button>
              )}
            </div>
            <div className="space-y-4">
              {(isEditing ? editData.educations : profileData?.educations || []).map((edu, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                  <EditableField
                    label="College"
                    value={edu.college}
                    field={`educations:${idx}:college`}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    error={fieldErrors[`educations.${idx}.college`]}
                  />
                  <EditableField
                    label="Degree"
                    value={edu.degree}
                    field={`educations:${idx}:degree`}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    error={fieldErrors[`educations.${idx}.degree`]}
                  />
                  <EditableField
                    label="Start Year"
                    value={edu.start_year}
                    field={`educations:${idx}:start_year`}
                    type="number"
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    error={fieldErrors[`educations.${idx}.start_year`]}
                  />
                  <EditableField
                    label="End Year"
                    value={edu.end_year}
                    field={`educations:${idx}:end_year`}
                    type="number"
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    error={fieldErrors[`educations.${idx}.end_year`]}
                  />
                  <div>
                    <label className="text-white/70 text-sm mb-1 block">Certificate</label>
                    {renderCertificate(edu.certificate, idx, "education_certificate")}
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => handleArrayRemove("educations", idx)}
                      className="text-red-400 hover:text-red-600 mt-2"
                      title="Remove Education"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (editData.educations?.length === 0) && (
                <p className="text-white/50 text-sm">No education records yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {activeTab === "experience" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Experience</h3>
              {isEditing && (
                <button
                  onClick={() =>
                    handleArrayAdd("experiences", {
                      role: "",
                      company: "",
                      start_date: "",
                      end_date: "",
                      ongoing: false,
                      description: "",
                      certificate: null,
                    })
                  }
                  className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-3 py-1 rounded-lg text-green-300 text-sm transition-colors"
                >
                  <Plus size={12} />
                  Add Experience
                </button>
              )}
            </div>
            <div className="space-y-4">
              {(isEditing ? editData.experiences : profileData?.experiences || []).map((exp, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                  <EditableField
                    label="Role"
                    value={exp.role}
                    field={`experiences:${idx}:role`}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    error={fieldErrors[`experiences.${idx}.role`]}
                  />
                  <EditableField
                    label="Company"
                    value={exp.company}
                    field={`experiences:${idx}:company`}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    error={fieldErrors[`experiences.${idx}.company`]}
                  />
                  <EditableField
                    label="Start Date"
                    value={exp.start_date}
                    field={`experiences:${idx}:start_date`}
                    type="date"
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    error={fieldErrors[`experiences.${idx}.start_date`]}
                  />
                  <EditableField
                    label="End Date"
                    value={exp.end_date}
                    field={`experiences:${idx}:end_date`}
                    type="date"
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    error={fieldErrors[`experiences.${idx}.end_date`]}
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-white/70 text-sm">Ongoing</label>
                    <input
                      type="checkbox"
                      checked={exp.ongoing}
                      onChange={(e) =>
                        handleInputChange(`experiences:${idx}:ongoing`, e.target.checked)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <EditableField
                    label="Description"
                    value={exp.description}
                    field={`experiences:${idx}:description`}
                    isTextarea={true}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    error={fieldErrors[`experiences.${idx}.description`]}
                  />
                  <div>
                    <label className="text-white/70 text-sm mb-1 block">Certificate</label>
                    {renderCertificate(exp.certificate, idx, "experience_certificate")}
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => handleArrayRemove("experiences", idx)}
                      className="text-red-400 hover:text-red-600 mt-2"
                      title="Remove Experience"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (editData.experiences?.length === 0) && (
                <p className="text-white/50 text-sm">No experience records yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Portfolio Section */}
        {activeTab === "portfolio" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Portfolio</h3>
              {isEditing && (
                <button
                  onClick={() =>
                    handleArrayAdd("portfolios", {
                      title: "",
                      description: "",
                      project_link: "",
                    })
                  }
                  className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-3 py-1 rounded-lg text-green-300 text-sm transition-colors"
                >
                  <Plus size={12} />
                  Add Project
                </button>
              )}
            </div>
            <div className="space-y-4">
              {(isEditing ? editData.portfolios : profileData?.portfolios || []).map((port, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                  <EditableField
                    label="Title"
                    value={port.title}
                    field={`portfolios:${idx}:title`}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    error={fieldErrors[`portfolios.${idx}.title`]}
                  />
                  <EditableField
                    label="Description"
                    value={port.description}
                    field={`portfolios:${idx}:description`}
                    isTextarea={true}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    error={fieldErrors[`portfolios.${idx}.description`]}
                  />
                  <EditableField
                    label="Project Link"
                    value={port.project_link}
                    field={`portfolios:${idx}:project_link`}
                    type="url"
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    error={fieldErrors[`portfolios.${idx}.project_link`]}
                  />
                  {isEditing && (
                    <button
                      onClick={() => handleArrayRemove("portfolios", idx)}
                      className="text-red-400 hover:text-red-600 mt-2"
                      title="Remove Project"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (editData.portfolios?.length === 0) && (
                <p className="text-white/50 text-sm">No portfolio projects yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Verification Section */}
        {activeTab === "verification" && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Verification</h3>
            <div className="space-y-3">
              {[
                { key: "email_verified", label: "Email Verified", icon: Mail },
                { key: "phone_verified", label: "Phone Verified", icon: Phone },
                { key: "id_verified", label: "ID Verified", icon: Shield },
                { key: "video_verified", label: "Video Verified", icon: Video },
              ].map(({ key, label, icon: Icon }) => (
                <div key={key} className="flex items-center gap-2">
                  <Icon size={16} className="text-white/50" />
                  <label className="text-white/70 text-sm flex-1">{label}</label>
                  <input
                    type="checkbox"
                    checked={
                      isEditing
                        ? editData.verifications?.[key] || false
                        : profileData?.verifications?.[key] || false
                    }
                    onChange={(e) =>
                      handleInputChange(`verifications.${key}`, e.target.checked)
                    }
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Availability Section */}
        {activeTab === "availability" && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Availability</h3>
            <div className="flex items-center gap-3">
              <label className="text-white/70 text-sm">Available for work?</label>
              <input
                type="checkbox"
                checked={isEditing ? editData.is_available : profileData?.is_available}
                onChange={(e) => handleInputChange("is_available", e.target.checked)}
                disabled={!isEditing}
              />
              {getAvailabilityStatus()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;






































// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import {
//   User,
//   Briefcase,
//   GraduationCap,
//   Star,
//   Shield,
//   CheckCircle,
//   MapPin,
//   Calendar,
//   X,
//   Save,
//   Edit3,
//   Plus,
//   Trash2,
//   FileText,
//   ExternalLink,
//   Mail,
//   Phone,
//   Video,
//   Globe,
//   Github,
//   Linkedin,
//   Twitter,
//   Facebook,
//   Instagram,
// } from "lucide-react";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Reusable EditableField Component
// const EditableField = ({
//   label,
//   value,
//   field,
//   type = "text",
//   options = null,
//   isTextarea = false,
//   isEditing,
//   onChange,
//   error,
// }) => {
//   if (!isEditing) {
//     return (
//       <div>
//         <label className="text-white/70 text-sm">{label}</label>
//         <p className="text-white font-medium mt-1">
//           {type === "currency"
//             ? `$${parseInt(value || 0).toLocaleString()}`
//             : value || "N/A"}
//         </p>
//         {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
//       </div>
//     );
//   }
//   if (options) {
//     return (
//       <div>
//         <label className="text-white/70 text-sm mb-2 block">{label}</label>
//         <select
//           value={value || ""}
//           onChange={(e) => onChange(field, e.target.value)}
//           className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
//         >
//           <option value="" className="bg-gray-800">
//             Select...
//           </option>
//           {options.map((option) => (
//             <option key={option} value={option} className="bg-gray-800">
//               {option}
//             </option>
//           ))}
//         </select>
//         {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
//       </div>
//     );
//   }
//   if (isTextarea) {
//     return (
//       <div>
//         <label className="text-white/70 text-sm mb-2 block">{label}</label>
//         <textarea
//           value={value || ""}
//           onChange={(e) => onChange(field, e.target.value)}
//           rows={3}
//           className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
//         />
//         {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
//       </div>
//     );
//   }
//   return (
//     <div>
//       <label className="text-white/70 text-sm mb-2 block">{label}</label>
//       <input
//         type={type}
//         value={value || ""}
//         onChange={(e) => onChange(field, e.target.value)}
//         className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
//       />
//       {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
//     </div>
//   );
// };

// // Reusable EditableArrayField Component
// const EditableArrayField = ({
//   label,
//   field,
//   items,
//   newValue,
//   setNewValue,
//   placeholder,
//   isEditing,
//   onArrayAdd,
//   onArrayRemove,
//   isLanguage = false,
//   newProficiency,
//   setNewProficiency,
//   error,
// }) => {
//   if (!isEditing) {
//     return (
//       <div>
//         <label className="text-white/70 text-sm">{label}</label>
//         <div className="flex flex-wrap gap-2 mt-2">
//           {(items || []).map((item, index) => (
//             <span
//               key={index}
//               className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30"
//             >
//               {isLanguage ? `${item.name} (${item.proficiency})` : item.name}
//             </span>
//           ))}
//           {(items || []).length === 0 && (
//             <span className="text-white/50 text-sm">No entries added</span>
//           )}
//         </div>
//         {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
//       </div>
//     );
//   }
//   return (
//     <div>
//       <label className="text-white/70 text-sm mb-2 block">{label}</label>
//       <div className="space-y-3">
//         <div className="flex flex-wrap gap-2">
//           {(items || []).map((item, index) => (
//             <div
//               key={index}
//               className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30 flex items-center space-x-2"
//             >
//               <span>
//                 {isLanguage ? `${item.name} (${item.proficiency})` : item.name}
//               </span>
//               <button
//                 onClick={() => onArrayRemove(field, index)}
//                 className="text-red-300 hover:text-red-200"
//               >
//                 <X size={14} />
//               </button>
//             </div>
//           ))}
//         </div>
//         <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
//           <input
//             type="text"
//             value={newValue}
//             onChange={(e) => setNewValue(e.target.value)}
//             placeholder={placeholder}
//             className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
//             onKeyPress={(e) => {
//               if (
//                 e.key === "Enter" &&
//                 (!isLanguage || newProficiency)
//               ) {
//                 onArrayAdd(
//                   field,
//                   isLanguage
//                     ? { id: null, name: newValue, proficiency: newProficiency }
//                     : { id: null, name: newValue },
//                   setNewValue
//                 );
//                 if (isLanguage) setNewProficiency("");
//               }
//             }}
//           />
//           {isLanguage && (
//             <input
//               type="text"
//               value={newProficiency}
//               onChange={(e) => setNewProficiency(e.target.value)}
//               placeholder="Proficiency"
//               className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
//             />
//           )}
//           <button
//             onClick={() => {
//               if (!isLanguage || newProficiency) {
//                 onArrayAdd(
//                   field,
//                   isLanguage
//                     ? { id: null, name: newValue, proficiency: newProficiency }
//                     : { id: null, name: newValue },
//                   setNewValue
//                 );
//                 if (isLanguage) setNewProficiency("");
//               }
//             }}
//             className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 px-3 py-2 rounded-lg transition-colors"
//           >
//             <Plus size={16} />
//           </button>
//         </div>
//         {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
//       </div>
//     </div>
//   );
// };

// // Reusable Certificate Field
// const renderCertificate = (
//   certificate,
//   idx,
//   fieldPrefix,
//   isEditing,
//   onInputChange,
//   fieldErrors
// ) => {
//   if (isEditing) {
//     return (
//       <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
//         <input
//           type="file"
//           accept=".pdf,.doc,.docx"
//           onChange={(e) =>
//             onInputChange(
//               `${fieldPrefix}:${idx}:certificate`,
//               e.target.files[0] || null
//             )
//           }
//           className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base file:bg-purple-600/30 file:border-0 file:text-white file:px-3 file:py-1 file:rounded file:cursor-pointer file:hover:bg-purple-600/40"
//         />
//         {certificate && (
//           <button
//             onClick={() =>
//               onInputChange(`${fieldPrefix}:${idx}:certificate`, null)
//             }
//             className="bg-red-600/30 hover:bg-red-600/40 px-3 py-1 rounded text-red-300 text-xs sm:text-sm flex items-center gap-1"
//           >
//             <Trash2 size={12} /> Remove
//           </button>
//         )}
//         {certificate && (
//           <span className="text-white/60 text-xs sm:text-sm">
//             Selected:{" "}
//             {typeof certificate === "string"
//               ? certificate.split("/").pop()
//               : certificate?.name || "None"}
//           </span>
//         )}
//         {fieldErrors[`${fieldPrefix}:${idx}:certificate`] && (
//           <p className="text-red-400 text-xs mt-1">
//             {fieldErrors[`${fieldPrefix}:${idx}:certificate`]}
//           </p>
//         )}
//       </div>
//     );
//   }
//   return certificate && typeof certificate === "string" ? (
//     <a
//       href={certificate}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 rounded-lg text-purple-300 text-xs sm:text-sm font-medium border border-purple-500/30 transition-all duration-200"
//     >
//       <FileText size={14} /> View Certificate
//     </a>
//   ) : (
//     <span className="text-white/60 text-sm">No certificate</span>
//   );
// };

// // Main ProfileSection Component
// const ProfileSection = ({
//   profileData = {},
//   editData = {},
//   isEditing,
//   onInputChange,
//   onArrayAdd,
//   onArrayRemove,
//   onEdit,
//   onCancel,
//   onSave,
//   fieldErrors,
// }) => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [loading, setLoading] = useState(true);
//   const [newSkill, setNewSkill] = useState("");
//   const [newLanguage, setNewLanguage] = useState("");
//   const [newProficiency, setNewProficiency] = useState("");

//   useEffect(() => {
//     if (profileData) setLoading(false);
//   }, [profileData]);

//   const getAvailabilityStatus = () => {
//     const data = isEditing ? editData : profileData;
//     return data?.is_available ? (
//       <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
//         <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//         <span className="text-green-300 text-xs sm:text-sm font-medium">
//           Available
//         </span>
//       </div>
//     ) : (
//       <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded-full">
//         <div className="w-2 h-2 bg-red-400 rounded-full"></div>
//         <span className="text-red-300 text-xs sm:text-sm font-medium">Busy</span>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-lg rounded-3xl border border-white/10 p-4 sm:p-6 md:p-8 text-center">
//         <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto mb-4"></div>
//         <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">
//           Loading Profile...
//         </h4>
//         <p className="text-white/50 text-sm">
//           Please wait while we fetch your data.
//         </p>
//       </div>
//     );
//   }

//   if (!profileData) {
//     return (
//       <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-lg rounded-3xl border border-white/10 p-4 sm:p-6 md:p-8 text-center">
//         <User size={40} className="text-white/30 mx-auto mb-4" />
//         <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">
//           Profile Not Found
//         </h4>
//         <p className="text-white/50 text-sm">Unable to load profile data.</p>
//       </div>
//     );
//   }

//   const tabs = [
//     { id: "overview", label: "Overview", icon: User },
//     { id: "experience", label: "Experience", icon: Briefcase },
//     { id: "education", label: "Education", icon: GraduationCap },
//     { id: "portfolio", label: "Portfolio", icon: Star },
//     { id: "verification", label: "Verification", icon: Shield },
//     { id: "availability", label: "Availability", icon: CheckCircle },
//     { id: "skills", label: "Skills", icon: null },
//     { id: "languages", label: "Languages", icon: null },
//   ];

//   return (
//     <div className="space-y-4 sm:space-y-6">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
//       {/* Header */}
//       <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-3xl border border-white/10 p-4 sm:p-6">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
//           <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
//             <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
//               {isEditing && editData.profile_picture instanceof File ? (
//                 <img
//                   src={URL.createObjectURL(editData.profile_picture)}
//                   alt="Profile Preview"
//                   className="w-full h-full rounded-2xl object-cover"
//                 />
//               ) : profileData.profile_picture ? (
//                 <img
//                   src={profileData.profile_picture}
//                   alt="Profile"
//                   className="w-full h-full rounded-2xl object-cover"
//                 />
//               ) : (
//                 <User size={24} className="text-white" />
//               )}
//             </div>
//             <div className="flex-1">
//               <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
//                 {profileData.first_name} {profileData.last_name}
//               </h1>
//               <div className="flex flex-wrap items-center gap-2 mb-3">
//                 <div className="flex items-center gap-0.5 text-white/70">
//                   <MapPin size={14} />
//                   <span className="text-xs sm:text-sm">
//                     {profileData.location || "N/A"}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-0.5 text-white/70">
//                   <Calendar size={14} />
//                   <span className="text-xs sm:text-sm">
//                     {profileData.age || "N/A"} years old
//                   </span>
//                 </div>
//                 {getAvailabilityStatus()}
//               </div>
//             </div>
//           </div>
//           <div className="flex gap-2 w-full sm:w-auto justify-end">
//             {isEditing ? (
//               <>
//                 <button
//                   onClick={onCancel}
//                   className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl text-gray-300 hover:text-white transition-all duration-200 text-xs sm:text-sm bg-gray-700/30 hover:bg-gray-700/40"
//                 >
//                   <X size={12} />
//                   Cancel
//                 </button>
//                 <button
//                   onClick={onSave}
//                   className="flex items-center gap-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 px-2 sm:px-3 py-1.5 rounded-xl text-white transition-all duration-200 border border-purple-500/30 text-xs sm:text-sm"
//                 >
//                   <Save size={12} />
//                   Save Changes
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={onEdit}
//                 className="flex items-center gap-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 px-2 sm:px-3 py-1.5 rounded-xl text-white transition-all duration-200 border border-purple-500/30 text-xs sm:text-sm"
//                 aria-label="Edit Profile"
//               >
//                 <Edit3 size={12} />
//                 Edit Profile
//               </button>
//             )}
//           </div>
//         </div>

//         {/* About Section */}
//         <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
//           <h3 className="text-base sm:text-lg font-semibold text-white mb-3">
//             About
//           </h3>
//           <EditableField
//             label="About"
//             value={isEditing ? editData.about : profileData.about}
//             field="about"
//             isTextarea={true}
//             isEditing={isEditing}
//             onChange={onInputChange}
//             error={fieldErrors.about}
//           />
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="flex flex-wrap gap-1 sm:gap-2 p-2 bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10">
//         {tabs.map(({ id, label, icon: Icon }) => (
//           <button
//             key={id}
//             onClick={() => setActiveTab(id)}
//             className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all duration-200 text-xs sm:text-sm ${activeTab === id
//               ? "bg-gradient-to-r from-purple-600/40 to-blue-600/40 text-white border border-purple-500/30"
//               : "text-white/60 hover:text-white/80 hover:bg-white/5"
//               }`}
//             aria-label={label}
//           >
//             {Icon && <Icon size={12} />}
//             <span className="font-medium">{label}</span>
//           </button>
//         ))}
//       </div>

//       {/* Content Sections */}
//       <div className="bg-black/20 backdrop-blur-lg rounded-3xl border border-white/10 p-4 sm:p-6">
//         {activeTab === "overview" && (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-1">
//               <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
//                 <div className="text-center mb-6">
//                   <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
//                     {isEditing && editData.profile_picture instanceof File ? (
//                       <img
//                         src={URL.createObjectURL(editData.profile_picture)}
//                         alt="Profile Preview"
//                         className="w-full h-full rounded-full object-cover"
//                       />
//                     ) : profileData.profile_picture ? (
//                       <img
//                         src={profileData.profile_picture}
//                         alt="Profile"
//                         className="w-full h-full rounded-full object-cover"
//                       />
//                     ) : (
//                       <User size={32} className="text-white" />
//                     )}
//                   </div>
//                   <h4 className="text-xl font-semibold text-white">
//                     {profileData.first_name} {profileData.last_name}
//                   </h4>
//                   <p className="text-white/70 text-sm">
//                     {profileData.location || "N/A"}
//                   </p>
//                   <div className="flex items-center justify-center space-x-1 mt-2">
//                     {getAvailabilityStatus()}
//                   </div>
//                 </div>
//                 <div className="space-y-3">
//                   <div className="flex items-center space-x-2">
//                     <Calendar size={16} className="text-white/50" />
//                     <span className="text-white text-sm">
//                       {profileData.age || "N/A"} years old
//                     </span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Globe size={16} className="text-white/50" />
//                     <span className="text-white text-sm">
//                       {(profileData.languages || [])
//                         .map((lang) => lang.name)
//                         .join(", ") || "N/A"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="lg:col-span-2">
//               <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
//                 <h5 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
//                   <User size={20} />
//                   <span>Personal Information</span>
//                 </h5>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <EditableField
//                     label="First Name"
//                     value={isEditing ? editData.first_name : profileData.first_name}
//                     field="first_name"
//                     isEditing={isEditing}
//                     onChange={onInputChange}
//                     error={fieldErrors.first_name}
//                   />
//                   <EditableField
//                     label="Last Name"
//                     value={isEditing ? editData.last_name : profileData.last_name}
//                     field="last_name"
//                     isEditing={isEditing}
//                     onChange={onInputChange}
//                     error={fieldErrors.last_name}
//                   />
//                   <EditableField
//                     label="Location"
//                     value={isEditing ? editData.location : profileData.location}
//                     field="location"
//                     isEditing={isEditing}
//                     onChange={onInputChange}
//                     error={fieldErrors.location}
//                   />
//                   <EditableField
//                     label="Age"
//                     value={isEditing ? editData.age : profileData.age}
//                     field="age"
//                     type="number"
//                     isEditing={isEditing}
//                     onChange={onInputChange}
//                     error={fieldErrors.age}
//                   />
//                   {isEditing && (
//                     <div className="md:col-span-2">
//                       <label className="text-white/70 text-sm mb-2 block">
//                         Profile Picture
//                       </label>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) =>
//                           onInputChange("profile_picture", e.target.files[0])
//                         }
//                         className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base file:bg-purple-600/30 file:border-0 file:text-white file:px-3 file:py-1 file:rounded file:cursor-pointer file:hover:bg-purple-600/40"
//                       />
//                       {fieldErrors.profile_picture && (
//                         <p className="text-red-400 text-xs mt-1">
//                           {fieldErrors.profile_picture}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//                 <div className="mt-6">
//                   <h5 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
//                     <Globe size={20} />
//                     <span>Social Links</span>
//                   </h5>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {[
//                       { key: "github_url", label: "GitHub", icon: Github },
//                       { key: "linkedin_url", label: "LinkedIn", icon: Linkedin },
//                       { key: "twitter_url", label: "Twitter", icon: Twitter },
//                       { key: "facebook_url", label: "Facebook", icon: Facebook },
//                       { key: "instagram_url", label: "Instagram", icon: Instagram },
//                     ].map(({ key, label, icon: Icon }) => (
//                       <div key={key} className="flex items-center gap-2">
//                         <Icon size={16} className="text-white/50" />
//                         <EditableField
//                           label={label}
//                           value={
//                             isEditing
//                               ? editData.social_links?.[key]
//                               : profileData.social_links?.[key]
//                           }
//                           field={`social_links.${key}`}
//                           type="url"
//                           isEditing={isEditing}
//                           onChange={onInputChange}
//                           error={fieldErrors[`social_links.${key}`]}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === "education" && (
//           <div>
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
//                 <GraduationCap size={16} className="text-green-400" />
//                 Education
//               </h3>
//               {isEditing && (
//                 <button
//                   onClick={() =>
//                     onArrayAdd("educations", {
//                       id: null,
//                       college: "",
//                       degree: "",
//                       year: "",
//                       certificate: null,
//                     })
//                   }
//                   className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-2 sm:px-3 py-1 rounded-lg text-right text-green-300 text-xs sm:text-sm transition-colors"
//                 >
//                   <Plus size={12} />
//                   Add Education
//                 </button>
//               )}
//             </div>
//             <div className="space-y-4">
//               {(isEditing ? editData.educations : profileData.educations || [])
//                 .length === 0 ? (
//                 <div className="text-center text-white/50 py-4">
//                   No education entries added yet.
//                 </div>
//               ) : (
//                 (isEditing ? editData.educations : profileData.educations || []).map(
//                   (edu, idx) => (
//                     <div
//                       key={edu.id || idx}
//                       className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2"
//                     >
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                         <EditableField
//                           label="Institution"
//                           value={edu.college}
//                           field={`educations:${idx}:college`}
//                           isEditing={isEditing}
//                           onChange={onInputChange}
//                           error={fieldErrors[`educations:${idx}:college`]}
//                         />
//                         <EditableField
//                           label="Degree"
//                           value={edu.degree}
//                           field={`educations:${idx}:degree`}
//                           isEditing={isEditing}
//                           onChange={onInputChange}
//                           error={fieldErrors[`educations:${idx}:degree`]}
//                         />
//                         <EditableField
//                           label="Year"
//                           value={edu.year}
//                           field={`educations:${idx}:year`}
//                           isEditing={isEditing}
//                           onChange={onInputChange}
//                           error={fieldErrors[`educations:${idx}:year`]}
//                         />
//                         <div className="md:col-span-2">
//                           <div className="flex flex-col gap-2">
//                             <label className="text-white/70 text-sm mb-1 block">
//                               Certificate
//                             </label>
//                             {renderCertificate(
//                               edu.certificate,
//                               idx,
//                               "educations",
//                               isEditing,
//                               onInputChange,
//                               fieldErrors
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                       {isEditing && (
//                         <button
//                           onClick={() => onArrayRemove("educations", idx)}
//                           className="bg-red-600/30 hover:bg-red-600/40 px-3 py-1 rounded text-red-300 text-xs sm:text-sm flex items-center gap-1 mt-2 ml-auto"
//                         >
//                           <Trash2 size={12} /> Remove
//                         </button>
//                       )}
//                     </div>
//                   )
//                 )
//               )}
//             </div>
//           </div>
//         )}

//         {activeTab === "experience" && (
//           <div>
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
//                 <Briefcase className="text-yellow-400" size={16} />
//                 Experience
//               </h3>
//               {isEditing && (
//                 <button
//                   onClick={() =>
//                     onArrayAdd("experiences", {
//                       id: null,
//                       company: "",
//                       role: "",
//                       start_date: "",
//                       end_date: "",
//                       description: "",
//                       certificate: null,
//                     })
//                   }
//                   className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-2 sm:px-3 py-1 rounded-lg text-right text-green-300 text-xs sm:text-sm transition-colors"
//                 >
//                   <Plus size={12} />
//                   Add Experience
//                 </button>
//               )}
//             </div>
//             <div className="space-y-4">
//               {(isEditing ? editData.experiences : profileData.experiences || [])
//                 .length === 0 ? (
//                 <div className="text-center text-white/50 py-4">
//                   No experience entries added yet.
//                 </div>
//               ) : (
//                 (isEditing ? editData.experiences : profileData.experiences || []).map(
//                   (exp, idx) => (
//                     <div
//                       key={exp.id || idx}
//                       className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2"
//                     >
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                         <EditableField
//                           label="Company"
//                           value={exp.company}
//                           field={`experiences:${idx}:company`}
//                           isEditing={isEditing}
//                           onChange={onInputChange}
//                           error={fieldErrors[`experiences:${idx}:company`]}
//                         />
//                         <EditableField
//                           label="Role"
//                           value={exp.role}
//                           field={`experiences:${idx}:role`}
//                           isEditing={isEditing}
//                           onChange={onInputChange}
//                           error={fieldErrors[`experiences:${idx}:role`]}
//                         />
//                         <EditableField
//                           label="Start Date (YYYY-MM-DD)"
//                           value={exp.start_date}
//                           field={`experiences:${idx}:start_date`}
//                           isEditing={isEditing}
//                           onChange={onInputChange}
//                           error={fieldErrors[`experiences:${idx}:start_date`]}
//                         />
//                         <EditableField
//                           label="End Date (YYYY-MM-DD)"
//                           value={exp.end_date}
//                           field={`experiences:${idx}:end_date`}
//                           isEditing={isEditing}
//                           onChange={onInputChange}
//                           error={fieldErrors[`experiences:${idx}:end_date`]}
//                         />
//                         <div className="md:col-span-2">
//                           <EditableField
//                             label="Description"
//                             value={exp.description}
//                             field={`experiences:${idx}:description`}
//                             isTextarea={true}
//                             isEditing={isEditing}
//                             onChange={onInputChange}
//                             error={fieldErrors[`experiences:${idx}:description`]}
//                           />
//                         </div>
//                         <div className="md:col-span-2">
//                           <div className="flex flex-col gap-2">
//                             <label className="text-white/70 text-sm mb-1 block">
//                               Certificate
//                             </label>
//                             {renderCertificate(
//                               exp.certificate,
//                               idx,
//                               "experiences",
//                               isEditing,
//                               onInputChange,
//                               fieldErrors
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                       {isEditing && (
//                         <button
//                           onClick={() => onArrayRemove("experiences", idx)}
//                           className="bg-red-600/30 hover:bg-red-600/40 px-3 py-1 rounded text-red-300 text-xs sm:text-sm flex items-center gap-1 mt-2 ml-auto"
//                         >
//                           <Trash2 size={12} /> Remove
//                         </button>
//                       )}
//                     </div>
//                   )
//                 )
//               )}
//             </div>
//           </div>
//         )}

//         {activeTab === "portfolio" && (
//           <div>
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
//                 <Star className="text-orange-400" size={16} />
//                 Portfolio
//               </h3>
//               {isEditing && (
//                 <button
//                   onClick={() =>
//                     onArrayAdd("portfolios", {
//                       id: null,
//                       title: "",
//                       description: "",
//                       project_link: "",
//                     })
//                   }
//                   className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-2 sm:px-3 py-1 rounded-lg text-right text-green-300 text-xs sm:text-sm transition-colors"
//                 >
//                   <Plus size={12} />
//                   Add Project
//                 </button>
//               )}
//             </div>
//             <div className="space-y-4">
//               {(isEditing ? editData.portfolios : profileData.portfolios || [])
//                 .length === 0 ? (
//                 <div className="text-center text-white/50 py-4">
//                   No portfolio projects added yet.
//                 </div>
//               ) : (
//                 (isEditing ? editData.portfolios : profileData.portfolios || []).map(
//                   (pf, idx) => (
//                     <div
//                       key={pf.id || idx}
//                       className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2"
//                     >
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                         <EditableField
//                           label="Project Title"
//                           value={pf.title}
//                           field={`portfolios:${idx}:title`}
//                           isEditing={isEditing}
//                           onChange={onInputChange}
//                           error={fieldErrors[`portfolios:${idx}:title`]}
//                         />
//                         <EditableField
//                           label="Project Link"
//                           value={pf.project_link}
//                           field={`portfolios:${idx}:project_link`}
//                           type="url"
//                           isEditing={isEditing}
//                           onChange={onInputChange}
//                           error={fieldErrors[`portfolios:${idx}:project_link`]}
//                         />
//                         <div className="md:col-span-2">
//                           <EditableField
//                             label="Description"
//                             value={pf.description}
//                             field={`portfolios:${idx}:description`}
//                             isTextarea={true}
//                             isEditing={isEditing}
//                             onChange={onInputChange}
//                             error={fieldErrors[`portfolios:${idx}:description`]}
//                           />
//                         </div>
//                       </div>
//                       {isEditing && (
//                         <button
//                           onClick={() => onArrayRemove("portfolios", idx)}
//                           className="bg-red-600/30 hover:bg-red-600/40 px-3 py-1 rounded text-red-300 text-xs sm:text-sm flex items-center gap-1 mt-2 ml-auto"
//                         >
//                           <Trash2 size={12} /> Remove
//                         </button>
//                       )}
//                     </div>
//                   )
//                 )
//               )}
//             </div>
//           </div>
//         )}

//         {activeTab === "skills" && (
//           <div>
//             <EditableArrayField
//               label="Skills"
//               field="skills"
//               items={isEditing ? editData.skills : profileData.skills}
//               newValue={newSkill}
//               setNewValue={setNewSkill}
//               placeholder="Add skill"
//               isEditing={isEditing}
//               onArrayAdd={onArrayAdd}
//               onArrayRemove={onArrayRemove}
//               error={fieldErrors.skills}
//             />
//           </div>
//         )}

//         {activeTab === "languages" && (
//           <div>
//             <EditableArrayField
//               label="Languages"
//               field="languages"
//               items={isEditing ? editData.languages : profileData.languages}
//               newValue={newLanguage}
//               setNewValue={setNewLanguage}
//               newProficiency={newProficiency}
//               setNewProficiency={setNewProficiency}
//               placeholder="Add language"
//               isEditing={isEditing}
//               onArrayAdd={onArrayAdd}
//               onArrayRemove={onArrayRemove}
//               isLanguage={true}
//               error={fieldErrors.languages}
//             />
//           </div>
//         )}

//         {activeTab === "verification" && (
//           <div>
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
//                 <Shield className="text-green-400" size={16} />
//                 Verification
//               </h3>
//             </div>
//             <div className="space-y-4">
//               {[
//                 {
//                   key: "verifications.email_verified",
//                   label: "Email Verification",
//                   icon: Mail,
//                 },
//                 {
//                   key: "verifications.phone_verified",
//                   label: "Phone Verification",
//                   icon: Phone,
//                 },
//                 {
//                   key: "verifications.id_verified",
//                   label: "ID Verification",
//                   icon: Shield,
//                 },
//                 {
//                   key: "verifications.video_verified",
//                   label: "Video Verification",
//                   icon: Video,
//                 },
//               ].map(({ key, label, icon: Icon }) => (
//                 <div
//                   key={key}
//                   className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between"
//                 >
//                   <div className="flex items-center gap-2">
//                     <Icon
//                       size={16}
//                       className={
//                         isEditing
//                           ? editData.verifications?.[key.split(".")[1]]
//                             ? "text-green-400"
//                             : "text-gray-400"
//                           : profileData.verifications?.[key.split(".")[1]]
//                             ? "text-green-400"
//                             : "text-gray-400"
//                       }
//                     />
//                     <span className="text-white text-sm sm:text-base">
//                       {label}
//                     </span>
//                   </div>
//                   {isEditing ? (
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={
//                           editData.verifications?.[key.split(".")[1]] || false
//                         }
//                         onChange={() =>
//                           onInputChange(
//                             key,
//                             !editData.verifications?.[key.split(".")[1]]
//                           )
//                         }
//                         className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-300 rounded"
//                       />
//                       <span className="text-white/80 text-sm">
//                         {editData.verifications?.[key.split(".")[1]]
//                           ? "Verified"
//                           : "Not Verified"}
//                       </span>
//                     </label>
//                   ) : (
//                     <span
//                       className={`text-sm sm:text-base ${profileData.verifications?.[key.split(".")[1]]
//                         ? "text-green-300"
//                         : "text-red-300"
//                         }`}
//                     >
//                       {profileData.verifications?.[key.split(".")[1]]
//                         ? "Verified"
//                         : "Not Verified"}
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {activeTab === "availability" && (
//           <div>
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
//                 <CheckCircle className="text-blue-400" size={16} />
//                 Availability
//               </h3>
//             </div>
//             <div className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center gap-4">
//               <div
//                 className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${isEditing
//                   ? editData.is_available
//                     ? "bg-green-500/20 border-2 border-green-500"
//                     : "bg-red-500/20 border-2 border-red-500"
//                   : profileData.is_available
//                     ? "bg-green-500/20 border-2 border-green-500"
//                     : "bg-red-500/20 border-2 border-red-500"
//                   }`}
//               >
//                 <CheckCircle
//                   size={24}
//                   className={
//                     isEditing
//                       ? editData.is_available
//                         ? "text-green-500"
//                         : "text-red-500"
//                       : profileData.is_available
//                         ? "text-green-500"
//                         : "text-red-500"
//                   }
//                 />
//               </div>
//               <h4 className="text-base sm:text-lg font-semibold text-white">
//                 {isEditing
//                   ? editData.is_available
//                     ? "Available for Work"
//                     : "Not Available"
//                   : profileData.is_available
//                     ? "Available for Work"
//                     : "Not Available"}
//               </h4>
//               <p className="text-white/70 text-sm sm:text-base text-center">
//                 {isEditing
//                   ? editData.is_available
//                     ? "You are currently available to take on new projects"
//                     : "You are not currently available for new projects"
//                   : profileData.is_available
//                     ? "You are currently available to take on new projects"
//                     : "You are not currently available for new projects"}
//               </p>
//               {isEditing && (
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={editData.is_available}
//                     onChange={() =>
//                       onInputChange("is_available", !editData.is_available)
//                     }
//                     className="sr-only peer"
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
//                   <span className="ml-3 text-sm font-medium text-white">
//                     Available for work
//                   </span>
//                 </label>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// ProfileSection.propTypes = {
//   profileData: PropTypes.object,
//   editData: PropTypes.object,
//   isEditing: PropTypes.bool,
//   onInputChange: PropTypes.func,
//   onArrayAdd: PropTypes.func,
//   onArrayRemove: PropTypes.func,
//   onEdit: PropTypes.func,
//   onCancel: PropTypes.func,
//   onSave: PropTypes.func,
//   fieldErrors: PropTypes.object,
// };

// export default ProfileSection;
















// import React, { useState, useEffect } from 'react';
// import {
//   User, Edit3, Save, X, Plus, Trash2, MapPin, Calendar, Briefcase, GraduationCap, Globe, Star,
//   Award, Mail, Phone, Video, Shield, ExternalLink, FileText, CheckCircle
// } from 'lucide-react';


// const EditableField = ({
//   label,
//   value,
//   field,
//   type = "text",
//   options = null,
//   isTextarea = false,
//   isEditing,
//   onChange,
// }) => {
//   if (!isEditing) {
//     return (
//       <div>
//         <label className="text-white/70 text-sm">{label}</label>
//         <p className="text-white font-medium mt-1">
//           {type === "currency" ? `$${parseInt(value || 0).toLocaleString()}` : value}
//         </p>
//       </div>
//     );
//   }
//   if (options) {
//     return (
//       <div>
//         <label className="text-white/70 text-sm mb-2 block">{label}</label>
//         <select
//           value={value}
//           onChange={(e) => onChange(field, e.target.value)}
//           className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
//         >
//           {options.map((option) => (
//             <option key={option} value={option} className="bg-gray-800">
//               {option}
//             </option>
//           ))}
//         </select>
//       </div>
//     );
//   }
//   if (isTextarea) {
//     return (
//       <div>
//         <label className="text-white/70 text-sm mb-2 block">{label}</label>
//         <textarea
//           value={value}
//           onChange={(e) => onChange(field, e.target.value)}
//           rows={3}
//           className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
//         />
//       </div>
//     );
//   }
//   return (
//     <div>
//       <label className="text-white/70 text-sm mb-2 block">{label}</label>
//       <input
//         type={type}
//         value={value}
//         onChange={(e) => onChange(field, e.target.value)}
//         className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
//       />
//     </div>
//   );
// };

// const EditableArrayField = ({
//   label,
//   field,
//   items,
//   newValue,
//   setNewValue,
//   placeholder,
//   isEditing,
//   onArrayAdd,
//   onArrayRemove,
// }) => {
//   if (!isEditing) {
//     return (
//       <div>
//         <label className="text-white/70 text-sm">{label}</label>
//         <div className="flex flex-wrap gap-2 mt-2">
//           {(items || []).map((item, index) => (
//             <span
//               key={index}
//               className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30"
//             >
//               {item}
//             </span>
//           ))}
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div>
//       <label className="text-white/70 text-sm mb-2 block">{label}</label>
//       <div className="space-y-3">
//         <div className="flex flex-wrap gap-2">
//           {(items || []).map((item, index) => (
//             <div
//               key={index}
//               className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30 flex items-center space-x-2"
//             >
//               <span>{item}</span>
//               <button
//                 onClick={() => onArrayRemove(field, index)}
//                 className="text-red-300 hover:text-red-200"
//               >
//                 ✕
//               </button>
//             </div>
//           ))}
//         </div>
//         <div className="flex space-x-2">
//           <input
//             type="text"
//             value={newValue}
//             onChange={(e) => setNewValue(e.target.value)}
//             placeholder={placeholder}
//             className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
//             onKeyPress={(e) => {
//               if (e.key === "Enter") {
//                 onArrayAdd(field, newValue, setNewValue);
//               }
//             }}
//           />
//           <button
//             onClick={() => {
//               onArrayAdd(field, newValue, setNewValue);
//             }}
//             className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 px-3 py-2 rounded-lg transition-colors"
//           >
//             <Plus size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ProfileSection = ({
//   profileData = {},
//   editData = {},
//   isEditing,
//   onInputChange,
//   onArrayAdd,
//   onArrayRemove,
//   onEdit,
//   onCancel,
//   onSave,
// }) => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [loading, setLoading] = useState(true);
//   const [newSkill, setNewSkill] = useState('');
//   const [newLanguage, setNewLanguage] = useState('');

//   useEffect(() => {
//     if (profileData) setLoading(false);
//   }, [profileData]);


//   const getAvailabilityStatus = () => {
//     const data = isEditing ? editData : profileData;
//     return data?.is_available ? (
//       <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
//         <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//         <span className="text-green-300 text-xs sm:text-sm font-medium">Available</span>
//       </div>
//     ) : (
//       <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded-full">
//         <div className="w-2 h-2 bg-red-400 rounded-full"></div>
//         <span className="text-red-300 text-xs sm:text-sm font-medium">Busy</span>
//       </div>
//     );
//   };


//   if (loading) {
//     return (
//       <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-lg rounded-3xl border border-white/10 p-4 sm:p-6 md:p-8 text-center">
//         <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto mb-4"></div>
//         <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">Loading Profile...</h4>
//         <p className="text-white/50 text-sm">Please wait while we fetch your data.</p>
//       </div>
//     );
//   }

//   if (!profileData) {
//     return (
//       <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-lg rounded-3xl border border-white/10 p-4 sm:p-6 md:p-8 text-center">
//         <User size={40} className="text-white/30 mx-auto mb-4" />
//         <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">Profile Not Found</h4>
//         <p className="text-white/50 text-sm">Unable to load profile data.</p>
//       </div>
//     );
//   }

//   const tabs = [
//     { id: 'overview', label: 'Overview', icon: User },
//     { id: 'experience', label: 'Experience', icon: Briefcase },
//     { id: 'education', label: 'Education', icon: GraduationCap },
//     { id: 'portfolio', label: 'Portfolio', icon: Star },
//     { id: 'verification', label: 'Verification', icon: Shield },
//     { id: 'availability', label: 'Availability', icon: CheckCircle }
//   ];

//   return (
//     <div className="space-y-4 sm:space-y-6">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-3xl border border-white/10 p-4 sm:p-6">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
//           <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
//             <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
//               {profileData.profile_picture ? (
//                 <img
//                   src={profileData.profile_picture}
//                   alt="Profile"
//                   className="w-full h-full rounded-2xl object-cover"
//                 />
//               ) : (
//                 <User size={24} className="text-white" />
//               )}
//             </div>
//             <div className="flex-1">
//               <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
//                 {profileData.first_name} {profileData.last_name}
//               </h1>
//               <div className="flex flex-wrap items-center gap-2 mb-3">
//                 <div className="flex items-center gap-0.5 text-white/70">
//                   <MapPin size={14} />
//                   <span className="text-xs sm:text-sm">{profileData.location}</span>
//                 </div>
//                 <div className="flex items-center gap-0.5 text-white/70">
//                   <Calendar size={14} />
//                   <span className="text-xs sm:text-sm">{profileData.age} years old</span>
//                 </div>
//                 {getAvailabilityStatus()}
//               </div>
//             </div>
//           </div>
//           <div className="flex gap-2 w-full sm:w-auto justify-end">
//             {isEditing ? (
//               <>
//                 <button
//                   onClick={onCancel}
//                   className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl text-gray-300 hover:text-white transition-all duration-200 text-xs sm:text-sm bg-gray-700/30 hover:bg-gray-700/40"
//                 >
//                   <X size={12} />
//                   Cancel
//                 </button>
//                 <button
//                   onClick={onSave}
//                   className="flex items-center gap-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 px-2 sm:px-3 py-1.5 rounded-xl text-white transition-all duration-200 border border-purple-500/30 text-xs sm:text-sm"
//                 >
//                   <Save size={12} />
//                   Save Changes
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={onEdit}
//                 className="flex items-center gap-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 px-2 sm:px-3 py-1.5 rounded-xl text-white transition-all duration-200 border border-purple-500/30 text-xs sm:text-sm"
//               >
//                 <Edit3 size={12} />
//                 Edit Profile
//               </button>
//             )}
//           </div>
//         </div>
//         {/* About Section */}
//         <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
//           <h3 className="text-base sm:text-lg font-semibold text-white mb-3">About</h3>
//           {isEditing ? (
//             <textarea
//               value={editData.about || ''}
//               onChange={e => onInputChange('about', e.target.value)}
//               className="w-full bg-white/10 text-white rounded-xl px-3 sm:px-4 py-3 border border-white/20 focus:border-purple-500/50 focus:outline-none resize-none text-sm sm:text-base"
//               rows={4}
//               placeholder="Tell us about yourself..."
//             />
//           ) : (
//             <p className="text-white/80 leading-relaxed text-sm sm:text-base">
//               {profileData.about || 'No description available.'}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="flex flex-wrap gap-1 sm:gap-2 p-2 bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10">
//         {tabs.map(({ id, label, icon: Icon }) => (
//           <button
//             key={id}
//             onClick={() => setActiveTab(id)}
//             className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all duration-200 text-xs sm:text-sm ${activeTab === id
//               ? 'bg-gradient-to-r from-purple-600/40 to-blue-600/40 text-white border border-purple-500/30'
//               : 'text-white/60 hover:text-white/80 hover:bg-white/5'
//               }`}
//           >
//             <Icon size={12} />
//             <span className="font-medium">{label}</span>
//           </button>
//         ))}
//       </div>

//       {/* Content Sections */}
//       <div className="bg-black/20 backdrop-blur-lg rounded-3xl border border-white/10 p-4 sm:p-6">
//         {activeTab === 'overview' && (
//           <div className="space-y-6">
//             {/* Skills */}
//             <div>
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
//                   <Star className="text-purple-400" size={16} />
//                   Skills
//                 </h3>
//                 {isEditing && (
//                   <button
//                     onClick={() => onArrayAdd('skills', { id: Date.now(), name: '' })}
//                     className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-2 sm:px-3 py-1 rounded-lg text-green-300 text-xs sm:text-sm transition-colors"
//                   >
//                     <Plus size={12} />
//                     Add Skill
//                   </button>
//                 )}
//               </div>
//               <div className="flex flex-wrap gap-2 sm:gap-3">
//                 {isEditing ? (
//                   <div className="w-full space-y-2">
//                     {editData.skills?.map((skill, idx) => (
//                       <div key={skill.id || idx} className="flex gap-2 items-center">
//                         <input
//                           value={skill.name}
//                           onChange={e => onInputChange(`skills.${idx}.name`, e.target.value)}
//                           className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
//                           placeholder="Skill name"
//                         />
//                         <button
//                           onClick={() => onArrayRemove('skills', idx)}
//                           className="bg-red-500/20 hover:bg-red-500/30 p-2 rounded-lg text-red-300 transition-colors"
//                         >
//                           <Trash2 size={12} />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   profileData.skills?.map((skill, idx) => (
//                     <span
//                       key={skill.id || idx}
//                       className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full text-purple-300 text-xs sm:text-sm font-medium border border-purple-500/30"
//                     >
//                       {skill.name}
//                     </span>
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* Languages */}
//             <div>
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
//                   <Globe className="text-blue-400" size={16} />
//                   Languages
//                 </h3>
//                 {isEditing && (
//                   <button
//                     onClick={() => onArrayAdd('languages', { id: Date.now(), name: '', proficiency: '' })}
//                     className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-2 sm:px-3 py-1 rounded-lg text-green-300 text-xs sm:text-sm transition-colors"
//                   >
//                     <Plus size={12} />
//                     Add Language
//                   </button>
//                 )}
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
//                 {isEditing ? (
//                   <div className="flex flex-col gap-2 w-full">
//                     {editData.languages?.map((lang, idx) => (
//                       <div key={lang.id || idx} className="flex flex-col sm:flex-row gap-2 items-center p-3">
//                         <input
//                           value={lang.name}
//                           onChange={e => onInputChange(`languages.${idx}.name`, e.target.value)}
//                           className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
//                           placeholder="Language"
//                         />
//                         <input
//                           value={lang.proficiency}
//                           onChange={e => onInputChange(`languages.${idx}.proficiency`, e.target.value)}
//                           className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
//                           placeholder="Proficiency"
//                         />
//                         <button
//                           onClick={() => onArrayRemove('languages', idx)}
//                           className="bg-red-500/20 hover:bg-red-500/30 p-2 rounded-lg text-red-300 transition-colors"
//                         >
//                           <Trash2 size={12} />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="flex flex-col gap-2">
//                     {profileData.languages?.map((lang, idx) => (
//                       <span
//                         key={lang.id || idx}
//                         className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500/20 rounded-full text-blue-300 text-xs sm:text-sm font-medium border border-blue-500/30"
//                       >
//                         {lang.name} ({lang.proficiency})
//                       </span>
//                     ))}
//                   </div>
//                 )}

//               </div>
//             </div>
//           </div>
//         )}
//       </div>


//       {activeTab === 'experience' && (
//         <div>
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
//               <Briefcase className="text-yellow-400" size={16} />
//               Experience
//             </h3>
//             {isEditing && (
//               <button
//                 onClick={() => onArrayAdd('experiences', { id: Date.now(), company: '', role: '', start_date: '', end_date: '', description: '', certificate: null })}
//                 className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-2 sm:px-3 py-1 rounded-lg text-green-300 text-xs sm:text-sm transition-colors"
//               >
//                 <Plus size={12} />
//                 Add Experience
//               </button>
//             )}
//           </div>
//           <div className="space-y-4">
//             {isEditing ? (
//               editData.experiences?.map((exp, idx) => (
//                 <div key={exp.id || idx} className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
//                   <input
//                     value={exp.company}
//                     onChange={e => onInputChange(`experiences.${idx}.company`, e.target.value)}
//                     placeholder="Company"
//                     className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
//                   />
//                   <input
//                     value={exp.role}
//                     onChange={e => onInputChange(`experiences.${idx}.role`, e.target.value)}
//                     placeholder="Role"
//                     className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
//                   />
//                   <div className="flex flex-col sm:flex-row gap-2">
//                     <input
//                       value={exp.start_date}
//                       onChange={e => onInputChange(`experiences.${idx}.start_date`, e.target.value)}
//                       placeholder="Start Date (YYYY-MM-DD)"
//                       className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
//                     />
//                     <input
//                       value={exp.end_date}
//                       onChange={e => onInputChange(`experiences.${idx}.end_date`, e.target.value)}
//                       placeholder="End Date (YYYY-MM-DD)"
//                       className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
//                     />
//                   </div>
//                   <textarea
//                     value={exp.description}
//                     onChange={e => onInputChange(`experiences.${idx}.description`, e.target.value)}
//                     placeholder="Description"
//                     className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none resize-none text-sm sm:text-base"
//                     rows={2}
//                   />
//                   <div className="flex flex-col gap-2">
//                     <label className="text-white/80 text-sm sm:text-base">Certificate</label>
//                     <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
//                       <input
//                         type="file"
//                         accept=".pdf,.doc,.docx"
//                         onChange={e => onInputChange(`experiences.${idx}.certificate`, e.target.files[0])}
//                         className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base file:bg-purple-600/30 file:border-0 file:text-white file:px-3 file:py-1 file:rounded file:cursor-pointer file:hover:bg-purple-600/40"
//                       />
//                       {exp.certificate && (
//                         <button
//                           onClick={() => onInputChange(`experiences.${idx}.certificate`, null)}
//                           className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-xs sm:text-sm flex items-center gap-1"
//                         >
//                           <Trash2 size={12} /> Remove Certificate
//                         </button>
//                       )}
//                     </div>
//                     {exp.certificate && (
//                       <span className="text-white/60 text-xs sm:text-sm">
//                         Selected: {typeof exp.certificate === 'string' ? exp.certificate.split('/').pop() : exp.certificate.name}
//                       </span>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => onArrayRemove('experiences', idx)}
//                     className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-xs sm:text-sm self-end"
//                   >
//                     <Trash2 size={12} /> Remove
//                   </button>
//                 </div>
//               ))
//             ) : (
//               profileData.experiences?.map((exp, idx) => (
//                 <div key={exp.id || idx} className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                     <div className="flex items-center gap 2">
//                       <Briefcase size={16} className="text-yellow-400" />
//                       <span className="text-white font-medium text-sm sm:text-base">{exp.role}</span>
//                     </div>
//                     <span className="text-white/70 text-xs sm:text-sm">at</span>
//                     <span className="text-white text-sm sm:text-base">{exp.company}</span>
//                   </div>
//                   <div className="text-white/60 text-xs sm:text-sm">
//                     {exp.start_date} – {exp.end_date || 'Present'}
//                   </div>
//                   <div className="text-white/80 text-sm sm:text-base">{exp.description}</div>
//                   {exp.certificate && (
//                     <a
//                       href={exp.certificate}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 rounded-lg text-purple-300 text-xs sm:text-sm font-medium border border-purple-500/30 transition-all duration-200"
//                     >
//                       <FileText size={14} /> View Certificate
//                     </a>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       )}


//       {activeTab === 'education' && (
//         <div>
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
//               <GraduationCap className="text-green-400" size={16} />
//               Education
//             </h3>
//             {isEditing && (
//               <button
//                 onClick={() => onArrayAdd('educations', { id: Date.now(), college: '', degree: '', year: '', certificate: null })}
//                 className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-2 sm:px-3 py-1 rounded-lg text-green-300 text-xs sm:text-sm transition-colors"
//               >
//                 <Plus size={12} />
//                 Add Education
//               </button>
//             )}
//           </div>
//           <div className="space-y-4">
//             {isEditing ? (
//               editData.educations?.map((edu, idx) => (
//                 <div key={edu.id || idx} className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
//                   <input
//                     value={edu.college}
//                     onChange={e => onInputChange(`educations.${idx}.college`, e.target.value)}
//                     placeholder="College"
//                     className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
//                   />
//                   <input
//                     value={edu.degree}
//                     onChange={e => onInputChange(`educations.${idx}.degree`, e.target.value)}
//                     placeholder="Degree"
//                     className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
//                   />
//                   <input
//                     value={edu.year}
//                     onChange={e => onInputChange(`educations.${idx}.year`, e.target.value)}
//                     placeholder="Year"
//                     className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
//                   />
//                   <div className="flex flex-col gap-2">
//                     <label className="text-white/80 text-sm sm:text-base">Certificate</label>
//                     <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
//                       <input
//                         type="file"
//                         accept=".pdf,.doc,.docx"
//                         onChange={e => onInputChange(`educations.${idx}.certificate`, e.target.files[0])}
//                         className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base file:bg-purple-600/30 file:border-0 file:text-white file:px-3 file:py-1 file:rounded file:cursor-pointer file:hover:bg-purple-600/40"
//                       />
//                       {edu.certificate && (
//                         <button
//                           onClick={() => onInputChange(`educations.${idx}.certificate`, null)}
//                           className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-xs sm:text-sm flex items-center gap-1"
//                         >
//                           <Trash2 size={12} /> Remove Certificate
//                         </button>
//                       )}
//                     </div>
//                     {edu.certificate && (
//                       <span className="text-white/60 text-xs sm:text-sm">
//                         Selected: {typeof edu.certificate === 'string' ? edu.certificate.split('/').pop() : edu.certificate.name}
//                       </span>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => onArrayRemove('educations', idx)}
//                     className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-xs sm:text-sm self-end"
//                   >
//                     <Trash2 size={12} /> Remove
//                   </button>
//                 </div>
//               ))
//             ) : (
//               profileData.educations?.map((edu, idx) => (
//                 <div key={edu.id || idx} className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                     <div className="flex items-center gap-2">
//                       <GraduationCap size={16} className="text-green-400" />
//                       <span className="text-white font-medium text-sm sm:text-base">{edu.degree}</span>
//                     </div>
//                     <span className="text-white/70 text-xs sm:text-sm">at</span>
//                     <span className="text-white text-sm sm:text-base">{edu.college}</span>
//                   </div>
//                   <div className="text-white/60 text-xs sm:text-sm">{edu.year}</div>
//                   {edu.certificate && (
//                     <a
//                       href={edu.certificate}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 rounded-lg text-purple-300 text-xs sm:text-sm font-medium border border-purple-500/30 transition-all duration-200"
//                     >
//                       <FileText size={14} /> View Certificate
//                     </a>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       )}


//       {activeTab === 'portfolio' && (
//         <div>
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
//               <Award className="text-orange-400" size={16} />
//               Portfolio
//             </h3>
//             {isEditing && (
//               <button
//                 onClick={() => onArrayAdd('portfolios', { id: Date.now(), title: '', description: '', project_link: '' })}
//                 className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-2 sm:px-3 py-1 rounded-lg text-green-300 text-xs sm:text-sm transition-colors"
//               >
//                 <Plus size={12} />
//                 Add Project
//               </button>
//             )}
//           </div>
//           <div className="space-y-4">
//             {isEditing ? (
//               editData.portfolios?.map((pf, idx) => (
//                 <div key={pf.id || idx} className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
//                   <input
//                     value={pf.title}
//                     onChange={e => onInputChange(`portfolios.${idx}.title`, e.target.value)}
//                     placeholder="Project Title"
//                     className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
//                   />
//                   <textarea
//                     value={pf.description}
//                     onChange={e => onInputChange('portfolios', idx, { ...pf, description: e.target.value })}
//                     placeholder="Description"
//                     className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none resize-none text-sm sm:text-base"
//                     rows={2}
//                   />
//                   <input
//                     value={pf.project_link}
//                     onChange={e => onInputChange('portfolios', idx, { ...pf, project_link: e.target.value })}
//                     placeholder="Project Link"
//                     className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
//                   />
//                   <button
//                     onClick={() => onArrayRemove('portfolios', idx)}
//                     className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-xs sm:text-sm self-end"
//                   >
//                     <Trash2 size={12} /> Remove
//                   </button>
//                 </div>
//               ))
//             ) : (
//               profileData.portfolios?.map((pf, idx) => (
//                 <div key={pf.id || idx} className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                     <div className="flex items-center gap-2">
//                       <Award size={16} className="text-orange-400" />
//                       <span className="text-white font-medium text-sm sm:text-base">{pf.title}</span>
//                     </div>
//                     <a href={pf.project_link} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline flex items-center gap-1 text-sm sm:text-base">
//                       <ExternalLink size={14} /> View
//                     </a>
//                   </div>
//                   <div className="text-white/80 text-sm sm:text-base">{pf.description}</div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       )}

//       {activeTab === 'verification' && (
//         <div>
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
//               <Shield className="text-green-400" size={16} />
//               Verification
//             </h3>
//           </div>
//           <div className="space-y-4">
//             {[
//               { key: 'email_verified', label: 'Email Verification', icon: Mail },
//               { key: 'phone_verified', label: 'Phone Verification', icon: Phone },
//               { key: 'id_verified', label: 'ID Verification', icon: Shield },
//               { key: 'video_verified', label: 'Video Verification', icon: Video }
//             ].map(({ key, label, icon: Icon }) => (
//               <div
//                 key={key}
//                 className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between"
//               >
//                 <div className="flex items-center gap-2">
//                   <Icon size={16} className={editData[key] ? 'text-green-400' : 'text-gray-400'} />
//                   <span className="text-white text-sm sm:text-base">{label}</span>
//                 </div>
//                 {isEditing ? (
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={editData[key] || false}
//                       onChange={() => onInputChange(key, !editData[key])}
//                       className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-300 rounded"
//                     />
//                     <span className="text-white/80 text-sm">{editData[key] ? 'Verified' : 'Not Verified'}</span>
//                   </label>
//                 ) : (
//                   <span
//                     className={`text-sm sm:text-base ${editData[key] ? 'text-green-300' : 'text-red-300'
//                       }`}
//                   >
//                     {editData[key] ? 'Verified' : 'Not Verified'}
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {activeTab === 'availability' && (
//         <div>
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
//               <CheckCircle className="text-blue-400" size={16} />
//               Availability
//             </h3>
//           </div>
//           <div className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center gap-4">
//             <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${editData.is_available ? 'bg-green-500/20 border-2 border-green-500' : 'bg-red-500/20 border-2 border-red-500'}`}>
//               <CheckCircle size={24} className={editData.is_available ? 'text-green-500' : 'text-red-500'} />
//             </div>
//             <h4 className="text-base sm:text-lg font-semibold text-white">
//               {editData.is_available ? 'Available for Work' : 'Not Available'}
//             </h4>
//             <p className="text-white/70 text-sm sm:text-base text-center">
//               {editData.is_available
//                 ? 'You are currently available to take on new projects'
//                 : 'You are not currently available for new projects'
//               }
//             </p>
//             {isEditing && (
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={editData.is_available}
//                   onChange={() => onInputChange('is_available', !editData.is_available)}
//                   className="sr-only peer"
//                 />
//                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
//                 <span className="ml-3 text-sm font-medium text-white">Available for work</span>
//               </label>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileSection;