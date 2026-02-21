import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';
import apiService from '../../services/api';

const LatestNews = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await apiService.getBlogs();
      setBlogs(data.slice(0, 3)); // Get latest 3
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Latest News & Updates</h2>
          <p className="section-subtitle">
            Stay informed about our work and the communities we serve
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article key={blog.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {blog.image && (
                <div className="h-48 bg-gray-300">
                  <img 
                    src={blog.image} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <FiCalendar className="mr-1" />
                  <span className="mr-4">{formatDate(blog.date)}</span>
                  <FiUser className="mr-1" />
                  <span>{blog.author}</span>
                </div>

                <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                <p className="text-gray-600 mb-4">{blog.excerpt}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-600 font-semibold">
                    {blog.category}
                  </span>
                  <Link 
                    to={`/blogs/${blog.id}`}
                    className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700"
                  >
                    Read More
                    <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/blogs" 
            className="btn-primary inline-flex items-center"
          >
            View All News
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;