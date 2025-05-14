import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import ServicesPage from './pages/ServicesPage';
import CreateServicePage from './pages/CreateServicePage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import RoleSelectPage from './pages/RoleSelectPage';
import SplashScreen from './pages/SplashScreen';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-100">
        {/* <Navbar /> */}
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/role-select" element={<RoleSelectPage />} />
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/create-service' element={<CreateServicePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;