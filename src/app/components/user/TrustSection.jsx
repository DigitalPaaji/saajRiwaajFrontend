"use client";
import React from 'react';
import Image from 'next/image';
import { 
  FiTruck, 
  FiRefreshCcw, 
  FiShield, 
  FiClock, 
  FiMapPin, 
  FiCamera,
  FiHeart,
  FiDroplet,
  FiFeather
} from 'react-icons/fi';
import { FaWhatsapp, FaStar } from 'react-icons/fa';
import { IoDiamondOutline } from 'react-icons/io5';

const TrustSection = () => {
  const brandColor = "#292927";
  const accentColor = "#B67032";

const features = [
  {
    icon: <FiShield className="w-6 h-6" />,
    title: "Anti-Tarnish Coating",
    description: "3-layer coating that keeps your jewellery shining for 2+ years — not 2 months."
  },
  {
    icon: <FiDroplet className="w-6 h-6" />,
    title: "100% Skin-Safe",
    description: "Nickel-free, lead-free. Tested for sensitive skin. Zero green marks, guaranteed."
  },
  {
    icon: <FiFeather className="w-6 h-6" />,
    title: "Featherlight Comfort",
    description: "Wear them from morning meetings to midnight parties — no sore ears, no heavy necks."
  },
  {
    icon: <IoDiamondOutline className="w-6 h-6" />,
    title: "Handcrafted Detailing",
    description: "Each piece is hand-finished by artisans. Mass-produced? Never. Machine-stamped? No way."
  }
];

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background Decorative Element (matching your ShopByCategory) */}
     

      <div className="px-4 sm:px-8 lg:px-16 relative z-10">
        
        {/* --- PART 1: SOCIAL PROOF HEADER --- */}
        <div className="flex flex-col items-center justify-center text-center mb-20">
          
          {/* Overlapping Customer Avatars with better styling */}
          <div className="flex -space-x-3 mb-6">
            {[
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
              "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
              "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop"
            ].map((src, i) => (
              <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-md">
                <img src={src} alt="Customer" className="w-full h-full object-cover" />
              </div>
            ))}
            <div 
              className="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-xs font-bold shadow-md text-white"
              style={{ backgroundColor: accentColor }}
            >
              5k+
            </div>
          </div>

          <h2 className="text-xl md:text-3xl montserrat text-[#292927] mb-4">
           Why 1,500+ Women Trust SaajRiwaaj
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-stone-500">
            <div className="flex items-center gap-1.5" style={{ color: accentColor }}>
              <div className="flex text-sm">
                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
              </div>
              <span className="text-stone-800 font-medium ml-1">4.9/5 Reviews</span>
            </div>
            <span className="hidden sm:inline text-stone-300">|</span>
            <div className="flex items-center gap-2 font-serif italic text-md">
              <span>We don't just say "premium quality" — here's exactly what makes us different.</span>
            </div>
          </div>
        </div>

        {/* --- PART 2: TRUST BADGES GRID --- */}
        <div className="flex  flex-wrap justify-center gap-8 xl:gap-16">
          {features.map((feature, index) => (
            <div key={index} className="group flex flex-col items-center text-center">
              {/* Circular Icon Container matching product circle style */}
              <div 
                className="w-12 lg:w-20 h-12 lg:h-20 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500  shadow-sm bg-gradient-to-r from-[#bc861a] via-[#f1d981] to-[#bc861a]   text-[#292927] group-hover:shadow-lg group-hover:-translate-y-1"
                style={{ color: brandColor }}
              >
                <div className="p-2 lg:p-4 rounded-full" style={{ backgroundColor: `${brandColor}10` }}>
                  {feature.icon}
                </div>
              </div>
              
              <h3 className=" font-medium text-stone-800 text-base mb-2 group-hover:text-[#B67032] transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-stone-500 leading-snug max-w-[200px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* --- PART 3: PRESS MENTIONS (Optional cleanup) --- */}
        {/* <div className="mt-24 pt-12 border-t border-stone-100">
          <p className="text-center text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em] mb-8">
            As Featured In
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale contrast-125">
             <span className="text-2xl font-serif font-bold tracking-tighter">VOGUE</span>
             <span className="text-xl font-serif uppercase tracking-widest">Cosmopolitan</span>
             <span className="text-xl font-serif italic font-black">BAZAAR</span>
             <span className="text-2xl font-sans font-light tracking-[0.2em] uppercase">Elle</span>
          </div>
        </div> */}

      </div>
    </section>
  );
};

export default TrustSection;