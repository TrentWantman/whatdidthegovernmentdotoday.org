import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4'
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'p-8'}`}>
      <div
        className={`${sizeClasses[size]} border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin`}
      />
      {message && (
        <p className="mt-4 text-gray-600 text-sm font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  return fullScreen ? (
    <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
      {spinner}
    </div>
  ) : spinner;
};

export default LoadingSpinner;