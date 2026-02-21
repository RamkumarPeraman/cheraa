import React, { useState } from 'react';
import { FiHeart, FiLock, FiCreditCard, FiCalendar, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import apiService from '../services/api';

const DonationPage = () => {
  const [donationType, setDonationType] = useState('one-time');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [project, setProject] = useState('general');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    pan: '',
    anonymous: false,
  });
  const [loading, setLoading] = useState(false);

  const predefinedAmounts = [500, 1000, 2000, 5000, 10000];

  const handleAmountSelect = (value) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmount = (e) => {
    setCustomAmount(e.target.value);
    setAmount('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const donationAmount = customAmount || amount;
    if (!donationAmount) {
      toast.error('Please select or enter an amount');
      return;
    }

    setLoading(true);

    try {
      const donationData = {
        type: donationType,
        amount: parseFloat(donationAmount),
        project,
        paymentMethod,
        ...formData,
      };

      const response = await apiService.createDonation(donationData);
      
      if (response.success) {
        toast.success('Thank you for your donation!');
        // Reset form
        setDonationType('one-time');
        setAmount('');
        setCustomAmount('');
        setProject('general');
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          pan: '',
          anonymous: false,
        });
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Make a Donation</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your support helps us continue our mission of empowering communities 
            and transforming lives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              {/* Donation Type */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Donation Type</h3>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setDonationType('one-time')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                      donationType === 'one-time'
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    One-time
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationType('monthly')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                      donationType === 'monthly'
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Select Amount (₹)</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                  {predefinedAmounts.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleAmountSelect(value)}
                      className={`py-3 px-2 rounded-lg border-2 transition-all ${
                        amount === value
                          ? 'border-primary-600 bg-primary-50 text-primary-600'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      ₹{value}
                    </button>
                  ))}
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={handleCustomAmount}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    min="1"
                  />
                </div>
              </div>

              {/* Project Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Allocate to Project</h3>
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                >
                  <option value="general">General Fund</option>
                  <option value="education">Education for All</option>
                  <option value="women">Women Empowerment</option>
                  <option value="healthcare">Healthcare Initiative</option>
                  <option value="environment">Environmental Conservation</option>
                </select>
              </div>

              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    name="pan"
                    placeholder="PAN (for 80G certificate)"
                    value={formData.pan}
                    onChange={handleInputChange}
                    className="p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Address</h3>
                <div className="space-y-4">
                  <textarea
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  ></textarea>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Anonymous Option */}
              <div className="mb-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-gray-700">
                    I would like to donate anonymously
                  </span>
                </label>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['card', 'upi', 'netbanking', 'wallet'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-3 px-2 rounded-lg border-2 capitalize transition-all ${
                        paymentMethod === method
                          ? 'border-primary-600 bg-primary-50 text-primary-600'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  'Processing...'
                ) : (
                  <>
                    <FiHeart className="mr-2" />
                    Donate ₹{customAmount || amount || '0'}
                  </>
                )}
              </button>

              {/* Security Notice */}
              <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
                <FiLock className="mr-2" />
                Secure payment powered by Razorpay
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Impact Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Your Impact</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Total Raised</span>
                  <span className="font-bold text-xl">₹15,00,000</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Monthly Donors</span>
                  <span className="font-bold">250+</span>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Current Goal</span>
                    <span className="font-semibold">₹20,00,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 rounded-full h-2" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Benefits */}
            <div className="bg-primary-50 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-primary-800">Tax Benefits</h3>
              <p className="text-primary-700 mb-4">
                All donations are eligible for tax exemption under Section 80G of the Income Tax Act.
              </p>
              <div className="text-sm text-primary-600">
                <p>✓ 50% tax exemption on donation amount</p>
                <p>✓ Instant 80G certificate</p>
                <p>✓ Lifetime tax benefit for monthly donors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;