import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import apiService from '../../services/api';

const ProjectsSummary = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await apiService.getProjects({ limit: 3 });
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16">
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
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Our Projects</h2>
          <p className="section-subtitle">
            Discover how we're making a difference in communities across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-300 relative">
                {project.image && (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                  project.status === 'ongoing' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Impact Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  {Object.entries(project.impact || {}).map(([key, value]) => (
                    <div key={key}>
                      <div className="text-sm font-semibold text-primary-600">{value}</div>
                      <div className="text-xs text-gray-500 capitalize">{key}</div>
                    </div>
                  ))}
                </div>

                <Link 
                  to={`/projects/${project.id}`}
                  className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700"
                >
                  Learn More
                  <FiArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/projects" 
            className="btn-primary inline-flex items-center"
          >
            View All Projects
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSummary;