"use client"
import React from 'react';
import { 
  FiTruck, 
  FiRefreshCcw, 
  FiShield, 
  FiClock, 
  FiMapPin 
} from 'react-icons/fi';
import { FaWhatsapp, FaStar } from 'react-icons/fa';

const TrustSection = () => {
  const brandColor = "#99571d";

  const features = [
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: "Pan India Delivery",
      description: "Delivering safely to every corner of India."
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Express Dispatch",
      description: "Estimated delivery across India in 4 days."
    },
    {
      icon: <FiTruck className="w-6 h-6" />,
      title: "Free Shipping",
      description: "Enjoy free shipping on all your orders."
    },
    {
      icon: <FiRefreshCcw className="w-6 h-6" />,
      title: "Easy Returns",
      description: "Hassle-free 7-day return & exchange policy."
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Secure Payments",
      description: "100% encrypted and safe checkout process."
    },
    {
      icon: <FaWhatsapp className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Always here for you via WhatsApp."
    }
  ];

  return (
    <section className="py-16  border-y border-stone-200 font-sans">
      <div className="container mx-auto px-4 ">
        
        {/* --- PART 1: SOCIAL PROOF (Avatars, Stars, Orders) --- */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          
          {/* Overlapping Customer Avatars */}
          <div className="flex -space-x-4 mb-5">
            <img className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="Happy Customer" />
            <img className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="Happy Customer" />
            <img className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Happy Customer" />
            <img className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop" alt="Happy Customer" />
            <div className="w-12 h-12 rounded-full border-2 border-white bg-stone-200 text-stone-600 flex items-center justify-center text-xs font-bold shadow-sm z-10">
              5k+
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-3 tracking-tight">
            Trusted by 5,000+ women across India
          </h2>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-stone-600 font-medium">
            <div className="flex items-center gap-1" style={{ color: brandColor }}>
              <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
              <span className="text-stone-800 ml-1">4.9/5 Reviews</span>
            </div>
            <span className="hidden sm:inline text-stone-300">|</span>
            <div className="flex items-center gap-2">
              <span className="text-lg">📦</span>
              <span>12,000+ Orders Delivered</span>
            </div>
          </div>
        </div>

        {/* --- PART 2: TRUST BADGES GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4 bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-opacity-10"
                style={{ backgroundColor: `${brandColor}15`, color: brandColor }}
              >
                {feature.icon}
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* --- PART 3: PRESS MENTIONS --- */}
        {/* <div className="pt-10 border-t border-stone-200">
          <p className="text-center text-xs font-semibold text-stone-400 uppercase tracking-widest mb-6">
            🏆 Featured & Mentioned In
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-xl md:text-2xl font-serif font-bold text-stone-800 tracking-tighter">VOGUE</span>
            <span className="text-xl md:text-2xl font-serif font-medium text-stone-800 tracking-widest uppercase">Cosmopolitan</span>
            <span className="text-xl md:text-2xl font-serif italic font-bold text-stone-800">Harper's BAZAAR</span>
            <span className="text-xl md:text-2xl font-sans font-light text-stone-800 tracking-[0.3em] uppercase">Elle</span>
          </div>
        </div> */}

      </div>
    </section>
  );
};

export default TrustSection;