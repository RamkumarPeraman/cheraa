// API Configuration
const config = {
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'https://api.raavana-thalaigal.org/v1',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  },
  
  // Feature flags for phased implementation
  features: {
    phase1: {
      donation: true,
      volunteer: true,
      blogs: true,
      contact: true,
    },
    phase2: {
      membership: false,
      proposals: false,
      reviews: false,
      mailing: false,
    },
    phase3: {
      community: false,
      grievance: false,
      advancedReports: false,
    },
  },
  
  // Payment configuration
  payment: {
    razorpayKey: process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_mock_key',
    currency: 'INR',
  },
  
  // Social media links
  socialMedia: {
    facebook: 'https://facebook.com/raavanathalaigal',
    twitter: 'https://twitter.com/raavanathalaigal',
    instagram: 'https://instagram.com/raavanathalaigal',
    linkedin: 'https://linkedin.com/company/raavanathalaigal',
    youtube: 'https://youtube.com/raavanathalaigal',
  },
  
  // Navigation items
  navigation: {
    main: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Projects', path: '/projects' },
      { name: 'Blogs', path: '/blogs' },
      { name: 'Events', path: '/events' },
      { name: 'Volunteer', path: '/volunteer' },
      { name: 'Donate', path: '/donate' },
      { name: 'Contact', path: '/contact' },
    ],
    footer: {
      quickLinks: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Careers', path: '/careers' },
      ],
      resources: [
        { name: 'Annual Reports', path: '/reports' },
        { name: 'Publications', path: '/publications' },
        { name: 'Media Kit', path: '/media-kit' },
      ],
    },
  },
  
  // Announcement banner
  announcement: {
    // show: fal,
    // message: "Help us reach our goal of educating 1000 children this year!",
    // cta: "Donate Now",
    // ctaLink: "/donate",
  },
  
  // Impact metrics
  impactMetrics: {
    lives: 5000,
    volunteers: 500,
    projects: 25,
    states: 10,
  },
};

export default config;