import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiPhone, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import apiService from '../services/api';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeTerms: false,
  });

  // Password strength indicator
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false,
    isLongEnough: false
  });

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    
    setSignupData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const checkPasswordStrength = (password) => {
    const strength = {
      score: 0,
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
      isLongEnough: password.length >= 8
    };

    // Calculate score
    if (strength.hasLower) strength.score++;
    if (strength.hasUpper) strength.score++;
    if (strength.hasNumber) strength.score++;
    if (strength.hasSpecial) strength.score++;
    if (strength.isLongEnough) strength.score++;

    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    const score = passwordStrength.score;
    if (score <= 2) return 'bg-red-500';
    if (score <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    const score = passwordStrength.score;
    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Medium';
    return 'Strong';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      // Mock login with role-based assignment
      let role = 'member';
      let name = loginData.email.split('@')[0];
      let membershipType = 'Regular Member';
      
      // Assign roles based on email domain or specific emails
      if (loginData.email === 'admin@rtngo.org' || loginData.email === 'superadmin@rtngo.org') {
        role = 'super_admin';
        name = 'Super Admin';
        membershipType = 'Staff Member';
      } else if (loginData.email === 'manager@rtngo.org') {
        role = 'admin';
        name = 'Admin User';
        membershipType = 'Staff Member';
      } else if (loginData.email === 'coordinator@rtngo.org') {
        role = 'volunteer_coordinator';
        name = 'Volunteer Coordinator';
        membershipType = 'Staff Member';
      } else if (loginData.email.includes('volunteer')) {
        role = 'volunteer';
        membershipType = 'Volunteer';
      } else if (loginData.email.includes('donor')) {
        role = 'donor';
        membershipType = 'Donor';
      }

      // Create full user object with all required fields
      const user = {
        id: Math.floor(Math.random() * 1000),
        name: name,
        email: loginData.email,
        role: role,
        joinDate: new Date().toISOString().split('T')[0],
        membershipType: membershipType,
        membershipId: 'RT' + Math.floor(Math.random() * 10000),
        phone: '+91 98765 43210',
        alternatePhone: '',
        dateOfBirth: '1990-01-01',
        gender: 'Not Specified',
        bloodGroup: 'O+',
        address: {
          street: '123 NGO Colony',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600001',
          country: 'India'
        },
        occupation: 'Professional',
        organization: 'Various',
        profileImage: null,
        bio: `I am a ${role} at Raavana Thalaigal NGO. Passionate about making a difference in the community.`,
        interests: ['Education', 'Healthcare', 'Environment'],
        skills: ['Teaching', 'Communication', 'Team Work'],
        socialLinks: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: ''
        },
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          whatsappUpdates: true,
          newsletter: true,
          eventReminders: true,
          volunteerOpportunities: true
        },
        privacy: {
          showEmail: false,
          showPhone: true,
          showAddress: false,
          showDonations: true
        },
        stats: {
          volunteerHours: role.includes('volunteer') ? 120 : 0,
          eventsAttended: 8,
          donationsMade: role === 'donor' ? 5 : 0,
          totalDonated: role === 'donor' ? 25000 : 0,
          projectsSupported: 3,
          badges: 2,
          impactScore: 450
        }
      };

      // Store in localStorage
      localStorage.setItem('authToken', 'mock-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set remember me
      if (loginData.rememberMe) {
        localStorage.setItem('rememberedEmail', loginData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      toast.success(`Welcome back, ${name}!`);
      
      // Redirect based on role
      if (role === 'super_admin' || role === 'admin') {
        navigate('/users');
      } else {
        navigate('/profile');
      }
      
      // Reload to update header state
      window.location.reload();
    } catch (error) {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validation
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!signupData.agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      // Determine role based on email
      let role = 'member';
      if (signupData.email.includes('volunteer')) {
        role = 'volunteer';
      } else if (signupData.email.includes('donor')) {
        role = 'donor';
      }

      // Create user object
      const user = {
        id: Math.floor(Math.random() * 1000),
        name: signupData.name,
        email: signupData.email,
        role: role,
        joinDate: new Date().toISOString().split('T')[0],
        membershipType: role === 'member' ? 'Regular Member' : role.charAt(0).toUpperCase() + role.slice(1),
        membershipId: 'RT' + Math.floor(Math.random() * 10000),
        phone: signupData.phone || '+91 98765 43210',
        alternatePhone: '',
        dateOfBirth: '',
        gender: 'Not Specified',
        bloodGroup: 'Unknown',
        address: {
          street: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India'
        },
        occupation: '',
        organization: '',
        profileImage: null,
        bio: `I am a new ${role} at Raavana Thalaigal NGO.`,
        interests: [],
        skills: [],
        socialLinks: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: ''
        },
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          whatsappUpdates: true,
          newsletter: true,
          eventReminders: true,
          volunteerOpportunities: true
        },
        privacy: {
          showEmail: false,
          showPhone: true,
          showAddress: false,
          showDonations: true
        },
        stats: {
          volunteerHours: 0,
          eventsAttended: 0,
          donationsMade: 0,
          totalDonated: 0,
          projectsSupported: 0,
          badges: 0,
          impactScore: 0
        }
      };

      // Store in localStorage
      localStorage.setItem('authToken', 'mock-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Registration successful! Welcome to Raavana Thalaigal!');
      navigate('/profile');
      window.location.reload();
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials with roles
  const demoCredentials = [
    { email: 'superadmin@rtngo.org', password: 'admin123', role: 'Super Admin', color: 'purple' },
    { email: 'admin@rtngo.org', password: 'admin123', role: 'Admin', color: 'red' },
    { email: 'manager@rtngo.org', password: 'manager123', role: 'Manager', color: 'blue' },
    { email: 'coordinator@rtngo.org', password: 'coord123', role: 'Coordinator', color: 'green' },
    { email: 'volunteer@rtngo.org', password: 'vol123', role: 'Volunteer', color: 'indigo' },
    { email: 'donor@rtngo.org', password: 'donor123', role: 'Donor', color: 'yellow' },
    { email: 'member@rtngo.org', password: 'member123', role: 'Member', color: 'gray' },
  ];

  const fillDemoCredentials = (email, password) => {
    setLoginData({
      ...loginData,
      email,
      password
    });
  };

  // Load remembered email on component mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setLoginData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true
      }));
    }
  }, []);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-primary-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-full mb-4 shadow-lg">
            <span className="text-white font-bold text-3xl">RT</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Welcome Back!' : 'Join Our Community'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              {isLogin ? 'Sign up here' : 'Login here'}
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        {isLogin && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <FiCheckCircle className="text-green-500 mr-2" />
              Demo Accounts (Click to fill)
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {demoCredentials.map((demo, index) => (
                <button
                  key={index}
                  onClick={() => fillDemoCredentials(demo.email, demo.password)}
                  className={`w-full text-left text-sm bg-${demo.color}-50 hover:bg-${demo.color}-100 p-3 rounded-lg border border-${demo.color}-200 transition-all transform hover:scale-102`}
                >
                  <span className={`font-semibold text-${demo.color}-700`}>{demo.role}:</span>
                  <span className="text-gray-600 ml-2">{demo.email}</span>
                  <span className="text-gray-400 text-xs ml-2">({demo.password})</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Different roles show different permissions and access levels
            </p>
          </div>
        )}

        {/* Login Form */}
        {isLogin ? (
          <form onSubmit={handleLogin} className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-200 transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-200 transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={loginData.rememberMe}
                  onChange={handleLoginChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By logging in, you agree to our{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-500">Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500">Privacy Policy</Link>
              </p>
            </div>
          </form>
        ) : (
          /* Signup Form */
          <form onSubmit={handleSignup} className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-200 transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="signup-email">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-200 transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={signupData.phone}
                  onChange={handleSignupChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-200 transition-all"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="signup-password">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-200 transition-all"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {signupData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs ml-2 font-medium">
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <span className={passwordStrength.isLongEnough ? 'text-green-600' : 'text-gray-400'}>
                      ✓ 8+ characters
                    </span>
                    <span className={passwordStrength.hasLower ? 'text-green-600' : 'text-gray-400'}>
                      ✓ Lowercase
                    </span>
                    <span className={passwordStrength.hasUpper ? 'text-green-600' : 'text-gray-400'}>
                      ✓ Uppercase
                    </span>
                    <span className={passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-400'}>
                      ✓ Number
                    </span>
                    <span className={passwordStrength.hasSpecial ? 'text-green-600' : 'text-gray-400'}>
                      ✓ Special char
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-200 transition-all"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {signupData.confirmPassword && signupData.password !== signupData.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="mb-6">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={signupData.agreeTerms}
                  onChange={handleSignupChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1 cursor-pointer"
                  required
                />
                <span className="ml-2 text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By signing up, you agree to receive updates about our programs and events.
                You can unsubscribe at any time.
              </p>
            </div>
          </form>
        )}
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default LoginPage;