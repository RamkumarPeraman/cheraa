import React, { useEffect, useState } from 'react';
import { FiUsers, FiHeart, FiBriefcase, FiMapPin } from 'react-icons/fi';
import config from '../../config';

const ImpactMetrics = () => {
  const [counts, setCounts] = useState({
    lives: 0,
    volunteers: 0,
    projects: 0,
    states: 0,
  });

  useEffect(() => {
    const targets = config.impactMetrics;
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      
      setCounts({
        lives: Math.min(Math.floor((targets.lives / steps) * currentStep), targets.lives),
        volunteers: Math.min(Math.floor((targets.volunteers / steps) * currentStep), targets.volunteers),
        projects: Math.min(Math.floor((targets.projects / steps) * currentStep), targets.projects),
        states: Math.min(Math.floor((targets.states / steps) * currentStep), targets.states),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, increment);

    return () => clearInterval(timer);
  }, []);

  const metrics = [
    { icon: FiUsers, value: counts.lives, label: 'Lives Impacted', suffix: '+' },
    { icon: FiHeart, value: counts.volunteers, label: 'Active Volunteers', suffix: '+' },
    { icon: FiBriefcase, value: counts.projects, label: 'Projects Completed', suffix: '+' },
    { icon: FiMapPin, value: counts.states, label: 'States Reached', suffix: '' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <metric.icon className="w-8 h-8 text-primary-600" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {metric.value.toLocaleString()}{metric.suffix}
              </div>
              <div className="text-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactMetrics;