import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';
import apiService from '../../services/api';

const fallbackStories = [
  {
    id: 'story-1',
    title: 'How student mentoring changes confidence long before exam results appear',
    excerpt:
      'A stronger homepage needs narrative proof. This story block is styled to foreground long-term transformation instead of simple announcements.',
    date: '2026-03-10',
    author: 'Editorial Team',
    category: 'Student Story',
  },
  {
    id: 'story-2',
    title: 'Why neighbourhood volunteers are central to sustainable educational support',
    excerpt:
      'The Agaram-like reference leans on purpose and credibility. This layout does the same through editorial, readable cards.',
    date: '2026-02-28',
    author: 'Community Desk',
    category: 'Field Update',
  },
  {
    id: 'story-3',
    title: 'From donor trust to visible outcomes: presenting impact with more discipline',
    excerpt:
      'A social-impact homepage should communicate seriousness. These updates are framed with that institutional tone.',
    date: '2026-02-12',
    author: 'Program Office',
    category: 'Impact Note',
  },
];

const LatestNews = () => {
  const [blogs, setBlogs] = useState(fallbackStories);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await apiService.getBlogs();
        if (data.length > 0) {
          setBlogs(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="bg-primary-950 py-20 text-white">
      <div className="container-custom">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="text-reveal text-xs font-semibold uppercase tracking-[0.22em] text-accent-300">
              Stories and updates
            </div>
            <h2 className="text-reveal text-reveal-delay-1 mt-4 text-3xl font-bold md:text-4xl">
              Editorial blocks that feel more credible and human.
            </h2>
            <p className="text-reveal text-reveal-delay-2 mt-5 text-base leading-7 text-white/60">
              This section now supports the homepage with narrative depth, which is an important
              part of the reference style you pointed to.
            </p>
          </div>
          <Link to="/blogs" className="text-reveal text-reveal-delay-3 inline-flex items-center font-semibold text-accent-300">
            Visit the blog
            <FiArrowRight className="ml-2" />
          </Link>
        </div>

        <div className="text-reveal text-reveal-delay-4 mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <article
              key={blog.id}
              className={`rounded-[2rem] border p-7 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.28)] ${
                index === 0
                  ? 'border-accent-400/20 bg-white/90 text-ink-950 lg:col-span-2'
                  : 'border-white/8 bg-white/4 text-white'
              }`}
            >
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span
                  className={`rounded-full px-3 py-1 font-semibold uppercase tracking-[0.16em] ${
                    index === 0 ? 'bg-accent-100/72 text-accent-800' : 'bg-white/8 text-accent-300/85'
                  }`}
                >
                  {blog.category}
                </span>
                <div className={`${index === 0 ? 'text-ink-500/90' : 'text-white/50'}`}>
                  {formatDate(blog.date)}
                </div>
              </div>

              <h3 className={`mt-6 font-bold ${index === 0 ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                {blog.title}
              </h3>
              <p className={`mt-4 text-sm leading-6 md:text-base md:leading-7 ${index === 0 ? 'text-ink-600/90' : 'text-white/60'}`}>
                {blog.excerpt}
              </p>

              <div
                className={`mt-8 flex flex-wrap items-center gap-4 text-sm ${
                  index === 0 ? 'text-ink-500/90' : 'text-white/50'
                }`}
              >
                <span className="inline-flex items-center">
                  <FiCalendar className="mr-2" />
                  {formatDate(blog.date)}
                </span>
                <span className="inline-flex items-center">
                  <FiUser className="mr-2" />
                  {blog.author}
                </span>
              </div>

              <Link
                to="/blogs"
                className={`mt-8 inline-flex items-center font-semibold ${
                  index === 0 ? 'text-primary-700' : 'text-accent-300'
                }`}
              >
                Read the full update
                <FiArrowRight className="ml-2" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
