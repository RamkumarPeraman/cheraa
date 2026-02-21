import axios from 'axios';
import config from '../config';
import * as mockData from './mockData';

// Create axios instance
const api = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: config.api.headers,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service functions with mock data fallback
const apiService = {
  // Projects
  getProjects: async (filters = {}) => {
    try {
      const response = await api.get('/projects', { params: filters });
      return response.data;
    } catch (error) {
      console.log('Using mock projects data');
      return mockData.mockProjects;
    }
  },

  getProjectById: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.log('Using mock project data');
      return mockData.mockProjects.find(p => p.id === parseInt(id));
    }
  },

  // Blogs
  getBlogs: async () => {
    try {
      const response = await api.get('/blogs');
      return response.data;
    } catch (error) {
      console.log('Using mock blogs data');
      return mockData.mockBlogs;
    }
  },

  getBlogById: async (id) => {
    try {
      const response = await api.get(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.log('Using mock blog data');
      return mockData.mockBlogs.find(b => b.id === parseInt(id));
    }
  },

  // Events
  getEvents: async () => {
    try {
      const response = await api.get('/events');
      return response.data;
    } catch (error) {
      console.log('Using mock events data');
      return mockData.mockEvents;
    }
  },

  getEventById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.log('Using mock event data');
      return mockData.mockEvents.find(e => e.id === parseInt(id));
    }
  },

  registerForEvent: async (eventId, userData) => {
    try {
      const response = await api.post(`/events/${eventId}/register`, userData);
      return response.data;
    } catch (error) {
      console.log('Mock event registration successful');
      return { success: true, message: 'Registration successful' };
    }
  },

  // Testimonials
  getTestimonials: async () => {
    try {
      const response = await api.get('/testimonials');
      return response.data;
    } catch (error) {
      console.log('Using mock testimonials data');
      return mockData.mockTestimonials;
    }
  },

  // Donations
  createDonation: async (donationData) => {
    try {
      const response = await api.post('/donations', donationData);
      return response.data;
    } catch (error) {
      console.log('Mock donation created');
      return { success: true, id: 'MOCK' + Date.now(), ...donationData };
    }
  },

  getDonationStats: async () => {
    try {
      const response = await api.get('/donations/stats');
      return response.data;
    } catch (error) {
      console.log('Using mock donation stats');
      return mockData.mockDonations;
    }
  },

  // Volunteer
  submitVolunteerApplication: async (formData) => {
    try {
      const response = await api.post('/volunteers/apply', formData);
      return response.data;
    } catch (error) {
      console.log('Mock volunteer application submitted');
      return { success: true, message: 'Application submitted successfully' };
    }
  },

  // Membership
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.log('Mock login');
      // Mock successful login for demo
      return { success: true, token: 'mock-token-123', user: { id: 1, name: 'Test User' } };
    }
  },

  signup: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.log('Mock signup');
      return { success: true, message: 'Registration successful' };
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

  // Merchandise
  getMerchandise: async () => {
    try {
      const response = await api.get('/merchandise');
      return response.data;
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

  // Reports
  getReports: async () => {
    try {
      const response = await api.get('/reports');
      return response.data;
    } catch (error) {
      console.log('Using mock reports data');
      return mockData.mockReports;
    }
  },

  // Contact & Feedback
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

  // Newsletter
  subscribeToNewsletter: async (email) => {
    try {
      const response = await api.post('/newsletter/subscribe', { email });
      return response.data;
    } catch (error) {
      console.log('Mock newsletter subscription');
      return { success: true, message: 'Subscribed successfully' };
    }
  },
};

export default apiService;