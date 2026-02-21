import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiHeart } from 'react-icons/fi';
import config from '../../config';
import DonateButton from './DonateButton';
import ravanaLogo from "../../asset/image/ravanan.png"


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = config.navigation.main;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
      }`}>
      <div className="container-custom">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <img
                src={ravanaLogo}
                alt="" />
            </div>
            <span className={`font-bold text-xl ${scrolled ? 'text-gray-900' : 'text-white'
              }`}>
              Raavana Thalaigal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors duration-300 ${location.pathname === item.path
                    ? 'text-primary-600'
                    : scrolled
                      ? 'text-gray-700 hover:text-primary-600'
                      : 'text-white hover:text-primary-200'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Donate Button & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <DonateButton />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FiX className={`w-6 h-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
              ) : (
                <FiMenu className={`w-6 h-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden fixed inset-x-0 top-[72px] bg-white shadow-lg transition-all duration-300 transform ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'
            }`}
        >
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${location.pathname === item.path
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;