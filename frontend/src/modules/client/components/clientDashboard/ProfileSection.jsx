import React, { useState } from "react";
import { Plus, X, User, Shield, Target, Users, DollarSign, Briefcase, Edit3, Save, Award, CreditCard } from "react-feather";

// EditableField: Handles text, select, and textarea fields
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

// EditableArrayField: Handles array fields (tags/clips)
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
                <X size={14} />
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
                onArrayAdd(field, newValue, setNewValue);
              }
            }}
          />
          <button
            onClick={() => onArrayAdd(field, newValue, setNewValue)}
            className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 px-3 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Main ProfileSection Component
const ProfileSection = ({
  profileData = {},
  isEditing,
  onInputChange,
  onArrayAdd,
  onArrayRemove,
  onEdit,
  onCancel,
  onSave,
}) => {
  // Local state for new array values
  const [newProjectType, setNewProjectType] = useState("");
  const [newCommunicationMethod, setNewCommunicationMethod] = useState("");
  const [newBusinessGoal, setNewBusinessGoal] = useState("");
  const [newChallenge, setNewChallenge] = useState("");
  // State for active tab
  const [activeTab, setActiveTab] = useState('basicInfo');

  // Predefined options
  const accountTypes = ["business", "individual", "enterprise"];
  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Manufacturing",
    "Consulting",
    "Media",
    "Other",
  ];
  const companySizes = [
    "Small company (1-50)",
    "Medium company (51-200)",
    "Large company (201-1000)",
    "Enterprise (1000+)",
  ];
  const budgetRanges = [
    "$1,000 - $5,000",
    "$5,000 - $10,000",
    "$10,000 - $25,000",
    "$25,000 - $50,000",
    "$50,000+",
  ];
  const projectFrequencies = ["Weekly", "Bi-weekly", "Monthly", "Quarterly", "As needed"];
  const paymentMethods = ["credit-card", "bank-transfer", "paypal", "cryptocurrency"];
  const paymentTimings = ["upfront", "milestone-based", "monthly", "project-completion"];

  // Define tabs
  const tabs = [
    { id: 'basicInfo', label: 'Basic Information', icon: User },
    { id: 'projectPreferences', label: 'Preferences', icon: Target },
    { id: 'businessOverview', label: 'Business Overview', icon: Award },
    { id: 'paymentInfo', label: 'Payments', icon: CreditCard },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header and Edit/Save/Cancel Buttons */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-3xl border border-white/10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg flex-shrink-0">
              {profileData?.profile_picture ? (
                <img
                  src={profileData.profile_picture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <User size={24} className={`${profileData?.profile_picture ? 'hidden' : 'text-white'}`} />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {profileData.company_name || 'Company Profile'}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5 text-white/70">
                  <Users size={14} />
                  <span className="text-xs sm:text-sm capitalize">{profileData.account_type || 'N/A'} Account</span>
                </div>
                <div className="flex items-center gap-0.5 text-white/70">
                  <Target size={14} />
                  <span className="text-xs sm:text-sm">{profileData.industry || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
                  <Shield size={12} className="text-green-400" />
                  <span className="text-green-300 text-xs sm:text-sm font-medium">Verified</span>
                </div>
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
        {activeTab === 'basicInfo' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
                    {profileData?.profile_picture ? (
                      <img
                        src={profileData.profile_picture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <User size={32} className={`${profileData?.profile_picture ? 'hidden' : 'text-white'}`} />
                  </div>

                  <h4 className="text-xl font-semibold text-white">{profileData.company_name || 'N/A'}</h4>
                  <p className="text-white/70 text-sm capitalize">{profileData.account_type || 'N/A'} Account</p>
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    <Shield size={14} className="text-green-400" />
                    <span className="text-green-400 text-xs">Verified</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User size={16} className="text-white/50" />
                    <span className="text-white text-sm">
                      {profileData.first_name || 'N/A'} {profileData.last_name || ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target size={16} className="text-white/50" />
                    <span className="text-white text-sm">{profileData.industry || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-white/50" />
                    <span className="text-white text-sm">{profileData.company_size || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign size={16} className="text-white/50" />
                    <span className="text-white text-sm">{profileData.budget_range || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h5 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Briefcase size={20} />
                  <span>Basic Information</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EditableField
                    label="First Name"
                    value={profileData.first_name}
                    field="first_name"
                    isEditing={isEditing}
                    onChange={onInputChange}
                  />
                  <EditableField
                    label="Last Name"
                    value={profileData.last_name}
                    field="last_name"
                    isEditing={isEditing}
                    onChange={onInputChange}
                  />
                  <EditableField
                    label="Company Name"
                    value={profileData.company_name}
                    field="company_name"
                    isEditing={isEditing}
                    onChange={onInputChange}
                  />
                  <EditableField
                    label="Account Type"
                    value={profileData.account_type}
                    field="account_type"
                    options={accountTypes}
                    isEditing={isEditing}
                    onChange={onInputChange}
                  />
                  <EditableField
                    label="Industry"
                    value={profileData.industry}
                    field="industry"
                    options={industries}
                    isEditing={isEditing}
                    onChange={onInputChange}
                  />
                  <EditableField
                    label="Company Size"
                    value={profileData.company_size}
                    field="company_size"
                    options={companySizes}
                    isEditing={isEditing}
                    onChange={onInputChange}
                  />
                  <EditableField
                    label="Location"
                    value={profileData.location}
                    field="location"
                    isEditing={isEditing}
                    onChange={onInputChange}
                  />
                  <EditableField
                    label="Website"
                    value={profileData.website}
                    field="website"
                    type="url"
                    isEditing={isEditing}
                    onChange={onInputChange}
                  />
                  <div className="md:col-span-2">
                    <EditableField
                      label="Company Description"
                      value={profileData.company_description}
                      field="company_description"
                      isTextarea={true}
                      isEditing={isEditing}
                      onChange={onInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projectPreferences' && (
          <div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h5 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Target size={20} />
                <span>Project Preferences</span>
              </h5>
              <div className="space-y-4">
                <EditableArrayField
                  label="Project Types"
                  field="project_types"
                  items={profileData.project_types}
                  newValue={newProjectType}
                  setNewValue={setNewProjectType}
                  isEditing={isEditing}
                  onArrayAdd={onArrayAdd}
                  onArrayRemove={onArrayRemove}
                  placeholder="Add project type"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EditableField
                    label="Budget Range"
                    value={profileData.budget_range}
                    field="budget_range"
                    options={budgetRanges}
                    isEditing={isEditing}
                    onChange={onInputChange}
                  />
                  <EditableField
                    label="Project Frequency"
                    value={profileData.project_frequency}
                    field="project_frequency"
                    options={projectFrequencies}
                    isEditing={isEditing}
                    onChange={onInputChange}
                  />
                  <EditableField
                    label="Working Hours"
                    value={profileData.working_hours}
                    field="working_hours"
                    isEditing={isEditing}
                    onChange={onInputChange}
                  />
                </div>
                <EditableArrayField
                  label="Preferred Communication"
                  field="preferred_communications"
                  items={profileData.preferred_communications}
                  newValue={newCommunicationMethod}
                  setNewValue={setNewCommunicationMethod}
                  isEditing={isEditing}
                  onArrayAdd={onArrayAdd}
                  onArrayRemove={onArrayRemove}
                  placeholder="Add communication method"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'businessOverview' && (
          <div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h5 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Award size={20} />
                <span>Business Overview</span>
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <EditableArrayField
                    label="Business Goals"
                    field="business_goals"
                    items={profileData.business_goals}
                    newValue={newBusinessGoal}
                    setNewValue={setNewBusinessGoal}
                    isEditing={isEditing}
                    onArrayAdd={onArrayAdd}
                    onArrayRemove={onArrayRemove}
                    placeholder="Add business goal"
                  />
                </div>
                <div>
                  <EditableArrayField
                    label="Current Challenges"
                    field="current_challenges"
                    items={profileData.current_challenges}
                    newValue={newChallenge}
                    setNewValue={setNewChallenge}
                    isEditing={isEditing}
                    onArrayAdd={onArrayAdd}
                    onArrayRemove={onArrayRemove}
                    placeholder="Add challenge"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'paymentInfo' && (
          <div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h5 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <CreditCard size={20} />
                <span>Payment & Budget</span>
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EditableField
                  label="Payment Method"
                  value={profileData.payment_method}
                  field="payment_method"
                  options={paymentMethods}
                  isEditing={isEditing}
                  onChange={onInputChange}
                />
                <EditableField
                  label="Monthly Budget"
                  value={profileData.monthly_budget}
                  field="monthly_budget"
                  type="number"
                  isEditing={isEditing}
                  onChange={onInputChange}
                />
                <EditableField
                  label="Project Budget"
                  value={profileData.project_budget}
                  field="project_budget"
                  type="number"
                  isEditing={isEditing}
                  onChange={onInputChange}
                />
                <EditableField
                  label="Payment Timing"
                  value={profileData.payment_timing}
                  field="payment_timing"
                  options={paymentTimings}
                  isEditing={isEditing}
                  onChange={onInputChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
