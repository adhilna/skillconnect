import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';
import FreelancerProfileSetup from './pages/FreelancerProfileSetup ';
import ClientProfileSetup from './pages/ClientProfileSetup';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/welcome' element={<WelcomePage />} />
          <Route path='/freelancer/profile' element={<FreelancerProfileSetup />} />
          <Route path='/client/profile' element={<ClientProfileSetup />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;