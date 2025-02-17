import React from "react";

const SkeletonGaleri = () => {
  return (
    <div className="animate-pulse">
      {/* Hero Section */}
      <div className="relative h-[300px] bg-gray-300 rounded-lg mb-8">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-48 sm:w-64 h-6 bg-gray-400 rounded mb-2 mx-auto"></div>
          <div className="w-64 sm:w-96 h-4 bg-gray-400 rounded mx-auto my-4"></div>
          <div className="w-32 h-8 bg-gray-400 rounded mx-auto"></div>
        </div>
      </div>

      {/* Kategori Section */}
      <div className="mb-8 container">
        <div className="w-40 h-6 bg-gray-400 rounded mb-4 mx-auto"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mx-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-gray-300 rounded-lg p-4">
              <div className="w-full h-40 bg-gray-400 rounded-lg mb-2"></div>
              <div className="w-24 h-4 bg-gray-400 rounded mb-1"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Grid Section */}
      <div className="mb-8 container">
        <div className="w-40 h-6 bg-gray-400 rounded mb-4 mx-auto"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="bg-gray-300 rounded-lg overflow-hidden">
              <div className="w-full h-48 bg-gray-400 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonGaleri;
