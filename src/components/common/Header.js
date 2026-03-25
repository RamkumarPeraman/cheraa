import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiMenu, FiX, FiHome, FiHeart, FiCalendar, FiFileText,
  FiUsers, FiShoppingBag, FiMail, FiPhone, FiMapPin,
  FiUser, FiSettings, FiLogOut, FiChevronDown, FiBell,
  FiGrid, FiBookOpen, FiAward, FiMessageCircle, FiBarChart2
} from 'react-icons/fi';
import { FaUserFriends } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ravanaLogo from '../../asset/image/ravanan.png';
import apiService from '../../services/api';

const normalizeRole = (role) => {
  if (typeof role !== 'string') {
    return role;
  }

  const aliases = {
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin',
  };

  return aliases[role.trim().toUpperCase()] || role.trim().toLowerCase();
};

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const syncAuthState = () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
        setIsLoggedIn(false);
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    syncAuthState();

    const handleAuthChanged = () => syncAuthState();
    const handleStorage = () => syncAuthState();

    window.addEventListener('auth-changed', handleAuthChanged);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('auth-changed', handleAuthChanged);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
    setIsUserMenuOpen(false);
    syncAuthState();
  }, [location]);

  const handleLogout = () => {
    apiService.logout();
    setIsLoggedIn(false);
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    document.body.style.overflow = !isSidebarOpen ? 'hidden' : 'unset';
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    document.body.style.overflow = 'unset';
  };

  const isAdmin = ['admin', 'super_admin'].includes(normalizeRole(user?.role));

  const sidebarNavItems = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Projects', path: '/projects', icon: FiGrid },
    { name: 'Blogs & Media', path: '/blogs', icon: FiFileText },
    { name: 'Events', path: '/events', icon: FiCalendar },
    { name: 'Volunteer', path: '/volunteer', icon: FiUsers },
    { name: 'Donate', path: '/donate', icon: FiHeart },
    { name: 'Reports', path: '/reports', icon: FiBookOpen },
    { name: 'Contact', path: '/contact', icon: FiMail },
  ];

  if (isAdmin) {
    sidebarNavItems.push({ name: 'Admin Dashboard', path: '/admin', icon: FiBarChart2 });
  }

  const userMenuItems = isLoggedIn ? [
    { name: 'My Profile', path: '/profile', icon: FiUser },
    { name: 'My Groups', path: '/my-groups', icon: FaUserFriends },
    { name: 'My Impact', path: '/my-impact', icon: FiAward },
    { name: 'Messages', path: '/messages', icon: FiMessageCircle },
    { name: 'Notifications', path: '/notifications', icon: FiBell },
    { name: 'Account Settings', path: '/settings', icon: FiSettings },
  ] : [];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-gradient-to-r from-primary-700 to-primary-600'}`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-14 md:h-18">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className={`p-2 rounded-lg mr-4 transition-colors ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-primary-500'}`}
                aria-label="Toggle menu"
              >
                {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>

              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center">
                  <img src={ravanaLogo} alt="" />
                </div>
                <span className={`font-bold text-sm md:text-xl ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                  Raavana Thalaigal
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <Link
                to="/donate"
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-semibold transition-all ${scrolled ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-white text-primary-600 hover:bg-gray-100'}`}
              >
                <span className="hidden md:inline">Donate Now</span>
                <FiHeart className="md:hidden" size={20} />
              </Link>

              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center space-x-2 p-1.5 md:p-2 rounded-lg transition-colors ${scrolled ? 'hover:bg-gray-100' : 'hover:bg-primary-500'}`}
                  >
                    <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold">{user?.name?.charAt(0) || 'U'}</span>
                    </div>
                    <FiChevronDown className={scrolled ? 'text-gray-700' : 'text-white'} size={16} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                      <Link to="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}><FiUser className="mr-2" />My Profile</Link>
                      <Link to="/my-impact" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}><FiAward className="mr-2" />My Impact</Link>
                      <Link to="/messages" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}><FiMessageCircle className="mr-2" />Messages</Link>
                      <Link to="/notifications" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}><FiBell className="mr-2" />Notifications</Link>
                      <Link to="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}><FiSettings className="mr-2" />Account Settings</Link>

                      {isAdmin && (
                        <>
                          <div className="border-t border-gray-100 my-1"></div>
                          <Link to="/admin" className="flex items-center px-4 py-2 text-purple-600 hover:bg-purple-50" onClick={() => setIsUserMenuOpen(false)}><FiBarChart2 className="mr-2" />Admin Dashboard</Link>
                          <Link to="/my-groups" className="flex items-center px-4 py-2 text-purple-600 hover:bg-purple-50" onClick={() => setIsUserMenuOpen(false)}><FiUsers className="mr-2" />User Management</Link>
                        </>
                      )}

                      <div className="border-t border-gray-100 my-1"></div>
                      <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50"><FiLogOut className="mr-2" />Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-primary-500'}`}>
                  <FiUser size={18} />
                  <span className="hidden md:inline">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" onClick={closeSidebar} />}

      <aside className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <img src={ravanaLogo} alt="" />
                </div>
                <div>
                  <h2 className="text-white font-bold">Raavana Thalaigal</h2>
                  <p className="text-primary-100 text-sm">Empowering Communities</p>
                </div>
              </div>
              <button onClick={closeSidebar} className="text-white hover:bg-primary-500 p-1 rounded"><FiX size={20} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4 mb-6">
              <nav className="space-y-1">
                {sidebarNavItems.map((item) => (
                  <Link key={item.path} to={item.path} className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-100'}`} onClick={closeSidebar}>
                    <item.icon className="mr-3" size={20} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {isLoggedIn && userMenuItems.length > 0 && (
              <div className="px-4 mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">My Account</h3>
                <nav className="space-y-1">
                  {userMenuItems.map((item) => (
                    <Link key={item.path} to={item.path} className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-100'}`} onClick={closeSidebar}>
                      <item.icon className="mr-3" size={20} />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  <button onClick={() => { handleLogout(); closeSidebar(); }} className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"><FiLogOut className="mr-3" size={20} /><span>Logout</span></button>
                </nav>
              </div>
            )}

            {!isLoggedIn && (
              <div className="px-4 mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Actions</h3>
                <div className="space-y-2">
                  <Link to="/login" className="flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors" onClick={closeSidebar}><FiUser className="mr-2" />Login / Sign Up</Link>
                  <Link to="/donate" className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" onClick={closeSidebar}><FiHeart className="mr-2" />Donate Now</Link>
                </div>
              </div>
            )}

            <div className="px-4 mt-auto">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">Get in Touch</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center"><FiPhone className="mr-2 text-primary-600" size={14} /><span>+91 98765 43210</span></div>
                  <div className="flex items-center"><FiMail className="mr-2 text-primary-600" size={14} /><span>info@rtngo.org</span></div>
                  <div className="flex items-start"><FiMapPin className="mr-2 text-primary-600 mt-1" size={14} /><span>Chennai, Tamil Nadu</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">2024 Raavana Thalaigal. All rights reserved.</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Header;
