
import React from 'react';

const Spinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-70 backdrop-blur-sm">
      <div 
        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        aria-label="Loading..."
      ></div>
    </div>
  );
};

export default Spinner;