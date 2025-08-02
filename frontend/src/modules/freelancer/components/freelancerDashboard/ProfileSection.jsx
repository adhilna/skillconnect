import React, { useState, useEffect } from "react";
import { useToast } from "../../../../hooks/useToast";
import {
  User,
  Briefcase,
  GraduationCap,
  Star,
  BookOpen,
  Clock,
  XCircle,
  Award,
  Building2,
  CalendarDays,
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
import api from '../../../../api/api';

// API service functions
const apiService = {
  async getProfile() {
    try {
      const response = await api.get('/api/v1/profiles/freelancer/profile-setup/me/');
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data || error.message };
    }
  },

  async updateProfile(formData) {
    try {
      const response = await api.patch('/api/v1/profiles/freelancer/profile-setup/me/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // formData requires this
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data || error.message };
    }
  },

  async createProfile(formData) {
    try {
      const response = await api.post('/api/v1/profiles/freelancer/profile-setup/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data || error.message };
    }
  }
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
});


// Main ProfileSection Component
const ProfileSection = () => {
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error: showError } = useToast();
  const [fieldErrors, setFieldErrors] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [certificateFiles, setCertificateFiles] = useState({});
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  // Initialize profile data
  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const { data, error: apiError } = await apiService.getProfile();

    if (data) {
      const mapped = mapBackendToFrontend(data);
      setProfileData(mapped);
      setEditData(mapped);
      console.log("ProfileData:", mapped);
    } else {
      console.error('API Error:', apiError);
      showError('Something failed!')
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
        const parts = field.split(':');
        const arrayName = parts[0];
        const index = parseInt(parts[1]);
        const fieldName = parts[2] || "certificate";  // default to certificate
        const newArray = [...(prev[arrayName] || [])];

        if (fieldName === 'certificate' && value instanceof File) {
          const fileKey = `${arrayName}_${index}`; // ✅ Fix: remove extra 'certificate'
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
      backendData.educations.map((edu, idx) => {
        const eduIdOrIdx = edu.id ?? `new_${idx}`;
        const fileKey = `education_certificate_${eduIdOrIdx}`;

        if (!(certificateFiles[fileKey] instanceof File)) {
          const oldUrl = editData.educations?.[idx]?.certificate || null;
          return {
            ...edu,
            certificate: oldUrl
              ? oldUrl.replace('http://localhost:8000/media/', '')
              : null
          };
        }
        // eslint-disable-next-line no-unused-vars
        const { certificate, ...rest } = edu;
        return rest;
      })
    ));


    formData.append('experiences_input', JSON.stringify(
      backendData.experiences.map((exp, idx) => {
        const expIdOrIdx = exp.id ?? `new_${idx}`;
        const fileKey = `experience_certificate_${expIdOrIdx}`;

        if (!(certificateFiles[fileKey] instanceof File)) {
          const oldUrl = editData.experiences?.[idx]?.certificate || null;
          return {
            ...exp,
            certificate: oldUrl
              ? oldUrl.replace('http://localhost:8000/media/', '')
              : null
          };
        }
        // eslint-disable-next-line no-unused-vars
        const { certificate, ...rest } = exp;
        return rest;
      })
    ));


    formData.append('languages_input', JSON.stringify(backendData.languages));
    formData.append('portfolios_input', JSON.stringify(backendData.portfolios));
    formData.append('social_links_input', JSON.stringify(backendData.social_links));
    formData.append('verification_input', JSON.stringify(backendData.verification));

    // Certificate files (accurately mapped by key)
    Object.entries(certificateFiles).forEach(([key, file]) => {
      if (file instanceof File) {
        formData.append(key, file);
      }
    });


    return formData;
  };


  const handleSave = async () => {
    setSaving(true);
    setFieldErrors({});

    try {
      const formData = prepareFormData();
      // ✅ DEBUG: Log what's being sent
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      const { data, error: apiError } = profileData
        ? await apiService.updateProfile(formData)
        : await apiService.createProfile(formData);

      if (data) {
        await loadProfile();
        setIsEditing(false);
        setCertificateFiles({});
        setProfilePictureFile(null);
        success('Profile saved!')

      } else {
        if (apiError && typeof apiError === 'object') {
          setFieldErrors(apiError);
        }
        showError('Failed to save profile. Please check the form for errors.')
      }
    } catch (err) {
      console.error('Unexpected error while saving:', err);
      showError('An unexpected error occurred while saving.')
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
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm transition-all duration-200 hover:from-emerald-500/15 hover:to-green-500/15 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10">
        <div className="relative">
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
        </div>
        <span className="text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide">
          Available
        </span>
      </div>
    ) : (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-full backdrop-blur-sm transition-all duration-200 hover:from-red-500/15 hover:to-rose-500/15 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10">
        <div className="relative">
          <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
          <div className="absolute inset-0 w-2.5 h-2.5 bg-red-400/50 rounded-full animate-pulse"></div>
        </div>
        <span className="text-red-300 text-xs sm:text-sm font-semibold tracking-wide">
          Busy
        </span>
      </div>
    );
  };

  const getCleanCertificateURL = (url) => {
    return url || '';
  };

  const renderCertificate = (certificate, idx, fieldPrefix, itemId = null) => {
    const idOrIdx = itemId ?? idx; // Use item.id if available
    const fileKey = `${fieldPrefix}_${idOrIdx}`;
    const currentFile = certificateFiles[fileKey];

    if (isEditing) {
      return (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/30 backdrop-blur-sm">
          <div className="flex-1 w-full sm:w-auto">
            <label className="block text-sm font-medium text-slate-300 mb-2">Upload Certificate</label>
            <div className="relative group">
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
                    handleInputChange(`${fieldPrefix}:${idx}`, file);
                  }
                }}
                className="w-full bg-slate-900/60 text-slate-200 rounded-lg px-4 py-3 border border-slate-600/40 focus:border-purple-500/60 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm transition-all duration-200 file:bg-gradient-to-r file:from-purple-600/80 file:to-blue-600/80 file:border-0 file:text-white file:px-4 file:py-2 file:rounded-lg file:cursor-pointer file:hover:from-purple-600/90 file:hover:to-blue-600/90 file:transition-all file:duration-200 file:font-medium file:text-xs file:mr-4"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
            </div>

            {(currentFile || certificate) && (
              <div className="mt-3 p-3 bg-slate-900/40 rounded-lg border border-slate-600/20">
                <div className="flex items-center gap-2 text-slate-300">
                  <FileText size={16} className="text-purple-400" />
                  <span className="text-sm font-medium">
                    {currentFile?.name || (typeof certificate === 'string' ? certificate.split('/').pop() : 'Unknown file')}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {currentFile ? `${(currentFile.size / 1024).toFixed(1)} KB` : 'Previously uploaded'}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
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
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-300 hover:text-red-200 text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-red-500/10"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Remove</span>
              </button>
            )}

            {certificate && typeof certificate === 'string' && (
              <a
                href={getCleanCertificateURL(certificate)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600/20 to-green-600/20 hover:from-emerald-600/30 hover:to-green-600/30 border border-emerald-500/30 hover:border-emerald-500/50 rounded-lg text-emerald-300 hover:text-emerald-200 text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <FileText size={16} />
                <span className="hidden sm:inline">Preview</span>
              </a>
            )}
          </div>
        </div>
      );
    }

    // View Mode
    return certificate && typeof certificate === 'string' ? (
      <div className="inline-flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600/10 to-blue-600/10 hover:from-purple-600/20 hover:to-blue-600/20 rounded-xl border border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 backdrop-blur-sm group">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-lg group-hover:from-purple-600/40 group-hover:to-blue-600/40 transition-all duration-200">
          <FileText size={20} className="text-purple-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-purple-300 group-hover:text-purple-200 transition-colors duration-200">
            Certificate Available
          </div>
          <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-200 truncate">
            {certificate.split('/').pop()}
          </div>
        </div>
        <a
          href={getCleanCertificateURL(certificate)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/50 hover:to-blue-600/50 rounded-lg text-purple-200 text-sm font-medium border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200 hover:shadow-md"
        >
          <span className="hidden sm:inline">View</span>
          <ExternalLink size={14} className="sm:hidden" />
        </a>
      </div>
    ) : (
      <div className="inline-flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-600/20 backdrop-blur-sm">
        <div className="flex items-center justify-center w-10 h-10 bg-slate-700/50 rounded-lg">
          <FileText size={20} className="text-slate-500" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-slate-400">
            No Certificate
          </div>
          <div className="text-xs text-slate-500">
            No certificate has been uploaded
          </div>
        </div>
      </div>
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

        {/* Overview Section */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl border border-purple-500/20 transition-all duration-300">
                  <label className="text-white/80 text-sm font-medium mb-3 block items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
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
                    className="w-full bg-white/10 backdrop-blur-sm text-white rounded-xl px-4 py-3 border border-white/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300 text-sm file:bg-gradient-to-r file:from-purple-600/40 file:to-pink-600/40 file:border-0 file:text-white file:px-4 file:py-2 file:rounded-lg file:cursor-pointer file:hover:from-purple-600/60 file:hover:to-pink-600/60 file:transition-all file:duration-300"
                  />
                  {fieldErrors.profile_picture && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {fieldErrors.profile_picture}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Social Links
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  { key: "github_url", label: "GitHub", icon: Github, color: "hover:text-gray-300" },
                  { key: "linkedin_url", label: "LinkedIn", icon: Linkedin, color: "hover:text-blue-400" },
                  { key: "twitter_url", label: "Twitter", icon: Twitter, color: "hover:text-blue-300" },
                  { key: "facebook_url", label: "Facebook", icon: Facebook, color: "hover:text-blue-500" },
                  { key: "instagram_url", label: "Instagram", icon: Instagram, color: "hover:text-pink-400" },
                ].map(({ key, label, icon: Icon, color }) => {
                  // Function to extract and format the URL for display
                  const getDisplayUrl = (url) => {
                    if (!url) return '';
                    try {
                      const urlObj = new URL(url);
                      return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
                    } catch {
                      return url;
                    }
                  };

                  const linkValue = isEditing
                    ? editData.social_links?.[key]
                    : profileData?.social_links?.[key];

                  return (
                    <div key={key} className="group relative">
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-xl border border-white/10 transition-all duration-300 hover:bg-white/15 hover:border-white/20 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10">
                        <div className={`p-2 bg-white/10 rounded-lg transition-all duration-300 group-hover:bg-white/20 ${color} flex-shrink-0`}>
                          <Icon size={20} className="text-white/70 group-hover:text-white transition-colors duration-300" />
                        </div>

                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <EditableField
                              label={label}
                              value={linkValue}
                              field={`social_links.${key}`}
                              type="url"
                              isEditing={isEditing}
                              onChange={handleInputChange}
                              error={fieldErrors[`social_links.${key}`]}
                            />
                          ) : (
                            <div className="space-y-1">
                              <label className="text-white/80 text-sm font-medium block">
                                {label}
                              </label>
                              {linkValue ? (
                                <div className="text-white/90 text-sm sm:text-base font-medium break-all">
                                  <span className="font-bold text-white">
                                    {getDisplayUrl(linkValue)}
                                  </span>
                                </div>
                              ) : (
                                <div className="text-white/40 text-sm sm:text-base">
                                  Not specified
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {!isEditing && linkValue && (
                          <button
                            onClick={() => window.open(linkValue, '_blank', 'noopener,noreferrer')}
                            className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-lg flex-shrink-0"
                            title={`Visit ${label}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Skills Section */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Skills & Expertise
              </h3>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(isEditing ? editData.skills : profileData?.skills || []).map((skill, idx) => (
                <div key={idx} className="group relative">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-xl border border-white/10 transition-all duration-300 hover:bg-white/15 hover:border-white/20 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/10">
                    {/* Skill Icon */}
                    <div className="p-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg flex-shrink-0">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    {/* Skill Content */}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <EditableField
                          label={`Skill #${idx + 1}`}
                          value={skill.name}
                          field={`skills:${idx}:name`}
                          isEditing={isEditing}
                          onChange={handleInputChange}
                          error={fieldErrors[`skills.${idx}.name`]}
                        />
                      ) : (
                        <div className="space-y-1">
                          <div className="text-white/90 font-medium text-sm sm:text-base break-words">
                            {skill.name}
                          </div>
                          <div className="text-white/50 text-xs">
                            Skill #{idx + 1}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    {isEditing && (
                      <button
                        onClick={() => handleArrayRemove("skills", idx)}
                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 flex-shrink-0"
                        title="Remove Skill"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ➕ Add Skill Button when list exists */}
            {isEditing && editData.skills?.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => handleArrayAdd("skills", { name: "" })}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 px-4 py-2 rounded-xl text-green-300 text-sm font-medium transition-all duration-300 hover:scale-105 border border-green-500/20 hover:border-green-500/30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Skill
                </button>
              </div>
            )}

            {/* Empty Editing State */}
            {isEditing && (editData.skills?.length === 0) && (
              <div className="text-center py-12">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 max-w-md mx-auto">
                  <div className="p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg w-fit mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-white/50 text-sm mb-2">No skills added yet</p>
                  <p className="text-white/30 text-xs mb-4">Add your first skill to get started!</p>

                  {/* ➕ Add Skill */}
                  <button
                    onClick={() => handleArrayAdd("skills", { name: "" })}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 px-4 py-2 rounded-xl text-green-300 text-sm font-medium transition-all duration-300 hover:scale-105 border border-green-500/20 hover:border-green-500/30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Skill
                  </button>
                </div>
              </div>
            )}

            {/* Non-editing empty state */}
            {!isEditing && (!profileData?.skills || profileData.skills.length === 0) && (
              <div className="text-center py-12">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 max-w-md mx-auto">
                  <div className="p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg w-fit mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <p className="text-white/50 text-sm mb-2">No skills added</p>
                  <p className="text-white/30 text-xs">Skills will appear here once added</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Languages Section */}
        {activeTab === "languages" && (
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Languages
                </h3>
              </div>

              {isEditing && (
                <button
                  onClick={() => handleArrayAdd("languages", { name: "", proficiency: "" })}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 px-4 py-2 rounded-xl text-green-300 text-sm font-medium transition-all duration-300 hover:scale-105 border border-green-500/20 hover:border-green-500/30"
                >
                  <Plus size={16} />
                  Add Language
                </button>
              )}
            </div>

            {/* Languages Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {(isEditing ? editData.languages : profileData?.languages || []).map((lang, idx) => (
                <div key={idx} className="group relative">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-xl border border-white/10 transition-all duration-300 hover:bg-white/15 hover:border-white/20 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/10">
                    {/* Language Icon */}
                    <div className="p-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg flex-shrink-0">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>

                    {/* Language Content */}
                    <div className="flex-1 min-w-0 space-y-3">
                      {isEditing ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <EditableField
                            label="Language"
                            value={lang.name}
                            field={`languages:${idx}:name`}
                            isEditing={isEditing}
                            options={["english", "", "spanish", "french", "german", "chinese", "japanese", "russian", "portuguese"]}
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
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-white font-semibold text-base">
                              {lang.name || 'Language Name'}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${lang.proficiency === 'native'
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : lang.proficiency === 'advanced'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : lang.proficiency === 'intermediate'
                                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                  : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                              }`}>
                              {lang.proficiency || 'Not specified'}
                            </span>
                          </div>

                          {/* Proficiency Bar */}
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${lang.proficiency === 'native'
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 w-full'
                                : lang.proficiency === 'advanced'
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 w-4/5'
                                  : lang.proficiency === 'intermediate'
                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 w-3/5'
                                    : 'bg-gradient-to-r from-gray-500 to-gray-400 w-2/5'
                                }`}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    {isEditing && (
                      <button
                        onClick={() => handleArrayRemove("languages", idx)}
                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 flex-shrink-0"
                        title="Remove Language"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State - Editing */}
            {isEditing && (editData.languages?.length === 0) && (
              <div className="text-center py-12">
                <div className="p-6 bg-white/5 rounded-xl border border-white/10 max-w-md mx-auto">
                  <div className="p-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg w-fit mx-auto mb-4">
                    <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-white/50 text-sm mb-2">No languages added yet</p>
                  <p className="text-white/30 text-xs">Click &quot;Add Language&quot; to get started!</p>
                </div>
              </div>
            )}

            {/* Empty State - Viewing */}
            {!isEditing && (!profileData?.languages || profileData.languages.length === 0) && (
              <div className="text-center py-12">
                <div className="p-6 bg-white/5 rounded-xl border border-white/10 max-w-md mx-auto">
                  <div className="p-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg w-fit mx-auto mb-4">
                    <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                  <p className="text-white/50 text-sm mb-2">No languages added</p>
                  <p className="text-white/30 text-xs">Language skills will appear here once added</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Education Section */}
        {activeTab === "education" && (
          <div className="w-full max-w-none">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/20"></div>
                  </div>
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      Education
                    </h3>
                    <p className="text-white/60 text-sm lg:text-base mt-1">
                      Academic journey and achievements
                    </p>
                  </div>
                </div>

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
                    className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-4 py-2.5 lg:px-6 lg:py-3 rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <div className="relative flex items-center gap-2">
                      <Plus size={18} className="transition-transform group-hover:rotate-180" />
                      <span className="hidden sm:inline">Add Education</span>
                      <span className="sm:hidden">Add</span>
                    </div>
                  </button>
                )}
              </div>

              {/* Progress indicator */}
              {!isEditing && profileData?.educations && profileData.educations.length > 0 && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-white/70">{profileData.educations.length} Education{profileData.educations.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="w-px h-4 bg-white/20"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white/70">
                      {profileData.educations.filter(edu => edu.certificate).length} Certificate{profileData.educations.filter(edu => edu.certificate).length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Education Cards */}
            <div className="space-y-6">
              {(isEditing ? editData.educations : profileData?.educations || []).map((edu, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10"
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                  <div className="relative p-6 lg:p-8">
                    {/* Card Header */}
                    <div className="flex flex-col space-y-4 mb-6">
                      {/* Top row - Icon, Title, and Delete button */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                            <BookOpen className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <EditableField
                              label="Institution"
                              value={edu.college}
                              field={`educations:${idx}:college`}
                              isEditing={isEditing}
                              onChange={handleInputChange}
                              error={fieldErrors[`educations.${idx}.college`]}
                              className="text-xl lg:text-2xl font-bold text-white mb-1 truncate"
                              placeholder="University/College name"
                            />
                          </div>
                        </div>

                        {isEditing && (
                          <button
                            onClick={() => handleArrayRemove("educations", idx)}
                            className="group/delete p-3 text-red-400 hover:text-white hover:bg-red-500/20 rounded-2xl transition-all duration-200 shrink-0"
                            title="Remove Education"
                          >
                            <Trash2 size={20} className="transition-transform group-hover/delete:scale-110 group-hover/delete:rotate-12" />
                          </button>
                        )}
                      </div>

                      {/* Degree - Full width below */}
                      <div className="pl-0 lg:pl-18">
                        <EditableField
                          label="Degree"
                          value={edu.degree}
                          field={`educations:${idx}:degree`}
                          isEditing={isEditing}
                          onChange={handleInputChange}
                          error={fieldErrors[`educations.${idx}.degree`]}
                          className="text-lg lg:text-xl font-medium text-white/90"
                          placeholder="Degree/Course name"
                        />
                      </div>
                    </div>

                    {/* Duration Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-6">
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-white/70 text-sm font-medium">
                          <div className="w-5 h-5 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Calendar className="w-3 h-3 text-blue-400" />
                          </div>
                          Start Year
                        </label>
                        <EditableField
                          value={edu.start_year}
                          field={`educations:${idx}:start_year`}
                          type="number"
                          isEditing={isEditing}
                          onChange={handleInputChange}
                          error={fieldErrors[`educations.${idx}.start_year`]}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white/10 transition-all duration-200"
                          placeholder="2020"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-white/70 text-sm font-medium">
                          <div className="w-5 h-5 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <Calendar className="w-3 h-3 text-green-400" />
                          </div>
                          End Year
                        </label>
                        <EditableField
                          value={edu.end_year}
                          field={`educations:${idx}:end_year`}
                          type="number"
                          isEditing={isEditing}
                          onChange={handleInputChange}
                          error={fieldErrors[`educations.${idx}.end_year`]}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:bg-white/10 transition-all duration-200"
                          placeholder="2024"
                        />
                      </div>
                    </div>

                    {/* Certificate Section */}
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-white/70 text-sm font-medium">
                        <div className="w-5 h-5 bg-amber-500/20 rounded-lg flex items-center justify-center">
                          <Award className="w-3 h-3 text-amber-400" />
                        </div>
                        Certificate
                      </label>

                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                        <div className="w-full overflow-hidden">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                            <div className="flex-1 min-w-0">
                              {renderCertificate(edu.certificate, idx, "education_certificate")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline connector for multiple cards */}
                    {idx < (isEditing ? editData.educations : profileData?.educations || []).length - 1 && (
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-px h-6 bg-gradient-to-b from-white/20 to-transparent"></div>
                    )}
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {isEditing && (editData.educations?.length === 0) && (
                <div className="text-center py-16 px-6">
                  <div className="relative mx-auto mb-6 w-24 h-24">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center">
                      <GraduationCap className="w-12 h-12 text-white/50" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">No Education Records</h4>
                  <p className="text-white/60 max-w-md mx-auto leading-relaxed">
                    Start building your academic profile by adding your education history and achievements.
                  </p>
                </div>
              )}

              {/* Non-editing empty state */}
              {!isEditing && (!profileData?.educations || profileData.educations.length === 0) && (
                <div className="text-center py-16 px-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <GraduationCap className="w-12 h-12 text-white/50" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">No Education Information</h4>
                  <p className="text-white/60 max-w-md mx-auto leading-relaxed">
                    Education details and academic achievements will be displayed here.
                  </p>
                </div>
              )}
            </div>

            {/* Summary Statistics */}
            {!isEditing && profileData?.educations && profileData.educations.length > 0 && (
              <div className="mt-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <GraduationCap className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{profileData.educations.length}</div>
                    <div className="text-white/60 text-sm">Education{profileData.educations.length !== 1 ? 's' : ''}</div>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {profileData.educations.filter(edu => edu.certificate).length}
                    </div>
                    <div className="text-white/60 text-sm">Certificate{profileData.educations.filter(edu => edu.certificate).length !== 1 ? 's' : ''}</div>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {Math.max(...profileData.educations.map(edu => parseInt(edu.end_year) || 0)) || 'N/A'}
                    </div>
                    <div className="text-white/60 text-sm">Latest Year</div>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {profileData.educations.reduce((total, edu) => {
                        const start = parseInt(edu.start_year) || 0;
                        const end = parseInt(edu.end_year) || 0;
                        return total + (end - start > 0 ? end - start : 0);
                      }, 0)}
                    </div>
                    <div className="text-white/60 text-sm">Total Years</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Experience Section */}
        {activeTab === "experience" && (
          <div className="w-full max-w-none">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full border-2 border-white/20"></div>
                  </div>
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      Experience
                    </h3>
                    <p className="text-white/60 text-sm lg:text-base mt-1">
                      Professional journey and achievements
                    </p>
                  </div>
                </div>

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
                    className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-4 py-2.5 lg:px-6 lg:py-3 rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <div className="relative flex items-center gap-2">
                      <Plus size={18} className="transition-transform group-hover:rotate-180" />
                      <span className="hidden sm:inline">Add Experience</span>
                      <span className="sm:hidden">Add</span>
                    </div>
                  </button>
                )}
              </div>

              {/* Progress indicator */}
              {!isEditing && profileData?.experiences && profileData.experiences.length > 0 && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-white/70">{profileData.experiences.length} Position{profileData.experiences.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="w-px h-4 bg-white/20"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white/70">
                      {profileData.experiences.filter(exp => exp.ongoing).length} Current Role{profileData.experiences.filter(exp => exp.ongoing).length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Experience Cards */}
            <div className="space-y-6">
              {(isEditing ? editData.experiences : profileData?.experiences || []).map((exp, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10"
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                  {/* Ongoing indicator */}
                  {exp.ongoing && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-green-500/30">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-300 text-xs font-medium">Current</span>
                    </div>
                  )}

                  <div className="relative p-6 lg:p-8">
                    {/* Card Header */}
                    <div className="flex flex-col space-y-4 mb-6">
                      {/* Top row - Icon, Role, Company and Delete button */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                            <Building2 className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <EditableField
                              label="Role"
                              value={exp.role}
                              field={`experiences:${idx}:role`}
                              isEditing={isEditing}
                              onChange={handleInputChange}
                              error={fieldErrors[`experiences.${idx}.role`]}
                              className="text-xl lg:text-2xl font-bold text-white mb-1 truncate"
                              placeholder="Job Title/Position"
                            />
                          </div>
                        </div>

                        {isEditing && (
                          <button
                            onClick={() => handleArrayRemove("experiences", idx)}
                            className="group/delete p-3 text-red-400 hover:text-white hover:bg-red-500/20 rounded-2xl transition-all duration-200 shrink-0"
                            title="Remove Experience"
                          >
                            <Trash2 size={20} className="transition-transform group-hover/delete:scale-110 group-hover/delete:rotate-12" />
                          </button>
                        )}
                      </div>

                      {/* Company - Full width below */}
                      <div className="pl-0 lg:pl-18">
                        <EditableField
                          label="Company"
                          value={exp.company}
                          field={`experiences:${idx}:company`}
                          isEditing={isEditing}
                          onChange={handleInputChange}
                          error={fieldErrors[`experiences.${idx}.company`]}
                          className="text-lg lg:text-xl font-medium text-white/90 flex items-center gap-2"
                          placeholder="Company Name"
                        />
                      </div>
                    </div>

                    {/* Duration Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-6">
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-white/70 text-sm font-medium">
                          <div className="w-5 h-5 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <CalendarDays className="w-3 h-3 text-green-400" />
                          </div>
                          Start Date
                        </label>
                        <EditableField
                          value={exp.start_date}
                          field={`experiences:${idx}:start_date`}
                          type="date"
                          isEditing={isEditing}
                          onChange={handleInputChange}
                          error={fieldErrors[`experiences.${idx}.start_date`]}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:bg-white/10 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-white/70 text-sm font-medium">
                          <div className="w-5 h-5 bg-red-500/20 rounded-lg flex items-center justify-center">
                            <CalendarDays className="w-3 h-3 text-red-400" />
                          </div>
                          End Date
                        </label>
                        <EditableField
                          value={exp.end_date}
                          field={`experiences:${idx}:end_date`}
                          type="date"
                          isEditing={isEditing}
                          onChange={handleInputChange}
                          error={fieldErrors[`experiences.${idx}.end_date`]}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:bg-white/10 transition-all duration-200"
                          disabled={exp.ongoing}
                        />
                      </div>
                    </div>

                    {/* Ongoing Toggle */}
                    <div className="mb-6">
                      <label className="flex items-center gap-3 cursor-pointer group/toggle">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={exp.ongoing}
                            onChange={(e) =>
                              handleInputChange(`experiences:${idx}:ongoing`, e.target.checked)
                            }
                            disabled={!isEditing}
                            className="sr-only"
                          />
                          <div className={`w-12 h-6 rounded-full transition-all duration-200 ${exp.ongoing
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-white/10 border border-white/20'
                            }`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-200 ${exp.ongoing ? 'translate-x-6' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                          </div>
                        </div>
                        <span className="text-white/70 text-sm font-medium group-hover/toggle:text-white/90 transition-colors">
                          Currently working here
                        </span>
                      </label>
                    </div>

                    {/* Description */}
                    <div className="space-y-3 mb-6">
                      <label className="flex items-center gap-2 text-white/70 text-sm font-medium">
                        <div className="w-5 h-5 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-3 h-3 text-blue-400" />
                        </div>
                        Description
                      </label>
                      <EditableField
                        value={exp.description}
                        field={`experiences:${idx}:description`}
                        isTextarea={true}
                        isEditing={isEditing}
                        onChange={handleInputChange}
                        error={fieldErrors[`experiences.${idx}.description`]}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white/10 transition-all duration-200 min-h-[100px] resize-y"
                        placeholder="Describe your role, responsibilities, and achievements..."
                      />
                    </div>

                    {/* Certificate Section */}
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-white/70 text-sm font-medium">
                        <div className="w-5 h-5 bg-amber-500/20 rounded-lg flex items-center justify-center">
                          <Award className="w-3 h-3 text-amber-400" />
                        </div>
                        Certificate
                      </label>

                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                        <div className="w-full overflow-hidden">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                            <div className="flex-1 min-w-0">
                              {renderCertificate(exp.certificate, idx, "experience_certificate")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline connector for multiple cards */}
                    {idx < (isEditing ? editData.experiences : profileData?.experiences || []).length - 1 && (
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-px h-6 bg-gradient-to-b from-white/20 to-transparent"></div>
                    )}
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {isEditing && (editData.experiences?.length === 0) && (
                <div className="text-center py-16 px-6">
                  <div className="relative mx-auto mb-6 w-24 h-24">
                    <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl flex items-center justify-center">
                      <Briefcase className="w-12 h-12 text-white/50" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">No Experience Records</h4>
                  <p className="text-white/60 max-w-md mx-auto leading-relaxed">
                    Start building your professional profile by adding your work experience and achievements.
                  </p>
                </div>
              )}

              {/* Non-editing empty state */}
              {!isEditing && (!profileData?.experiences || profileData.experiences.length === 0) && (
                <div className="text-center py-16 px-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="w-12 h-12 text-white/50" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">No Experience Information</h4>
                  <p className="text-white/60 max-w-md mx-auto leading-relaxed">
                    Professional experience and work history will be displayed here.
                  </p>
                </div>
              )}
            </div>

            {/* Summary Statistics */}
            {!isEditing && profileData?.experiences && profileData.experiences.length > 0 && (
              <div className="mt-8 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Briefcase className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{profileData.experiences.length}</div>
                    <div className="text-white/60 text-sm">Position{profileData.experiences.length !== 1 ? 's' : ''}</div>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {profileData.experiences.filter(exp => exp.ongoing).length}
                    </div>
                    <div className="text-white/60 text-sm">Current Role{profileData.experiences.filter(exp => exp.ongoing).length !== 1 ? 's' : ''}</div>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Building2 className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {new Set(profileData.experiences.map(exp => exp.company)).size}
                    </div>
                    <div className="text-white/60 text-sm">Compan{new Set(profileData.experiences.map(exp => exp.company)).size !== 1 ? 'ies' : 'y'}</div>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {profileData.experiences.filter(exp => exp.certificate).length}
                    </div>
                    <div className="text-white/60 text-sm">Certificate{profileData.experiences.filter(exp => exp.certificate).length !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Portfolio Section */}
        {activeTab === "portfolio" && (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Portfolio</h3>
              </div>

              {isEditing && (
                <button
                  onClick={() =>
                    handleArrayAdd("portfolios", {
                      title: "",
                      description: "",
                      project_link: "",
                    })
                  }
                  className="group flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 px-4 py-2 rounded-lg text-green-300 text-sm font-medium transition-all duration-200 border border-green-500/20 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10"
                >
                  <Plus size={14} className="group-hover:rotate-90 transition-transform duration-200" />
                  Add Project
                </button>
              )}
            </div>

            {/* Projects Grid */}
            <div className="grid gap-6">
              {(isEditing ? editData.portfolios : profileData?.portfolios || []).map((port, idx) => (
                <div
                  key={idx}
                  className="group relative bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:transform hover:-translate-y-1"
                >
                  {/* Project Number Badge */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {idx + 1}
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <EditableField
                      label="Project Title"
                      value={port.title}
                      field={`portfolios:${idx}:title`}
                      isEditing={isEditing}
                      onChange={handleInputChange}
                      error={fieldErrors[`portfolios.${idx}.title`]}
                      className="text-lg font-semibold"
                    />

                    <EditableField
                      label="Description"
                      value={port.description}
                      field={`portfolios:${idx}:description`}
                      isTextarea={true}
                      isEditing={isEditing}
                      onChange={handleInputChange}
                      error={fieldErrors[`portfolios.${idx}.description`]}
                      className="text-white/80 leading-relaxed"
                    />

                    <div className="flex items-center gap-3">
                      <EditableField
                        label="Project Link"
                        value={port.project_link}
                        field={`portfolios:${idx}:project_link`}
                        type="url"
                        isEditing={isEditing}
                        onChange={handleInputChange}
                        error={fieldErrors[`portfolios.${idx}.project_link`]}
                        className="flex-1"
                      />

                      {!isEditing && port.project_link && (
                        <a
                          href={port.project_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 px-4 py-2 rounded-lg text-blue-300 text-sm font-medium transition-all duration-200 border border-blue-500/20 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View Project
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  {isEditing && (
                    <button
                      onClick={() => handleArrayRemove("portfolios", idx)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 bg-red-500/20 hover:bg-red-500/30 p-2 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
                      title="Remove Project"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}

              {/* Empty State */}
              {(isEditing ? editData.portfolios?.length === 0 : (!profileData?.portfolios || profileData.portfolios.length === 0)) && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <p className="text-white/60 text-lg font-medium mb-2">No portfolio projects yet</p>
                  <p className="text-white/40 text-sm">
                    {isEditing ? "Click 'Add Project' to showcase your work" : "Projects will appear here once added"}
                  </p>
                </div>
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
          <div className="animate-fade-in">
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8 sm:py-12">
              {/* Animated Icon with Glow Effect */}
              <div className="relative mb-8">
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto flex items-center justify-center border-2 transition-all duration-500 transform hover:scale-110
            ${(isEditing ? editData.is_available : profileData?.is_available)
                      ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-green-400 shadow-lg shadow-green-500/25'
                      : 'bg-gradient-to-br from-red-500/30 to-rose-500/30 border-red-400 shadow-lg shadow-red-500/25'
                    }`}
                >
                  {/* Pulsing ring effect */}
                  <div
                    className={`absolute inset-0 rounded-full animate-pulse
              ${(isEditing ? editData.is_available : profileData?.is_available) ? 'bg-green-500/10' : 'bg-red-500/10'}`}
                  ></div>

                  <CheckCircle
                    size={40}
                    className={`relative z-10 transition-colors duration-300 ${(isEditing ? editData.is_available : profileData?.is_available) ? "text-green-400" : "text-red-400"
                      }`}
                  />
                </div>
              </div>

              {/* Title with gradient text */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Availability Status
              </h2>
              <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-md text-center">
                Let clients know if you&apos;re ready for new projects
              </p>

              {/* Main Card with Glass Effect */}
              <div className="w-full max-w-md sm:max-w-lg bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
                {/* Toggle Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                      Work Availability
                    </h3>
                    <p className="text-sm text-gray-400">
                      Control your visibility to potential clients
                    </p>
                  </div>

                  {/* Enhanced Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer select-none group">
                    <input
                      type="checkbox"
                      checked={isEditing ? editData.is_available : profileData?.is_available}
                      onChange={(e) => handleInputChange("is_available", e.target.checked)}
                      disabled={!isEditing}
                      className="sr-only peer"
                    />
                    {/* Toggle Track with enhanced styling */}
                    <div
                      className={`w-14 h-7 rounded-full transition-all duration-300 relative shadow-inner
                ${(isEditing ? editData.is_available : profileData?.is_available)
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/30'
                          : 'bg-gradient-to-r from-gray-600 to-gray-700 shadow-gray-500/20'
                        }
                ${isEditing ? 'peer-focus:ring-4 peer-focus:ring-blue-300/50 group-hover:shadow-lg' : 'opacity-60'}`}
                    >
                      {/* Toggle Thumb with improved design */}
                      <div
                        className={`absolute top-[2px] left-[2px] h-6 w-6 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center
                  ${(isEditing ? editData.is_available : profileData?.is_available)
                            ? 'bg-white translate-x-7 shadow-green-200/50'
                            : 'bg-white translate-x-0 shadow-gray-200/50'
                          }`}
                      >
                        {/* Mini icon in toggle */}
                        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${(isEditing ? editData.is_available : profileData?.is_available) ? 'bg-green-500' : 'bg-gray-500'
                          }`}></div>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Status Display with Enhanced Animation */}
                <div
                  className={`relative overflow-hidden rounded-xl p-4 sm:p-5 transition-all duration-500 transform
            ${(isEditing ? editData.is_available : profileData?.is_available)
                      ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 shadow-lg shadow-green-500/10"
                      : "bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-400/30 shadow-lg shadow-red-500/10"
                    }`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  </div>

                  <div className="relative flex items-center gap-3">
                    <div className={`p-2 rounded-full ${(isEditing ? editData.is_available : profileData?.is_available) ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                      {(isEditing ? editData.is_available : profileData?.is_available) ? (
                        <CheckCircle className="text-green-400" size={24} />
                      ) : (
                        <XCircle className="text-red-400" size={24} />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className={`text-sm sm:text-base font-medium ${(isEditing ? editData.is_available : profileData?.is_available) ? 'text-green-300' : 'text-red-300'
                        }`}>
                        {(isEditing ? editData.is_available : profileData?.is_available)
                          ? "Ready for new projects!"
                          : "Currently unavailable"
                        }
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {(isEditing ? editData.is_available : profileData?.is_available)
                          ? "Clients can contact you for new opportunities"
                          : "Your profile will show as unavailable to clients"
                        }
                      </p>
                    </div>

                    {/* Status indicator dot */}
                    <div className={`w-3 h-3 rounded-full animate-pulse ${(isEditing ? editData.is_available : profileData?.is_available) ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                  </div>
                </div>

                {/* Additional Info Card */}
                <div className="mt-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h6 className="text-white font-medium text-sm mb-1">How this works</h6>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        When you&apos;re available, your profile appears in search results and clients can send you project invitations.
                        When unavailable, your profile is hidden from new client searches.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons (if editing) */}
                {isEditing && (
                  <div className="mt-6 flex gap-3">
                    <button className="flex-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/30 text-green-300 font-medium py-3 px-4 rounded-xl transition-all duration-200 text-sm">
                      Set as Available
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-red-500/20 to-rose-500/20 hover:from-red-500/30 hover:to-rose-500/30 border border-red-500/30 text-red-300 font-medium py-3 px-4 rounded-xl transition-all duration-200 text-sm">
                      Set as Unavailable
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfileSection;
