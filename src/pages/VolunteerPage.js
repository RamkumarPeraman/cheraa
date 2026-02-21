import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiHeart, FiClock, FiAward, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import apiService from '../services/api';

const VolunteerPage = () => {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    dateOfBirth: '',
    occupation: '',
    interests: [],
    skills: [],
    availability: {
      weekdays: false,
      weekends: false,
      mornings: false,
      afternoons: false,
      evenings: false,
    },
    hoursPerWeek: '',
    experience: '',
    motivation: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    hearAbout: '',
    agreeToTerms: false,
  });

  // Interest options
  const interestOptions = [
    'Education & Tutoring',
    'Healthcare & Medical',
    'Women Empowerment',
    'Child Welfare',
    'Environmental Conservation',
    'Fundraising & Events',
    'Administrative Support',
    'Social Media & Marketing',
    'Photography & Videography',
    'Teaching & Training',
    'Counseling & Support',
    'Legal Aid',
    'Skill Development',
    'Research & Documentation',
  ];

  // Skill options
  const skillOptions = [
    'Teaching',
    'Medical/Healthcare',
    'Counseling',
    'Event Management',
    'Social Media',
    'Content Writing',
    'Photography',
    'Video Editing',
    'Graphic Design',
    'Fundraising',
    'Data Entry',
    'Project Management',
    'Legal Knowledge',
    'First Aid',
    'Language Translation',
    'Public Speaking',
  ];

  // Volunteer opportunities
  const opportunities = [
    {
      id: 1,
      title: 'Evening Tutor for Underprivileged Children',
      location: 'Chennai - Multiple Centers',
      commitment: '2-3 hours/week',
      category: 'Education',
      description: 'Help children with their homework and teach basic subjects in our evening study centers.',
      requirements: ['Good communication skills', 'Patience with children', 'Basic math and language skills'],
      spots: 5,
      image: '/assets/volunteer/tutoring.jpg',
    },
    {
      id: 2,
      title: 'Healthcare Camp Assistant',
      location: 'Rural Areas near Chennai',
      commitment: 'Full day on weekends',
      category: 'Healthcare',
      description: 'Assist doctors and nurses during our mobile medical camps in rural communities.',
      requirements: ['Medical background preferred', 'Compassionate', 'Ability to travel'],
      spots: 3,
      image: '/assets/volunteer/healthcare.jpg',
    },
    {
      id: 3,
      title: 'Women Empowerment Workshop Facilitator',
      location: 'Chennai',
      commitment: '4 hours/week',
      category: 'Women Empowerment',
      description: 'Conduct skill development workshops for women from low-income communities.',
      requirements: ['Experience in training/facilitation', 'Knowledge of any skill (sewing, computer, etc.)'],
      spots: 2,
      image: '/assets/volunteer/women.jpg',
    },
    {
      id: 4,
      title: 'Tree Plantation Drive Coordinator',
      location: 'Chennai & Surroundings',
      commitment: 'Flexible',
      category: 'Environment',
      description: 'Help organize and coordinate tree plantation events in different parts of the city.',
      requirements: ['Organizational skills', 'Passion for environment', 'Physical fitness'],
      spots: 8,
      image: '/assets/volunteer/environment.jpg',
    },
    {
      id: 5,
      title: 'Social Media Volunteer',
      location: 'Remote',
      commitment: '5-7 hours/week',
      category: 'Communications',
      description: 'Help manage our social media accounts and create engaging content about our work.',
      requirements: ['Social media expertise', 'Content creation skills', 'Creative thinking'],
      spots: 2,
      image: '/assets/volunteer/social.jpg',
    },
    {
      id: 6,
      title: 'Fundraising Event Volunteer',
      location: 'Chennai',
      commitment: 'Event-based',
      category: 'Fundraising',
      description: 'Help organize and run fundraising events, from planning to execution.',
      requirements: ['Event management skills', 'Enthusiasm', 'Team player'],
      spots: 10,
      image: '/assets/volunteer/fundraising.jpg',
    },
  ];

  // Testimonials
  const volunteerTestimonials = [
    {
      id: 1,
      name: 'Priya Krishnan',
      role: 'Education Volunteer',
      content: 'Volunteering as a tutor has been the most rewarding experience. Seeing the children smile and learn gives me immense satisfaction.',
      duration: '2 years',
      image: '/assets/testimonials/priya.jpg',
    },
    {
      id: 2,
      name: 'Arun Kumar',
      role: 'Healthcare Volunteer',
      content: 'Being part of the medical camps has opened my eyes to the healthcare needs of rural communities. Every weekend well spent!',
      duration: '1.5 years',
      image: '/assets/testimonials/arun.jpg',
    },
    {
      id: 3,
      name: 'Deepa Rajan',
      role: 'Women Empowerment Volunteer',
      content: 'Teaching women new skills and seeing them become financially independent is priceless. This organization does amazing work.',
      duration: '3 years',
      image: '/assets/testimonials/deepa.jpg',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (type === 'checkbox' && name === 'interests') {
      // Handle interests array
      const interest = value;
      setFormData(prev => ({
        ...prev,
        interests: prev.interests.includes(interest)
          ? prev.interests.filter(i => i !== interest)
          : [...prev.interests, interest]
      }));
    } else if (type === 'checkbox' && name === 'skills') {
      // Handle skills array
      const skill = value;
      setFormData(prev => ({
        ...prev,
        skills: prev.skills.includes(skill)
          ? prev.skills.filter(s => s !== skill)
          : [...prev.skills, skill]
      }));
    } else if (name.startsWith('availability.')) {
      // Handle availability object
      const day = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          [day]: checked
        }
      }));
    } else {
      // Handle regular fields
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.submitVolunteerApplication(formData);
      
      if (response.success) {
        toast.success('Thank you for applying! We will contact you soon.');
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          dateOfBirth: '',
          occupation: '',
          interests: [],
          skills: [],
          availability: {
            weekdays: false,
            weekends: false,
            mornings: false,
            afternoons: false,
            evenings: false,
          },
          hoursPerWeek: '',
          experience: '',
          motivation: '',
          emergencyContact: {
            name: '',
            phone: '',
            relationship: '',
          },
          hearAbout: '',
          agreeToTerms: false,
        });
        setActiveTab('opportunities');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpportunityApply = (opportunity) => {
    setActiveTab('apply');
    // Pre-fill some data based on opportunity
    setFormData(prev => ({
      ...prev,
      interests: [...prev.interests, opportunity.category],
    }));
    toast.info(`You're applying for: ${opportunity.title}`);
  };

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Volunteer With Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our mission to create lasting change. Your time and skills can make a real difference in someone's life.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: FiHeart, value: '500+', label: 'Active Volunteers' },
            { icon: FiClock, value: '50,000+', label: 'Hours Contributed' },
            { icon: FiAward, value: '25+', label: 'Ongoing Projects' },
            { icon: FiCheckCircle, value: '100+', label: 'Events Yearly' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
              <stat.icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${
              activeTab === 'opportunities'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Volunteer Opportunities
          </button>
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${
              activeTab === 'apply'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Apply as Volunteer
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${
              activeTab === 'testimonials'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Volunteer Stories
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${
              activeTab === 'faq'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            FAQs
          </button>
        </div>

        {/* Opportunities Tab */}
        {activeTab === 'opportunities' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Current Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <div key={opp.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gray-300 relative">
                    <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
                      {opp.spots} {opp.spots === 1 ? 'spot' : 'spots'} left
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-primary-600 font-semibold bg-primary-50 px-3 py-1 rounded-full">
                        {opp.category}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <FiMapPin className="mr-1" size={14} />
                        {opp.location}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{opp.title}</h3>
                    <p className="text-gray-600 mb-4">{opp.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-gray-700 mb-2">
                        <FiClock className="mr-2 text-primary-600" />
                        <span className="font-medium">Commitment:</span> {opp.commitment}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Requirements:</span>
                        <ul className="mt-2 space-y-1">
                          {opp.requirements.map((req, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <FiCheckCircle className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" size={14} />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpportunityApply(opp)}
                      className="w-full btn-primary"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Application Form Tab */}
        {activeTab === 'apply' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Volunteer Application Form</h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FiUser className="mr-2 text-primary-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                  <input
                    type="date"
                    name="dateOfBirth"
                    placeholder="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    name="occupation"
                    placeholder="Occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FiMapPin className="mr-2 text-primary-600" />
                  Address
                </h3>
                <div className="space-y-4">
                  <textarea
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  ></textarea>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Areas of Interest */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Areas of Interest *</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {interestOptions.map((interest) => (
                    <label key={interest} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="interests"
                        value={interest}
                        checked={formData.interests.includes(interest)}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Skills & Expertise</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {skillOptions.map((skill) => (
                    <label key={skill} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="skills"
                        value={skill}
                        checked={formData.skills.includes(skill)}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FiCalendar className="mr-2 text-primary-600" />
                  Availability
                </h3>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Days Available</p>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="availability.weekdays"
                        checked={formData.availability.weekdays}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Weekdays</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="availability.weekends"
                        checked={formData.availability.weekends}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Weekends</span>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preferred Time</p>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="availability.mornings"
                        checked={formData.availability.mornings}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Mornings (8AM - 12PM)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="availability.afternoons"
                        checked={formData.availability.afternoons}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Afternoons (12PM - 4PM)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="availability.evenings"
                        checked={formData.availability.evenings}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Evenings (4PM - 8PM)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours per week you can commit
                  </label>
                  <select
                    name="hoursPerWeek"
                    value={formData.hoursPerWeek}
                    onChange={handleInputChange}
                    className="w-full md:w-64 p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  >
                    <option value="">Select hours</option>
                    <option value="1-2">1-2 hours</option>
                    <option value="3-5">3-5 hours</option>
                    <option value="6-10">6-10 hours</option>
                    <option value="10+">10+ hours</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              {/* Experience & Motivation */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Experience & Motivation</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Volunteer Experience
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Tell us about any previous volunteer experience..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to volunteer with us? *
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Share your motivation and what you hope to achieve..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  ></textarea>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="emergencyContact.name"
                    placeholder="Contact Name"
                    value={formData.emergencyContact.name}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                  <input
                    type="tel"
                    name="emergencyContact.phone"
                    placeholder="Contact Phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    name="emergencyContact.relationship"
                    placeholder="Relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* How did you hear about us */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">How did you hear about us?</h3>
                <select
                    name="hearAbout"
                    value={formData.hearAbout}
                    onChange={handleInputChange}
                    className="w-full md:w-96 p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  >
                    <option value="">Select an option</option>
                    <option value="social">Social Media</option>
                    <option value="friend">Friend/Family</option>
                    <option value="website">Our Website</option>
                    <option value="event">Event</option>
                    <option value="newspaper">Newspaper/Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

              {/* Terms and Conditions */}
              <div className="mb-8">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1"
                  />
                  <span className="text-sm text-gray-600">
                    I confirm that the information provided is true and accurate. I agree to follow the organization's policies and code of conduct. *
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Volunteer Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {volunteerTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl font-bold text-primary-600">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-lg">{testimonial.name}</h3>
                      <p className="text-primary-600 text-sm">{testimonial.role}</p>
                      <p className="text-gray-500 text-xs">{testimonial.duration} with us</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "What is the minimum time commitment?",
                  a: "We ask for a minimum commitment of 3 months, with at least 2-4 hours per week. However, some event-based opportunities may have different requirements."
                },
                {
                  q: "Do I need any specific qualifications?",
                  a: "While some roles may require specific skills, many opportunities are open to everyone. We provide training for most volunteer positions."
                },
                {
                  q: "Is there an age limit to volunteer?",
                  a: "Volunteers must be 18 or older. However, we have special programs for students aged 16-17 with parental consent."
                },
                {
                  q: "Will I get a certificate?",
                  a: "Yes, we provide certificates of appreciation for all volunteers. For long-term volunteers, we also provide detailed reference letters."
                },
                {
                  q: "Can I volunteer remotely?",
                  a: "Yes, we have several remote volunteering opportunities including content writing, social media management, and online tutoring."
                },
                {
                  q: "How soon can I start after applying?",
                  a: "After submitting your application, we'll contact you within 3-5 business days for an interview and orientation."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="font-semibold text-lg mb-2 text-primary-600">{faq.q}</h3>
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerPage;