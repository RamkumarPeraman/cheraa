import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

const DonateButton = () => {
  return (
    <Link
      to="/donate"
      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
    >
      <FiHeart className="mr-2" />
      Donate Now
    </Link>
  );
};

export default DonateButton;