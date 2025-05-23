
import React from 'react';

interface RobotProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const AppMascot: React.FC<RobotProps> = ({ className, size = 'md', animated = false }) => {
  return (
    <div 
      className={`app-mascot ${size} ${animated ? 'animated' : ''} ${className || ''}`}
      aria-hidden="true"
    >
      {/* Placeholder for mascot image or SVG */}
    </div>
  );
};

export default AppMascot;
