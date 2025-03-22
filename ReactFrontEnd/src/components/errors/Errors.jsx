import React from 'react';
const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center">
      <p className="text-gray-500 text-xl mb-4">The page you are looking for can’t be found.</p>
      <div className="relative">
        <h1
          className="text-9xl font-extrabold text-black select-none"
          style={{ fontFamily: 'Arial, sans-serif', position: 'relative', zIndex: 10 }}
        >
          404
        </h1>
        <svg
          className="absolute top-0 left-0 w-full h-full"
          style={{ zIndex: 0 }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 40"
        >
          <line x1="20" y1="10" x2="60" y2="30" stroke="black" strokeWidth="1" />
          <line x1="30" y1="20" x2="90" y2="40" stroke="black" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
};

export default ErrorPage;
