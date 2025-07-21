import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { FaApple } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/api.js';
import RoleSelection from '../components/Shared/RoleSelection.jsx';
import { Link } from 'react-router-dom';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [googleToken, setGoogleToken] = useState(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Step 1: Call login API
      const response = await api.post('/api/v1/auth/token/', { email, password });
      const { access, refresh } = response.data;

      // Step 2: Fetch user profile (if not returned by login API)
      // If your login API returns user data, skip this step
      const userResponse = await api.get('/api/v1/auth/users/profile/', {
        headers: { Authorization: `Bearer ${access}` }
      });
      const userData = userResponse.data;


      // Step 3: Call login in AuthContext
      login(userData, access, refresh);

      // Step 4: Redirect based on role
      const dashboardPath = userData.role.toLowerCase() === 'client' ? '/client/dashboard' : '/freelancer/dashboard';
      navigate(dashboardPath);

    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (googleToken) => {
    setError('');
    setGoogleLoading(true);
    try {
      const response = await api.post('/api/v1/auth/users/google/', { token: googleToken });
      if (response.data.access) {
        // Save JWT, redirect, etc.
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        navigate('/welcome');
      } else if (response.data.need_role) {
        setGoogleToken(googleToken);
        setShowRoleSelection(true);
      }
    } catch (error) {
      setError(error.response?.data?.detail || "Google login failed.");
    }
    setGoogleLoading(false);
  };

  const handleRoleContinue = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const response = await api.post('/api/v1/auth/users/google/', {
        token: googleToken,
        role: selectedRole,
      });
      if (response.data.access) {
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        setShowRoleSelection(false);
        navigate('/welcome');
      }
    } catch (error) {
      setError(error.response?.data?.detail || "Role selection failed.");
    }
    setGoogleLoading(false);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-purple-500 opacity-10 blur-3xl -top-10 -left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 rounded-full bg-blue-500 opacity-10 blur-3xl bottom-1/4 -right-20 animate-pulse"></div>
        <div className="absolute w-80 h-80 rounded-full bg-indigo-500 opacity-10 blur-3xl bottom-10 left-1/3 animate-pulse"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="cursor-pointer">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Skill+Connect
            </h1>
          </Link>
          <p className="text-purple-200 mt-2">Welcome back! Sign in to your account</p>
        </div>

        {/* Login card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className={`transition-all duration-500 transform ${animateIn ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            <h2 className="text-xl font-bold text-white mb-6">Sign In</h2>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg mb-6 flex items-start">
                <AlertCircle className="text-red-400 mr-3 mt-0.5 flex-shrink-0" size={18} />
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              {/* Email Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-purple-300" size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300"
                  required
                  placeholder="Email Address"
                  autoComplete="email"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-purple-300" size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 pl-10 pr-10 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300"
                  required
                  placeholder="Password"
                  autoComplete="current-password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-purple-300 hover:text-white focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <a href="/forgot-password" className="text-sm text-purple-400 hover:text-white transition-colors cursor-pointer">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium transition-all transform hover:scale-105 focus:outline-none ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:from-blue-600 hover:to-purple-700"}`}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-purple-200 mb-4">or</p>
              <div className="flex justify-center space-x-4">
                <GoogleLogin
                  onSuccess={credentialResponse => handleGoogleSuccess(credentialResponse.credential)}
                  onError={() => setError("Google Sign-In failed")}
                  width="48"
                  theme="filled_black"
                  shape="circle"
                  logo_alignment="center"
                  disabled={googleLoading}
                />
                {/* <button className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <FaApple className="text-white" size={20} />
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Sign up link */}
        <div className="text-center mt-6">
          <p className="text-purple-200">
            Don&apos;t have an account? <a href="/register" className="text-purple-400 hover:text-white font-medium">Sign up</a>
          </p>
        </div>
      </div>

      {/* Role selection modal */}
      {showRoleSelection && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md">
            <RoleSelection
              selectedRole={selectedRole}
              onSelect={setSelectedRole}
              onContinue={handleRoleContinue}
              loading={googleLoading}
            />
            {error && <div className="text-red-400 mt-4">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
}