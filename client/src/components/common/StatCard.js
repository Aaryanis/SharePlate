import React, { useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';
import anime from 'animejs';

const StatCard = ({ 
  icon, 
  count, 
  label, 
  color = 'primary', 
  iconBg = 'light', 
  delay = 0 
}) => {
  const countRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && countRef.current) {
          // Animate counter when in view
          anime({
            targets: countRef.current,
            innerHTML: [0, count],
            easing: 'easeInOutExpo',
            round: true,
            duration: 2000,
            delay: delay
          });
          
          // Unobserve after animation
          observer.unobserve(countRef.current);
        }
      },
      { threshold: 0.1 }
    );
    
    if (countRef.current) {
      observer.observe(countRef.current);
    }
    
    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, [count, delay]);
  
  return (
    <Card className="stat-card animation-stagger h-100">
      <Card.Body className="text-center">
        <div className={`stat-icon text-${color} bg-${iconBg} rounded-circle mx-auto mb-3`}>
          {icon}
        </div>
        <h2 
          ref={countRef}
          className={`stat-number text-${color} mb-2 fw-bold`}
          data-count={count}
        >
          0
        </h2>
        <p className="stat-text text-muted mb-0">{label}</p>
      </Card.Body>
    </Card>
  );
};

export default StatCard;