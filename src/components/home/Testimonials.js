import React, { useEffect, useState } from 'react';
import { FiStar } from 'react-icons/fi';
import apiService from '../../services/api';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const fetchTestimonials = async () => {
    try {
      const data = await apiService.getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || testimonials.length === 0) {
    return (
      <section className="py-16">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  const testimonial = testimonials[currentIndex];

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">What People Say</h2>
          <p className="section-subtitle">
            Hear from those whose lives have been touched by our work
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
            <div className="flex flex-col items-center text-center">
              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-xl md:text-2xl text-gray-700 mb-6 italic">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                )}
                <div className="text-left">
                  <div className="font-bold text-lg">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;