import React from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function AccountForm({
  formValues,
  errors,
  loading,
  isPasswordVisible,
  onInputChange,
  onTogglePassword,
  onSubmit,
  onBack,
}) {
  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-xl font-bold text-white mb-6">Create your account</h2>
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-white mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-purple-300" size={18} />
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={onInputChange}
              className="pl-10 pr-3 py-2 rounded-xl bg-white/20 text-white w-full outline-none"
              disabled={loading}
            />
          </div>
          {errors.email && (
            <div className="text-red-400 text-xs mt-1">{errors.email}</div>
          )}
        </div>
        <div>
          <label className="block text-white mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-purple-300" size={18} />
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              name="password"
              value={formValues.password}
              onChange={onInputChange}
              className="pl-10 pr-10 py-2 rounded-xl bg-white/20 text-white w-full outline-none"
              disabled={loading}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-purple-300"
              onClick={onTogglePassword}
            >
              {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {errors.password && (
            <div className="text-red-400 text-xs mt-1">{errors.password}</div>
          )}
        </div>
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formValues.agreeTerms}
            onChange={onInputChange}
            className="mr-2"
            disabled={loading}
          />
          <span className="text-white text-sm">
            I agree to the{' '}
            <a href="#" className="text-purple-300 underline">
              terms and conditions
            </a>
          </span>
        </div>
        {errors.agreeTerms && (
          <div className="text-red-400 text-xs mt-1">{errors.agreeTerms}</div>
        )}
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-white/20 text-white px-6 py-3 rounded-xl font-medium"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium flex items-center"
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </div>
    </form>
  );
}
