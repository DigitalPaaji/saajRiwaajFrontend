'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
  "Handcrafted jewellery you can trust!",
  "Enjoy free shipping on orders above ₹999",
  "💎 Hassle-free exchanges on damaged products"
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000); // Change message every 4 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-8 relative w-full z-[20] bg-white text-[#292927]  flex items-center justify-center overflow-hidden">
      {/* Shimmer Effect */}
      <motion.div 
        animate={{ x: ['-100%', '250%'] }}
        transition={{ repeat:"infinite", duration: 3, ease: "linear" }}
        className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-35deg] pointer-events-none"
      />

      {/* Sliding Text */}
      <div className="relative h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="  text-sm font-semibold whitespace-nowrap"
          >
            {MESSAGES[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
