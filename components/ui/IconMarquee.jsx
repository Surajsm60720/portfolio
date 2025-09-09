import React from 'react';
import './IconMarquee.css';

const IconMarquee = ({ children, speed = 50, direction = 'left' }) => {
  // Calculate animation duration based on speed (lower speed = longer duration)
  const animationDuration = `${Math.max(30, 60 - speed)}s`;
  
  const animationDirection = direction === 'left' ? 'normal' : 'reverse';

  return (
    <div className="icon-marquee">
      <div 
        className="marquee-content"
        style={{
          animationDuration: animationDuration,
          animationDirection: animationDirection
        }}
      >
        {children}
      </div>
      <div 
        className="marquee-content"
        style={{
          animationDuration: animationDuration,
          animationDirection: animationDirection
        }}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
};

export default IconMarquee;
