import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';
import FreelancerProfileSetup from './modules/freelancer/pages/FreelancerProfileSetup ';
import ClientProfileSetup from './modules/client/pages/ClientProfileSetup';
import ErrorBoundary from './components/ErrorBoundary';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ExplorePage from './pages/ExplorePage';
import HowItWorksPage from './pages/HowItWorksPage';
import FreelancerDashboard from './modules/freelancer/pages/FreelancerDashboard';
import ClientDashboard from './modules/client/pages/ClientDashboard';
import EnterprisePage from './pages/EnterprisePage';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-100">
        <ErrorBoundary>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path='/welcome' element={<WelcomePage />} />
            <Route path='/freelancer/profile' element={<FreelancerProfileSetup />} />
            <Route path='/client/profile' element={<ClientProfileSetup />} />
            <Route path='/explore' element={<ExplorePage />} />
            <Route path='/how-it-works' element={<HowItWorksPage />} />
            <Route path='/enterprise' element={<EnterprisePage />} />
            <Route path='freelancer/dashboard' element={<FreelancerDashboard />} />
            <Route path='client/dashboard' element={<ClientDashboard />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
