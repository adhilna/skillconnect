import React, { useState, useEffect } from 'react';
import {
  User, Edit3, Save, X, Plus, Trash2, MapPin, Calendar, Briefcase, GraduationCap, Globe, Star,
  Award, Eye, EyeOff, Mail, Phone, Video, Shield, ExternalLink, FileText
} from 'lucide-react';


const ProfileSection = (props) => {
  const { profileData } = props;
  const [editData, setEditData] = useState(profileData || null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');


  useEffect(() => {
    setEditData(profileData || null);
  }, [profileData]);

  // If you keep loading, make sure to set it to false when data is ready
  useEffect(() => {
    if (profileData) setLoading(false);
  }, [profileData]);



  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleAddItem = (field, newItem) => {
    setEditData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), newItem]
    }));
  };

  const handleRemoveItem = (field, index) => {
    setEditData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    // Send editData to backend if needed
    // Then call onUpdate to update the parent
    setIsEditing(false);
  };

  const getAvailabilityStatus = () => (
    profileData?.is_available ? (
      <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-green-300 text-sm font-medium">Available</span>
      </div>
    ) : (
      <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full">
        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
        <span className="text-red-300 text-sm font-medium">Busy</span>
      </div>
    )
  );

  const getVerificationBadges = () => {
    const verifications = [
      { key: 'email_verified', icon: Mail, label: 'Email' },
      { key: 'phone_verified', icon: Phone, label: 'Phone' },
      { key: 'id_verified', icon: Shield, label: 'ID' },
      { key: 'video_verified', icon: Video, label: 'Video' }
    ];
    return verifications.map(({ key, icon: Icon, label }) => (
      <div
        key={key}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${profileData?.[key]
          ? 'bg-green-500/20 text-green-300'
          : 'bg-gray-500/20 text-gray-400'
          }`}
      >
        <Icon size={12} />
        <span>{label}</span>
        {profileData?.[key] ? '✓' : '✗'}
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-lg rounded-3xl border border-white/10 p-8 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto mb-4"></div>
        <h4 className="text-xl font-semibold text-white mb-2">Loading Profile...</h4>
        <p className="text-white/50 text-sm">Please wait while we fetch your data.</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-lg rounded-3xl border border-white/10 p-8 text-center">
        <User size={48} className="text-white/30 mx-auto mb-4" />
        <h4 className="text-xl font-semibold text-white mb-2">Profile Not Found</h4>
        <p className="text-white/50 text-sm">Unable to load profile data.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'portfolio', label: 'Portfolio', icon: Star }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-3xl border border-white/10 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
              {profileData.profile_picture ? (
                <img
                  src={profileData.profile_picture}
                  alt="Profile"
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <User size={32} className="text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {profileData.first_name} {profileData.last_name}
              </h1>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1 text-white/70">
                  <MapPin size={16} />
                  <span className="text-sm">{profileData.location}</span>
                </div>
                <div className="flex items-center gap-1 text-white/70">
                  <Calendar size={16} />
                  <span className="text-sm">{profileData.age} years old</span>
                </div>
                {getAvailabilityStatus()}
              </div>
              <div className="flex gap-2 flex-wrap">
                {getVerificationBadges()}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditData(profileData);
                  }}
                  className="flex items-center gap-2 bg-gray-700/30 hover:bg-gray-700/40 px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-all duration-200"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 px-4 py-2 rounded-xl text-white transition-all duration-200 border border-purple-500/30"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 px-4 py-2 rounded-xl text-white transition-all duration-200 border border-purple-500/30"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>
        {/* About Section */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">About</h3>
          {isEditing ? (
            <textarea
              value={editData.about}
              onChange={e => handleInputChange('about', e.target.value)}
              className="w-full bg-white/10 text-white rounded-xl px-4 py-3 border border-white/20 focus:border-purple-500/50 focus:outline-none resize-none"
              rows={4}
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-white/80 leading-relaxed">
              {profileData.about || 'No description available.'}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-2 bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${activeTab === id
              ? 'bg-gradient-to-r from-purple-600/40 to-blue-600/40 text-white border border-purple-500/30'
              : 'text-white/60 hover:text-white/80 hover:bg-white/5'
              }`}
          >
            <Icon size={16} />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="bg-black/20 backdrop-blur-lg rounded-3xl border border-white/10 p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Skills */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Star className="text-purple-400" size={20} />
                  Skills
                </h3>
                {isEditing && (
                  <button
                    onClick={() => handleAddItem('skills', { id: Date.now(), name: '' })}
                    className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-3 py-1 rounded-lg text-green-300 text-sm transition-colors"
                  >
                    <Plus size={14} />
                    Add Skill
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {isEditing ? (
                  <div className="w-full space-y-2">
                    {editData.skills?.map((skill, idx) => (
                      <div key={skill.id || idx} className="flex gap-2 items-center">
                        <input
                          value={skill.name}
                          onChange={e => handleArrayChange('skills', idx, { ...skill, name: e.target.value })}
                          className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none"
                          placeholder="Skill name"
                        />
                        <button
                          onClick={() => handleRemoveItem('skills', idx)}
                          className="bg-red-500/20 hover:bg-red-500/30 p-2 rounded-lg text-red-300 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  profileData.skills?.map((skill, idx) => (
                    <span
                      key={skill.id || idx}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full text-purple-300 text-sm font-medium border border-purple-500/30"
                    >
                      {skill.name}
                    </span>
                  ))
                )}
              </div>
            </div>
            {/* Languages */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Globe className="text-blue-400" size={20} />
                  Languages
                </h3>
                {isEditing && (
                  <button
                    onClick={() => handleAddItem('languages', { id: Date.now(), name: '', proficiency: '' })}
                    className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-3 py-1 rounded-lg text-green-300 text-sm transition-colors"
                  >
                    <Plus size={14} />
                    Add Language
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {isEditing ? (
                  editData.languages?.map((lang, idx) => (
                    <div key={lang.id || idx} className="flex gap-2 items-center p-3 bg-white/5 rounded-xl border border-white/10">
                      <input
                        value={lang.name}
                        onChange={e => handleArrayChange('languages', idx, { ...lang, name: e.target.value })}
                        className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none"
                        placeholder="Language"
                      />
                      <input
                        value={lang.proficiency}
                        onChange={e => handleArrayChange('languages', idx, { ...lang, proficiency: e.target.value })}
                        className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none"
                        placeholder="Proficiency"
                      />
                      <button
                        onClick={() => handleRemoveItem('languages', idx)}
                        className="bg-red-500/20 hover:bg-red-500/30 p-2 rounded-lg text-red-300 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  profileData.languages?.map((lang, idx) => (
                    <span
                      key={lang.id || idx}
                      className="px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm font-medium border border-blue-500/30"
                    >
                      {lang.name} ({lang.proficiency})
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Briefcase className="text-yellow-400" size={20} />
                Experience
              </h3>
              {isEditing && (
                <button
                  onClick={() => handleAddItem('experiences', { id: Date.now(), company: '', role: '', start_date: '', end_date: '', description: '', certificate: '' })}
                  className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-3 py-1 rounded-lg text-green-300 text-sm transition-colors"
                >
                  <Plus size={14} />
                  Add Experience
                </button>
              )}
            </div>
            <div className="space-y-4">
              {isEditing ? (
                editData.experiences?.map((exp, idx) => (
                  <div key={exp.id || idx} className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
                    <input
                      value={exp.company}
                      onChange={e => handleArrayChange('experiences', idx, { ...exp, company: e.target.value })}
                      placeholder="Company"
                      className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none"
                    />
                    <input
                      value={exp.role}
                      onChange={e => handleArrayChange('experiences', idx, { ...exp, role: e.target.value })}
                      placeholder="Role"
                      className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <input
                        value={exp.start_date}
                        onChange={e => handleArrayChange('experiences', idx, { ...exp, start_date: e.target.value })}
                        placeholder="Start Date (YYYY-MM-DD)"
                        className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none"
                      />
                      <input
                        value={exp.end_date}
                        onChange={e => handleArrayChange('experiences', idx, { ...exp, end_date: e.target.value })}
                        placeholder="End Date (YYYY-MM-DD)"
                        className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none"
                      />
                    </div>
                    <textarea
                      value={exp.description}
                      onChange={e => handleArrayChange('experiences', idx, { ...exp, description: e.target.value })}
                      placeholder="Description"
                      className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none resize-none"
                      rows={2}
                    />
                    {exp.certificate && (
                      <a href={exp.certificate} target="_blank" rel="noopener noreferrer" className="text-purple-300 underline flex items-center gap-1">
                        <FileText size={14} /> Certificate
                      </a>
                    )}
                    <button
                      onClick={() => handleRemoveItem('experiences', idx)}
                      className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-sm self-end"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                ))
              ) : (
                profileData.experiences?.map((exp, idx) => (
                  <div key={exp.id || idx} className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Briefcase size={18} className="text-yellow-400" />
                      <span className="text-white font-medium">{exp.role}</span>
                      <span className="text-white/70">at</span>
                      <span className="text-white">{exp.company}</span>
                    </div>
                    <div className="text-white/60 text-sm">
                      {exp.start_date} – {exp.end_date || 'Present'}
                    </div>
                    <div className="text-white/80">{exp.description}</div>
                    {exp.certificate && (
                      <a href={exp.certificate} target="_blank" rel="noopener noreferrer" className="text-purple-300 underline flex items-center gap-1">
                        <FileText size={14} /> Certificate
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <GraduationCap className="text-green-400" size={20} />
                Education
              </h3>
              {isEditing && (
                <button
                  onClick={() => handleAddItem('educations', { id: Date.now(), college: '', degree: '', year: '', certificate: '' })}
                  className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-3 py-1 rounded-lg text-green-300 text-sm transition-colors"
                >
                  <Plus size={14} />
                  Add Education
                </button>
              )}
            </div>
            <div className="space-y-4">
              {isEditing ? (
                editData.educations?.map((edu, idx) => (
                  <div key={edu.id || idx} className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
                    <input
                      value={edu.college}
                      onChange={e => handleArrayChange('educations', idx, { ...edu, college: e.target.value })}
                      placeholder="College"
                      className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none"
                    />
                    <input
                      value={edu.degree}
                      onChange={e => handleArrayChange('educations', idx, { ...edu, degree: e.target.value })}
                      placeholder="Degree"
                      className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none"
                    />
                    <input
                      value={edu.year}
                      onChange={e => handleArrayChange('educations', idx, { ...edu, year: e.target.value })}
                      placeholder="Year"
                      className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none"
                    />
                    {edu.certificate && (
                      <a href={edu.certificate} target="_blank" rel="noopener noreferrer" className="text-purple-300 underline flex items-center gap-1">
                        <FileText size={14} /> Certificate
                      </a>
                    )}
                    <button
                      onClick={() => handleRemoveItem('educations', idx)}
                      className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-sm self-end"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                ))
              ) : (
                profileData.educations?.map((edu, idx) => (
                  <div key={edu.id || idx} className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={18} className="text-green-400" />
                      <span className="text-white font-medium">{edu.degree}</span>
                      <span className="text-white/70">at</span>
                      <span className="text-white">{edu.college}</span>
                    </div>
                    <div className="text-white/60 text-sm">{edu.year}</div>
                    {edu.certificate && (
                      <a href={edu.certificate} target="_blank" rel="noopener noreferrer" className="text-purple-300 underline flex items-center gap-1">
                        <FileText size={14} /> Certificate
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Award className="text-orange-400" size={20} />
                Portfolio
              </h3>
              {isEditing && (
                <button
                  onClick={() => handleAddItem('portfolios', { id: Date.now(), title: '', description: '', project_link: '' })}
                  className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-3 py-1 rounded-lg text-green-300 text-sm transition-colors"
                >
                  <Plus size={14} />
                  Add Project
                </button>
              )}
            </div>
            <div className="space-y-4">
              {isEditing ? (
                editData.portfolios?.map((pf, idx) => (
                  <div key={pf.id || idx} className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
                    <input
                      value={pf.title}
                      onChange={e => handleArrayChange('portfolios', idx, { ...pf, title: e.target.value })}
                      placeholder="Project Title"
                      className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none"
                    />
                    <textarea
                      value={pf.description}
                      onChange={e => handleArrayChange('portfolios', idx, { ...pf, description: e.target.value })}
                      placeholder="Description"
                      className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none resize-none"
                      rows={2}
                    />
                    <input
                      value={pf.project_link}
                      onChange={e => handleArrayChange('portfolios', idx, { ...pf, project_link: e.target.value })}
                      placeholder="Project Link"
                      className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none"
                    />
                    <button
                      onClick={() => handleRemoveItem('portfolios', idx)}
                      className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-sm self-end"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                ))
              ) : (
                profileData.portfolios?.map((pf, idx) => (
                  <div key={pf.id || idx} className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Award size={18} className="text-orange-400" />
                      <span className="text-white font-medium">{pf.title}</span>
                      <a href={pf.project_link} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline flex items-center gap-1">
                        <ExternalLink size={14} /> View
                      </a>
                    </div>
                    <div className="text-white/80">{pf.description}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
