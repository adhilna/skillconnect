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
import DashboardOverview from './modules/client/components/clientDashboard/DashboardOverview';
import BrowseTalentSection from './modules/client/components/clientDashboard/BrowseTalentSection';
import ExploreServicesSection from './modules/client/components/clientDashboard/ExploreServicesSection';
import ProposalsSection from './modules/client/components/clientDashboard/ProposalsSection';
import ClientProposalOrdersSection from './modules/client/components/clientDashboard/OrderSection';
import MessagesSection from './modules/client/components/clientDashboard/MessagesSection';
import FreelancersSection from './modules/client/components/clientDashboard/FreelancersSection';
import PaymentDashboard from './modules/client/components/clientDashboard/PaymentSection';
import AnalyticsSection from './modules/client/components/clientDashboard/AnalyticsSection';
import ProfileSection from './modules/client/components/clientDashboard/ProfileSection';
import SettingsSection from './modules/client/components/clientDashboard/SettingsSection';
import EnterprisePage from './pages/EnterprisePage';
import { ToastProvider } from './context/ToastContext';
import { useToast } from './hooks/useToast';
import ToastContainer from './components/Shared/toast/ToastContainer';
import FreelancerProfileView from './modules/freelancer/pages/FreelancerProfileView';
import ClientProfileView from './modules/client/pages/ClientProfileView';

function App() {
  return (
    <ToastProvider>
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
              {/* Client Dashboard Parent */}
              <Route path="client/dashboard" element={<ClientDashboard />}>
                {/* Child Routes */}
                <Route index element={<DashboardOverview />} />
                <Route path="browse" element={<BrowseTalentSection />} />
                <Route path="explore" element={<ExploreServicesSection />} />
                <Route path="proposals" element={<ProposalsSection />} />
                <Route path="orders" element={<ClientProposalOrdersSection />} />
                <Route path="messages" element={<MessagesSection />} />
                <Route path="freelancers" element={<FreelancersSection />} />
                <Route path="payments" element={<PaymentDashboard />} />
                <Route path="analytics" element={<AnalyticsSection />} />
                <Route path="profile" element={<ProfileSection />} />
                <Route path="settings" element={<SettingsSection />} />
              </Route>
              <Route path="/freelancers/:id/view" element={<FreelancerProfileView />} />
              <Route path="/freelancer/clients/:id" element={<ClientProfileView />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </Router>
      <ToastConsumer />
    </ToastProvider>
  );
}

const ToastConsumer = () => {
  const { toasts, removeToast } = useToast();
  return <ToastContainer toasts={toasts} onRemove={removeToast} />;
};

export default App;
