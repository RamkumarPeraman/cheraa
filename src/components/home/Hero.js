import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/assets/hero-bg.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70"></div>
      </div>

      {/* Content */}
      <div className="relative container-custom text-center text-white z-10 py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
          Empowering Communities,
          <br />
          <span className="text-primary-500">Transforming Lives</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
          Join us in our mission to create lasting change through education, healthcare, 
          and sustainable development programs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/donate"
            className="btn-primary inline-flex items-center justify-center group"
          >
            Donate Now
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            to="/volunteer"
            className="btn-secondary inline-flex items-center justify-center group bg-white/10 text-white border-white hover:bg-white/20"
          >
            Become a Volunteer
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            to="/events"
            className="btn-secondary inline-flex items-center justify-center group bg-white/10 text-white border-white hover:bg-white/20"
          >
            Latest Events
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;