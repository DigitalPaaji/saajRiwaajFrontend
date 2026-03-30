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
    <div className="relative w-full z-[120] bg-[#8b5424e0]  flex items-center justify-center overflow-hidden">
      {/* Shimmer Effect */}
      <motion.div 
        animate={{ x: ['-100%', '250%'] }}
        transition={{ repeat:1, duration: 3, ease: "linear" }}
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
            className="text-white py-1 text-sm font-medium whitespace-nowrap"
          >
            {MESSAGES[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
// 'use client';
// import React, { useState } from 'react';
// import { X, Gift } from 'lucide-react';

// export default function AnnouncementBar() {
//   const [isVisible, setIsVisible] = useState(true);

//   if (!isVisible) return null;

//   return (
//     <div className="relative bg-amber-50 text-amber-800 py-3 overflow-hidden">
//       <button 
//         onClick={() => setIsVisible(false)}
//         className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-amber-100 transition-colors z-10"
//       >
//         <X className="w-4 h-4" />
//       </button>

      
//       <div className="flex items-center gap-2">
//         <div className="whitespace-nowrap animate-marquee flex items-center gap-4">
//           {Array.from({ length: 20 }).map((_, i) => (
//             <span key={i} className="flex items-center gap-1 text-lg font-medium px-4">
//               <Gift className="w-4 h-4" />
// Shop Elegant Jewellery with Special Offers and Free Shipping on Every Order ✨ Timeless Designs for Every Occasion          </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
