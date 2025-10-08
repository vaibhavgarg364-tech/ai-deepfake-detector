import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  light = false,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <Loader className={`animate-spin ${sizeClasses[size]} ${light ? 'text-white' : 'text-teal-600'}`} />
        </div>
      </div>
    );
  }

  return (
    <Loader className={`animate-spin ${sizeClasses[size]} ${light ? 'text-white' : 'text-teal-600'}`} />
  );
};

export default LoadingSpinner;