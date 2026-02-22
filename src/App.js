import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import DonationPage from './pages/DonationPage';
import VolunteerPage from './pages/VolunteerPage';
import ProjectsPage from './pages/ProjectsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import BlogsMediaPage from './pages/BlogsMediaPage';
import EventsPage from './pages/EventsPage';
import ProfilePage from './pages/ProfilePage';
import UserGroupPage from './pages/UserGroupPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import ReportsPage from './pages/ReportsPage';
import ContactPage from './pages/ContactPage';
import NotificationsPage from './pages/NotificationsPage';
import MessagesPage from './pages/MessagesPage';
import MyImpactPage from './pages/MyImpactPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/donate" element={<DonationPage />} />
            <Route path="/volunteer" element={<VolunteerPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/blogs" element={<BlogsMediaPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Protected User Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/my-impact" element={
              <ProtectedRoute>
                <MyImpactPage />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <AccountSettingsPage />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/my-groups" element={
              <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                <UserGroupPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole={['admin', 'super_admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </Router>
  );
}

export default App;