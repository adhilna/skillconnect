import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import ServicesPage from './pages/ServicesPage';
import CreateServicePage from './pages/CreateServicePage';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<ServicesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/create-service' element={<CreateServicePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;