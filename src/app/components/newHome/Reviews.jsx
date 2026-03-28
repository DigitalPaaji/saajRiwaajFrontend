"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const VIDEO_DATA = [
  { id: 1, src: "/videos/1.webm", label: "Shalom Laptop Bag", price: "₹ 5,249" },
  { id: 2, src: "/videos/2.webm", label: "Cruise Canvas Tote", price: "₹ 4,189" },
  { id: 3, src: "/videos/3.mp4", label: "Scarlet Crossbody", price: "₹ 2,925" },
  { id: 4, src: "/videos/6.mp4", label: "Sloane Backpack", price: "₹ 3,499" },
  { id: 5, src: "/videos/7.mp4", label: "Jeff Crossbody", price: "₹ 2,099" },
   { id: 6, src: "/videos/4.mp4", label: "Sloane Backpack", price: "₹ 3,499" },
  { id: 7, src: "/videos/5.webm", label: "Jeff Crossbody", price: "₹ 2,099" },
];

const StyleVideo = ({ videoSrc, label, price }) => {
  const videoRef = useRef(null);

  const handlePlay = () => videoRef.current?.play();
  const handlePause = () => {
    videoRef.current?.pause();
    videoRef.current.currentTime = 0; // Optional: Reset to start
  };

  return (
    <div className="group cursor-pointer">
      <div 
        className="relative w-full aspect-[9/16] overflow-hidden bg-stone-100"
        onMouseEnter={handlePlay}
        onMouseLeave={handlePause}
        onClick={() => {
          // Toggle play/pause for mobile/small screens
          if (videoRef.current.paused) handlePlay();
          else handlePause();
        }}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Subtle Play Overlay for Mobile hint */}
        {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 pointer-events-none">
           <div className="w-10 h-10 border border-white/50 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
           </div>
        </div> */}
      </div>
{/* 
      <div className="mt-3 space-y-1">
        <h3 className="text-[11px] uppercase tracking-[0.15em] font-medium text-zinc-800 truncate">
          {label}
        </h3>
        <p className="text-[11px] text-zinc-500 font-light">{price}</p>
      </div> */}
    </div>
  );
};

export default function StyleEdit() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-6 lg:px-12 xl:px-24  bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-sm font-medium tracking-[0.2em] uppercase mb-10 border-b border-zinc-100 pb-4">
          The Style Edit
        </h2>

        <Swiper
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.5 },
            1024: { slidesPerView: 5 }, // Matches your 5-column requirement
          }}
          className="overflow-hidden"
        >
          {VIDEO_DATA.map((item) => (
            <SwiperSlide key={item.id}>
              <StyleVideo 
                videoSrc={item.src} 
                label={item.label} 
                price={item.price} 
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}