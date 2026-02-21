import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import DonationPage from './pages/DonationPage';
import VolunteerPage from './pages/VolunteerPage';
import ProjectsPage from './pages/ProjectsPage';
import LoginPage from './pages/LoginPage';
import BlogsMediaPage from './pages/BlogsMediaPage';
import EventsPage from './pages/EventsPage';
import ProfilePage from './pages/ProfilePage';
import UserGroupPage from './pages/UserGroupPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import ReportsPage from './pages/ReportsPage';
import ContactPage from './pages/ContactPage'; // Add this import

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/donate" element={<DonationPage />} />
            <Route path="/volunteer" element={<VolunteerPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/blogs" element={<BlogsMediaPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-groups" element={<UserGroupPage />} />
            <Route path="/settings" element={<AccountSettingsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/contact" element={<ContactPage />} /> {/* Add this route */}
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </Router>
  );
}

export default App;