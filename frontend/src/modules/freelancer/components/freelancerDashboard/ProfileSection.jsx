import React, { useState, useEffect } from 'react';
import {
  User, Edit3, Save, X, Plus, Trash2, MapPin, Calendar, Briefcase, GraduationCap, Globe, Star,
  Award, Mail, Phone, Video, Shield, ExternalLink, FileText, CheckCircle
} from 'lucide-react';


const EditableField = ({
  label,
  value,
  field,
  type = "text",
  options = null,
  isTextarea = false,
  isEditing,
  onChange,
}) => {
  if (!isEditing) {
    return (
      <div>
        <label className="text-white/70 text-sm">{label}</label>
        <p className="text-white font-medium mt-1">
          {type === "currency" ? `$${parseInt(value || 0).toLocaleString()}` : value}
        </p>
      </div>
    );
  }
  if (options) {
    return (
      <div>
        <label className="text-white/70 text-sm mb-2 block">{label}</label>
        <select
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        >
          {options.map((option) => (
            <option key={option} value={option} className="bg-gray-800">
              {option}
            </option>
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
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          rows={3}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
        />
      </div>
    );
  }
  return (
    <div>
      <label className="text-white/70 text-sm mb-2 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      />
    </div>
  );
};

const EditableArrayField = ({
  label,
  field,
  items,
  newValue,
  setNewValue,
  placeholder,
  isEditing,
  onArrayAdd,
  onArrayRemove,
}) => {
  if (!isEditing) {
    return (
      <div>
        <label className="text-white/70 text-sm">{label}</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {(items || []).map((item, index) => (
            <span
              key={index}
              className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30"
            >
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
          {(items || []).map((item, index) => (
            <div
              key={index}
              className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30 flex items-center space-x-2"
            >
              <span>{item}</span>
              <button
                onClick={() => onArrayRemove(field, index)}
                className="text-red-300 hover:text-red-200"
              >
                ✕
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
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onArrayAdd(field, newValue);
                setNewValue("");
              }
            }}
          />
          <button
            onClick={() => {
              onArrayAdd(field, newValue);
              setNewValue("");
            }}
            className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 px-3 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileSection = ({
  profileData = {},
  editData = {},
  isEditing,
  onInputChange,
  onArrayAdd,
  onArrayRemove,
  onEdit,
  onCancel,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileData) setLoading(false);
  }, [profileData]);


  const getAvailabilityStatus = () => {
    const data = isEditing ? editData : profileData;
    return data?.is_available ? (
      <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-green-300 text-xs sm:text-sm font-medium">Available</span>
      </div>
    ) : (
      <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded-full">
        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
        <span className="text-red-300 text-xs sm:text-sm font-medium">Busy</span>
      </div>
    );
  };


  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-lg rounded-3xl border border-white/10 p-4 sm:p-6 md:p-8 text-center">
        <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto mb-4"></div>
        <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">Loading Profile...</h4>
        <p className="text-white/50 text-sm">Please wait while we fetch your data.</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-lg rounded-3xl border border-white/10 p-4 sm:p-6 md:p-8 text-center">
        <User size={40} className="text-white/30 mx-auto mb-4" />
        <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">Profile Not Found</h4>
        <p className="text-white/50 text-sm">Unable to load profile data.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'portfolio', label: 'Portfolio', icon: Star },
    { id: 'verification', label: 'Verification', icon: Shield },
    { id: 'availability', label: 'Availability', icon: CheckCircle }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-3xl border border-white/10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              {profileData.profile_picture ? (
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
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {profileData.first_name} {profileData.last_name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5 text-white/70">
                  <MapPin size={14} />
                  <span className="text-xs sm:text-sm">{profileData.location}</span>
                </div>
                <div className="flex items-center gap-0.5 text-white/70">
                  <Calendar size={14} />
                  <span className="text-xs sm:text-sm">{profileData.age} years old</span>
                </div>
                {getAvailabilityStatus()}
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            {isEditing ? (
              <>
                <button
                  onClick={onCancel}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl text-gray-300 hover:text-white transition-all duration-200 text-xs sm:text-sm bg-gray-700/30 hover:bg-gray-700/40"
                >
                  <X size={12} />
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  className="flex items-center gap-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 px-2 sm:px-3 py-1.5 rounded-xl text-white transition-all duration-200 border border-purple-500/30 text-xs sm:text-sm"
                >
                  <Save size={12} />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={onEdit}
                className="flex items-center gap-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 px-2 sm:px-3 py-1.5 rounded-xl text-white transition-all duration-200 border border-purple-500/30 text-xs sm:text-sm"
              >
                <Edit3 size={12} />
                Edit Profile
              </button>
            )}
          </div>
        </div>
        {/* About Section */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3">About</h3>
          {isEditing ? (
            <textarea
              value={editData.about || ''}
              onChange={e => onInputChange('about', e.target.value)}
              className="w-full bg-white/10 text-white rounded-xl px-3 sm:px-4 py-3 border border-white/20 focus:border-purple-500/50 focus:outline-none resize-none text-sm sm:text-base"
              rows={4}
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-white/80 leading-relaxed text-sm sm:text-base">
              {profileData.about || 'No description available.'}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-1 sm:gap-2 p-2 bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all duration-200 text-xs sm:text-sm ${activeTab === id
              ? 'bg-gradient-to-r from-purple-600/40 to-blue-600/40 text-white border border-purple-500/30'
              : 'text-white/60 hover:text-white/80 hover:bg-white/5'
              }`}
          >
            <Icon size={12} />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="bg-black/20 backdrop-blur-lg rounded-3xl border border-white/10 p-4 sm:p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Skills */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
                  <Star className="text-purple-400" size={16} />
                  Skills
                </h3>
                {isEditing && (
                  <button
                    onClick={() => onArrayAdd('skills', { id: Date.now(), name: '' })}
                    className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-2 sm:px-3 py-1 rounded-lg text-green-300 text-xs sm:text-sm transition-colors"
                  >
                    <Plus size={12} />
                    Add Skill
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {isEditing ? (
                  <div className="w-full space-y-2">
                    {editData.skills?.map((skill, idx) => (
                      <div key={skill.id || idx} className="flex gap-2 items-center">
                        <input
                          value={skill.name}
                          onChange={e => onInputChange(`skills.${idx}.name`, e.target.value)}
                          className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
                          placeholder="Skill name"
                        />
                        <button
                          onClick={() => onArrayRemove('skills', idx)}
                          className="bg-red-500/20 hover:bg-red-500/30 p-2 rounded-lg text-red-300 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  profileData.skills?.map((skill, idx) => (
                    <span
                      key={skill.id || idx}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full text-purple-300 text-xs sm:text-sm font-medium border border-purple-500/30"
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
                <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
                  <Globe className="text-blue-400" size={16} />
                  Languages
                </h3>
                {isEditing && (
                  <button
                    onClick={() => onArrayAdd('languages', { id: Date.now(), name: '', proficiency: '' })}
                    className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-2 sm:px-3 py-1 rounded-lg text-green-300 text-xs sm:text-sm transition-colors"
                  >
                    <Plus size={12} />
                    Add Language
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {isEditing ? (
                  editData.languages?.map((lang, idx) => (
                    <div key={lang.id || idx} className="flex flex-col sm:flex-row gap-2 items-center p-3 bg-white/5 rounded-xl border border-white/10">
                      <input
                        value={lang.name}
                        onChange={e => onInputChange(`languages.${idx}.name`, e.target.value)}
                        className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
                        placeholder="Language"
                      />
                      <input
                        value={lang.proficiency}
                        onChange={e => onInputChange(`languages.${idx}.proficiency`, e.target.value)}
                        className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
                        placeholder="Proficiency"
                      />
                      <button
                        onClick={() => onArrayRemove('languages', idx)}
                        className="bg-red-500/20 hover:bg-red-500/30 p-2 rounded-lg text-red-300 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))
                ) : (
                  profileData.languages?.map((lang, idx) => (
                    <span
                      key={lang.id || idx}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500/20 rounded-full text-blue-300 text-xs sm:text-sm font-medium border border-blue-500/30"
                    >
                      {lang.name} ({lang.proficiency})
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>


      {activeTab === 'experience' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
              <Briefcase className="text-yellow-400" size={16} />
              Experience
            </h3>
            {isEditing && (
              <button
                onClick={() => onArrayAdd('experiences', { id: Date.now(), company: '', role: '', start_date: '', end_date: '', description: '', certificate: null })}
                className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-2 sm:px-3 py-1 rounded-lg text-green-300 text-xs sm:text-sm transition-colors"
              >
                <Plus size={12} />
                Add Experience
              </button>
            )}
          </div>
          <div className="space-y-4">
            {isEditing ? (
              editData.experiences?.map((exp, idx) => (
                <div key={exp.id || idx} className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
                  <input
                    value={exp.company}
                    onChange={e => onInputChange(`experiences.${idx}.company`, e.target.value)}
                    placeholder="Company"
                    className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
                  />
                  <input
                    value={exp.role}
                    onChange={e => onInputChange(`experiences.${idx}.role`, e.target.value)}
                    placeholder="Role"
                    className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      value={exp.start_date}
                      onChange={e => onInputChange(`experiences.${idx}.start_date`, e.target.value)}
                      placeholder="Start Date (YYYY-MM-DD)"
                      className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
                    />
                    <input
                      value={exp.end_date}
                      onChange={e => onInputChange(`experiences.${idx}.end_date`, e.target.value)}
                      placeholder="End Date (YYYY-MM-DD)"
                      className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={e => onInputChange(`experiences.${idx}.description`, e.target.value)}
                    placeholder="Description"
                    className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none resize-none text-sm sm:text-base"
                    rows={2}
                  />
                  <div className="flex flex-col gap-2">
                    <label className="text-white/80 text-sm sm:text-base">Certificate</label>
                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={e => onInputChange(`experiences.${idx}.certificate`, e.target.files[0])}
                        className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base file:bg-purple-600/30 file:border-0 file:text-white file:px-3 file:py-1 file:rounded file:cursor-pointer file:hover:bg-purple-600/40"
                      />
                      {exp.certificate && (
                        <button
                          onClick={() => onInputChange(`experiences.${idx}.certificate`, null)}
                          className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-xs sm:text-sm flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Remove Certificate
                        </button>
                      )}
                    </div>
                    {exp.certificate && (
                      <span className="text-white/60 text-xs sm:text-sm">
                        Selected: {typeof exp.certificate === 'string' ? exp.certificate.split('/').pop() : exp.certificate.name}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onArrayRemove('experiences', idx)}
                    className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-xs sm:text-sm self-end"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              ))
            ) : (
              profileData.experiences?.map((exp, idx) => (
                <div key={exp.id || idx} className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="flex items-center gap 2">
                      <Briefcase size={16} className="text-yellow-400" />
                      <span className="text-white font-medium text-sm sm:text-base">{exp.role}</span>
                    </div>
                    <span className="text-white/70 text-xs sm:text-sm">at</span>
                    <span className="text-white text-sm sm:text-base">{exp.company}</span>
                  </div>
                  <div className="text-white/60 text-xs sm:text-sm">
                    {exp.start_date} – {exp.end_date || 'Present'}
                  </div>
                  <div className="text-white/80 text-sm sm:text-base">{exp.description}</div>
                  {exp.certificate && (
                    <a
                      href={exp.certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 rounded-lg text-purple-300 text-xs sm:text-sm font-medium border border-purple-500/30 transition-all duration-200"
                    >
                      <FileText size={14} /> View Certificate
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
            <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
              <GraduationCap className="text-green-400" size={16} />
              Education
            </h3>
            {isEditing && (
              <button
                onClick={() => onArrayAdd('educations', { id: Date.now(), college: '', degree: '', year: '', certificate: null })}
                className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-2 sm:px-3 py-1 rounded-lg text-green-300 text-xs sm:text-sm transition-colors"
              >
                <Plus size={12} />
                Add Education
              </button>
            )}
          </div>
          <div className="space-y-4">
            {isEditing ? (
              editData.educations?.map((edu, idx) => (
                <div key={edu.id || idx} className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
                  <input
                    value={edu.college}
                    onChange={e => onInputChange(`educations.${idx}.college`, e.target.value)}
                    placeholder="College"
                    className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
                  />
                  <input
                    value={edu.degree}
                    onChange={e => onInputChange(`educations.${idx}.degree`, e.target.value)}
                    placeholder="Degree"
                    className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
                  />
                  <input
                    value={edu.year}
                    onChange={e => onInputChange(`educations.${idx}.year`, e.target.value)}
                    placeholder="Year"
                    className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
                  />
                  <div className="flex flex-col gap-2">
                    <label className="text-white/80 text-sm sm:text-base">Certificate</label>
                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={e => onInputChange(`educations.${idx}.certificate`, e.target.files[0])}
                        className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base file:bg-purple-600/30 file:border-0 file:text-white file:px-3 file:py-1 file:rounded file:cursor-pointer file:hover:bg-purple-600/40"
                      />
                      {edu.certificate && (
                        <button
                          onClick={() => onInputChange(`educations.${idx}.certificate`, null)}
                          className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-xs sm:text-sm flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Remove Certificate
                        </button>
                      )}
                    </div>
                    {edu.certificate && (
                      <span className="text-white/60 text-xs sm:text-sm">
                        Selected: {typeof edu.certificate === 'string' ? edu.certificate.split('/').pop() : edu.certificate.name}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onArrayRemove('educations', idx)}
                    className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-xs sm:text-sm self-end"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              ))
            ) : (
              profileData.educations?.map((edu, idx) => (
                <div key={edu.id || idx} className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} className="text-green-400" />
                      <span className="text-white font-medium text-sm sm:text-base">{edu.degree}</span>
                    </div>
                    <span className="text-white/70 text-xs sm:text-sm">at</span>
                    <span className="text-white text-sm sm:text-base">{edu.college}</span>
                  </div>
                  <div className="text-white/60 text-xs sm:text-sm">{edu.year}</div>
                  {edu.certificate && (
                    <a
                      href={edu.certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 rounded-lg text-purple-300 text-xs sm:text-sm font-medium border border-purple-500/30 transition-all duration-200"
                    >
                      <FileText size={14} /> View Certificate
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
            <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
              <Award className="text-orange-400" size={16} />
              Portfolio
            </h3>
            {isEditing && (
              <button
                onClick={() => onArrayAdd('portfolios', { id: Date.now(), title: '', description: '', project_link: '' })}
                className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 px-2 sm:px-3 py-1 rounded-lg text-green-300 text-xs sm:text-sm transition-colors"
              >
                <Plus size={12} />
                Add Project
              </button>
            )}
          </div>
          <div className="space-y-4">
            {isEditing ? (
              editData.portfolios?.map((pf, idx) => (
                <div key={pf.id || idx} className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
                  <input
                    value={pf.title}
                    onChange={e => onInputChange(`portfolios.${idx}.title`, e.target.value)}
                    placeholder="Project Title"
                    className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
                  />
                  <textarea
                    value={pf.description}
                    onChange={e => onInputChange('portfolios', idx, { ...pf, description: e.target.value })}
                    placeholder="Description"
                    className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none resize-none text-sm sm:text-base"
                    rows={2}
                  />
                  <input
                    value={pf.project_link}
                    onChange={e => onInputChange('portfolios', idx, { ...pf, project_link: e.target.value })}
                    placeholder="Project Link"
                    className="bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-purple-500/50 focus:outline-none text-sm sm:text-base"
                  />
                  <button
                    onClick={() => onArrayRemove('portfolios', idx)}
                    className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-xs sm:text-sm self-end"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              ))
            ) : (
              profileData.portfolios?.map((pf, idx) => (
                <div key={pf.id || idx} className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-orange-400" />
                      <span className="text-white font-medium text-sm sm:text-base">{pf.title}</span>
                    </div>
                    <a href={pf.project_link} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline flex items-center gap-1 text-sm sm:text-base">
                      <ExternalLink size={14} /> View
                    </a>
                  </div>
                  <div className="text-white/80 text-sm sm:text-base">{pf.description}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'verification' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
              <Shield className="text-green-400" size={16} />
              Verification
            </h3>
          </div>
          <div className="space-y-4">
            {[
              { key: 'email_verified', label: 'Email Verification', icon: Mail },
              { key: 'phone_verified', label: 'Phone Verification', icon: Phone },
              { key: 'id_verified', label: 'ID Verification', icon: Shield },
              { key: 'video_verified', label: 'Video Verification', icon: Video }
            ].map(({ key, label, icon: Icon }) => (
              <div
                key={key}
                className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} className={editData[key] ? 'text-green-400' : 'text-gray-400'} />
                  <span className="text-white text-sm sm:text-base">{label}</span>
                </div>
                {isEditing ? (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editData[key] || false}
                      onChange={() => onInputChange(key, !editData[key])}
                      className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-white/80 text-sm">{editData[key] ? 'Verified' : 'Not Verified'}</span>
                  </label>
                ) : (
                  <span
                    className={`text-sm sm:text-base ${editData[key] ? 'text-green-300' : 'text-red-300'
                      }`}
                  >
                    {editData[key] ? 'Verified' : 'Not Verified'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'availability' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-1">
              <CheckCircle className="text-blue-400" size={16} />
              Availability
            </h3>
          </div>
          <div className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center gap-4">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${editData.is_available ? 'bg-green-500/20 border-2 border-green-500' : 'bg-red-500/20 border-2 border-red-500'}`}>
              <CheckCircle size={24} className={editData.is_available ? 'text-green-500' : 'text-red-500'} />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-white">
              {editData.is_available ? 'Available for Work' : 'Not Available'}
            </h4>
            <p className="text-white/70 text-sm sm:text-base text-center">
              {editData.is_available
                ? 'You are currently available to take on new projects'
                : 'You are not currently available for new projects'
              }
            </p>
            {isEditing && (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={editData.is_available}
                  onChange={() => onInputChange('is_available', !editData.is_available)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-white">Available for work</span>
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;