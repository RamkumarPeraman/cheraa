import axios from 'axios';
import config from '../config';
import * as mockData from './mockData';

const extractListData = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

const normalizeProject = (project) => {
  if (!project) {
    return project;
  }

  return {
    ...project,
    id: project.id || project._id,
  };
};

const normalizeEntity = (item) => {
  if (!item) {
    return item;
  }

  return {
    ...item,
    id: item.id || item._id,
  };
};

const extractUser = (payload) => payload?.user || payload?.data || payload;

const normalizeRole = (role) => {
  if (typeof role !== 'string') {
    return role;
  }

  const aliases = {
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin',
    MANAGER: 'manager',
    VOLUNTEER_COORDINATOR: 'volunteer_coordinator',
    MEMBER: 'member',
    VOLUNTEER: 'volunteer',
    DONOR: 'donor',
  };

  return aliases[role.trim().toUpperCase()] || role.trim().toLowerCase();
};

const emitAuthChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-changed'));
  }
};

const throwApiError = (error, fallbackMessage) => {
  if (!error.response) {
    throw new Error('API server is not reachable. Check https://raavanan-api.onrender.com/api.');
  }

  throw error.response?.data?.message ? new Error(error.response.data.message) : error;
};

const persistAuth = (payload, fallbackUserType = 'user') => {
  if (payload?.token) {
    localStorage.setItem('authToken', payload.token);
  }

  const user = extractUser(payload);
  if (user) {
    const normalizedUser = {
      ...user,
      role: normalizeRole(user.role),
    };
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('userType', normalizedUser.role || fallbackUserType);
    payload.user = normalizedUser;
  }

  emitAuthChange();

  return payload;
};

const clearAuth = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userType');
  localStorage.removeItem('user');
  emitAuthChange();
};

const api = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: config.api.headers,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    const isSignupRequest = error.config?.url?.includes('/auth/signup');

    if (error.response?.status === 401 && !isLoginRequest && !isSignupRequest) {
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const apiService = {
  createDonation: async (donationData) => {
    try {
      const response = await api.post('/donations', donationData);
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  getDonations: async (filters = {}) => {
    try {
      const response = await api.get('/donations', { params: filters });
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  getDonationById: async (id) => {
    try {
      const response = await api.get(`/donations/${id}`);
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  getDonationStats: async () => {
    try {
      const response = await api.get('/donations/stats');
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  updateDonationStatus: async (id, status) => {
    try {
      const response = await api.put(`/donations/${id}`, { paymentStatus: status });
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  createPaymentOrder: async (amount, donationId) => {
    try {
      const response = await api.post('/payments/create-order', { amount, donationId });
      return response.data;
    } catch (error) {
      console.log('Mock payment order created');
      return {
        success: true,
        orderId: 'order_' + Date.now(),
        amount: amount,
        currency: 'INR',
        key: config.payment.razorpayKey
      };
    }
  },

  verifyPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/verify', paymentData);
      return response.data;
    } catch (error) {
      console.log('Mock payment verified');
      return { success: true, message: 'Payment verified successfully' };
    }
  },

  createServiceRequest: async (serviceData) => {
    try {
      const response = await api.post('/services', serviceData);
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  getServiceRequests: async (filters = {}) => {
    try {
      const response = await api.get('/services', { params: filters });
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  getServiceRequestById: async (id) => {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  updateServiceStatus: async (id, status) => {
    try {
      const response = await api.put(`/services/${id}`, { status });
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  registerVolunteer: async (volunteerData) => {
    try {
      const response = await api.post('/volunteers/register', volunteerData);
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  submitVolunteerApplication: async (volunteerData) => apiService.registerVolunteer(volunteerData),

  volunteerLogin: async (credentials) => {
    try {
      const response = await api.post('/volunteers/login', credentials);
      return persistAuth(response.data, 'volunteer');
    } catch (error) {
      throwApiError(error);
    }
  },

  getVolunteers: async () => {
    try {
      const response = await api.get('/volunteers');
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  getVolunteerProfile: async (id) => {
    try {
      const response = await api.get(`/volunteers/${id}`);
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  updateVolunteerStatus: async (id, status) => {
    try {
      const response = await api.put(`/volunteers/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  getProjects: async (filters = {}) => {
    try {
      const response = await api.get('/projects', { params: filters });
      return extractListData(response.data).map(normalizeProject);
    } catch (error) {
      throwApiError(error);
    }
  },

  getProjectById: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return normalizeProject(response.data?.data || response.data);
    } catch (error) {
      throwApiError(error);
    }
  },

  getProjectMetrics: async () => {
    try {
      const response = await api.get('/projects/metrics');
      return response.data?.data || response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  getBlogs: async () => {
    try {
      const response = await api.get('/blogs');
      return extractListData(response.data).map(normalizeEntity);
    } catch (error) {
      throwApiError(error);
    }
  },

  getBlogById: async (id) => {
    try {
      const response = await api.get(`/blogs/${id}`);
      return normalizeEntity(response.data?.data || response.data);
    } catch (error) {
      throwApiError(error);
    }
  },

  getEvents: async (filters = {}) => {
    try {
      const response = await api.get('/events', { params: filters });
      return extractListData(response.data).map(normalizeEntity);
    } catch (error) {
      throwApiError(error);
    }
  },

  getEventById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return normalizeEntity(response.data?.data || response.data);
    } catch (error) {
      throwApiError(error);
    }
  },

  registerForEvent: async (eventId) => {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  },

  getMyRegisteredEvents: async () => {
    const response = await api.get('/events/registered/me');
    return extractListData(response.data).map(normalizeEntity);
  },

  getVolunteerOpportunities: async (filters = {}) => {
    try {
      const response = await api.get('/volunteer-opportunities', { params: filters });
      return extractListData(response.data).map(normalizeEntity);
    } catch (error) {
      throwApiError(error);
    }
  },

  createProjectAdmin: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data?.data || response.data;
  },

  updateProjectAdmin: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data?.data || response.data;
  },

  deleteProjectAdmin: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  createEventAdmin: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data?.data || response.data;
  },

  updateEventAdmin: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data?.data || response.data;
  },

  deleteEventAdmin: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  createBlogAdmin: async (blogData) => {
    const response = await api.post('/blogs', blogData);
    return response.data?.data || response.data;
  },

  updateBlogAdmin: async (id, blogData) => {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response.data?.data || response.data;
  },

  deleteBlogAdmin: async (id) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },

  createVolunteerOpportunityAdmin: async (opportunityData) => {
    const response = await api.post('/volunteer-opportunities', opportunityData);
    return response.data?.data || response.data;
  },

  updateVolunteerOpportunityAdmin: async (id, opportunityData) => {
    const response = await api.put(`/volunteer-opportunities/${id}`, opportunityData);
    return response.data?.data || response.data;
  },

  deleteVolunteerOpportunityAdmin: async (id) => {
    const response = await api.delete(`/volunteer-opportunities/${id}`);
    return response.data;
  },

  getTestimonials: async () => {
    try {
      const response = await api.get('/testimonials');
      return extractListData(response.data);
    } catch (error) {
      console.log('Using mock testimonials data');
      return mockData.mockTestimonials;
    }
  },

  submitContactForm: async (formData) => {
    try {
      const response = await api.post('/contact', formData);
      return response.data;
    } catch (error) {
      console.log('Mock contact form submitted');
      return { success: true, message: 'Message sent successfully' };
    }
  },

  submitFeedback: async (feedbackData) => {
    try {
      const response = await api.post('/feedback', feedbackData);
      return response.data;
    } catch (error) {
      console.log('Mock feedback submitted');
      return { success: true, message: 'Feedback submitted successfully' };
    }
  },

  subscribeToNewsletter: async (email) => {
    try {
      const response = await api.post('/newsletter/subscribe', { email });
      return response.data;
    } catch (error) {
      console.log('Mock newsletter subscription');
      return { success: true, message: 'Subscribed successfully' };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return persistAuth(response.data, credentials.userType || 'user');
    } catch (error) {
      throwApiError(error);
    }
  },

  signup: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return persistAuth(response.data, userData.role || 'member');
    } catch (error) {
      throwApiError(error);
    }
  },

  logout: () => {
    clearAuth();
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    const payload = { ...response.data, user: extractUser(response.data) };
    persistAuth(payload);
    return payload;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/me', profileData);
    const payload = { ...response.data, user: extractUser(response.data) };
    persistAuth(payload);
    return payload;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  deleteMyAccount: async (password) => {
    const response = await api.delete('/auth/me', { data: { password } });
    clearAuth();
    return response.data;
  },

  getUsers: async (filters = {}) => {
    const response = await api.get('/users', { params: filters });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  updateUserStatus: async (id, status) => {
    const response = await api.patch(`/users/${id}/status`, { status });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  getMerchandise: async () => {
    try {
      const response = await api.get('/merchandise');
      return extractListData(response.data);
    } catch (error) {
      console.log('Using mock merchandise data');
      return mockData.mockMerchandise;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.log('Mock order created');
      return { success: true, orderId: 'ORD' + Date.now() };
    }
  },

  getReports: async () => {
    try {
      const response = await api.get('/reports');
      return extractListData(response.data).map(normalizeEntity);
    } catch (error) {
      throwApiError(error);
    }
  },

  getReportById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return normalizeEntity(response.data?.data || response.data);
  },

  createReportAdmin: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data?.data || response.data;
  },

  updateReportAdmin: async (id, reportData) => {
    const response = await api.put(`/reports/${id}`, reportData);
    return response.data?.data || response.data;
  },

  deleteReportAdmin: async (id) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },

  getDashboardStats: async () => {
    const [stats, volunteers, services] = await Promise.all([
      apiService.getDonationStats(),
      apiService.getVolunteers(),
      apiService.getServiceRequests(),
    ]);

    return {
      success: true,
      data: {
        donations: stats.data,
        volunteers: volunteers.data?.length || 0,
        services: services.data?.length || 0,
        pendingServices: services.data?.filter((s) => s.status === 'pending').length || 0,
      },
    };
  },
};

export default apiService;

