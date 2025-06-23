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
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

// EditableArrayField: Handles array fields (tags/chips)
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
              className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/30"
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
              className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/30 flex items-center space-x-2"
            >
              <span>{item}</span>
              <button
                onClick={() => onArrayRemove(field, index)}
                className="text-red-400 hover:text-red-300"
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
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onArrayAdd(field, newValue, setNewValue);
              }
            }}
          />
          <button
            onClick={() => onArrayAdd(field, newValue, setNewValue)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors"
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

  return (
    <div className="space-y-6">
      {/* Header and Edit/Save/Cancel Buttons */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Company Profile</h3>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={onCancel}
                className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg font-medium hover:bg-red-500/30 transition-all duration-200 flex items-center space-x-2"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={onSave}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2"
            >
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white">{profileData.company_name}</h4>
              <p className="text-white/70 text-sm capitalize">{profileData.account_type} Account</p>
              <div className="flex items-center justify-center space-x-1 mt-2">
                <Shield size={14} className="text-green-400" />
                <span className="text-green-400 text-xs">Verified</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User size={16} className="text-white/50" />
                <span className="text-white text-sm">
                  {profileData.first_name} {profileData.last_name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Target size={16} className="text-white/50" />
                <span className="text-white text-sm">{profileData.industry}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-white/50" />
                <span className="text-white text-sm">{profileData.company_size}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign size={16} className="text-white/50" />
                <span className="text-white text-sm">{profileData.budget_range}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
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

          {/* Project Preferences */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
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

          {/* Business Goals & Challenges */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
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

          {/* Payment Information */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
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
      </div>
    </div>
  );
};

export default ProfileSection;
