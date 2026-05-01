import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LandingPage } from './pages/landing-page';
import { LoginPage } from './pages/login-page';
import { SignupPage } from './pages/signup-page';
import Dashboard from './pages/dashboard.jsx';
import AboutPage from './pages/about-page.jsx';
import ProjectsPage from './pages/projects-page.jsx';
import './App.css';
import { useEffect } from 'react';
import Navbar from './components/layout/navbar.jsx';
import PrivacyPage from './pages/privacy-page';
import TermsPage from './pages/terms-page';
import NotFound from './pages/not-found';
function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);


  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;