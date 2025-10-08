import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MagnifyingGlass: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate horizontal movement based on scroll
  const horizontalOffset = Math.sin(scrollY * 0.01) * 20;
  return (
    <motion.div
      className="absolute -right-10 top-1/2 transform -translate-y-1/2 pointer-events-none"
      style={{
        y: scrollY * 0.3, // Parallax effect
        x: horizontalOffset, // Left/right movement
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div className="relative">
        {/* Magnifying glass handle */}
        <div className="w-3 h-20 bg-gradient-to-b from-gray-700 to-gray-800 rounded-full transform rotate-45 absolute -bottom-8 -right-8 shadow-lg"></div>
        
        {/* Magnifying glass lens */}
        <div className="w-24 h-24 rounded-full border-4 border-gray-700 bg-gradient-to-br from-blue-50 via-transparent to-teal-50 shadow-2xl relative overflow-hidden">
          {/* Glass reflection effect */}
          <div className="absolute inset-2 rounded-full border border-white opacity-40"></div>
          <div className="absolute top-2 left-2 w-4 h-4 bg-white rounded-full opacity-60 blur-sm"></div>
          
          {/* Magnified content hint */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 opacity-30"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default MagnifyingGlass;