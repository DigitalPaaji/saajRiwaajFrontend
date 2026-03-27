"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiMapPin, 
  FiClock, 
  FiTruck, 
  FiCamera,
  FiHeart
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const TrustMarquee = () => {
  const brandDark = "#292927";
  const accentColor = "#B67032";

  const items = [
    { icon: <FiMapPin />, title: "Pan India Delivery" },
    { icon: <FiClock />, title: "Express Dispatch" },
    { icon: <FiTruck />, title: "Free Shipping" },
    { icon: <FiCamera />, title: "Damage Exchange" },
    { icon: <FiHeart />, title: "Care Instructions" },
    { icon: <FaWhatsapp />, title: "24/7 Support" },
  ];

  // Duplicate items for a seamless loop
  const marqueeItems = [...items, ...items, ...items];

  return (
    <section className="py-4 overflow-hidden " style={{ backgroundColor: brandDark }}>
      <div className="relative flex items-center">
        
        {/* Gradients for soft edges (Editorial touch) */}
        <div className="absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-[#292927] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-[#292927] to-transparent" />

        <motion.div 
          className="flex whitespace-nowrap items-center gap-12 md:gap-24"
          animate={{ x: [0, -1030] }} // Adjust number based on total content width
          transition={{ 
            repeat: Infinity, 
            duration: 35, 
            ease: "linear" 
          }}
        >
          {marqueeItems.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 text-white group"
            >
              {/* Icon with accent color circle */}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center border border-white/20 transition-colors duration-500 group-hover:border-[#B67032]"
                style={{ color: accentColor }}
              >
                <span className="text-xl">{item.icon}</span>
              </div>

              {/* Title */}
              <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase montserrat">
                {item.title}
              </span>

              {/* Decorative Dot Divider */}
              <div className="w-1.5 h-1.5 rounded-full bg-white/20 ml-8 md:ml-16" />
            </div>
          ))}
        </motion.div>
      </div>
      

    </section>
  );
};

export default TrustMarquee;