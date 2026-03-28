"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";

// CSS Imports
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const Carousel = () => {
  const banners = [
    { desktop: "floral1.webp", mobile: "floralmobile.webp" },
    { desktop: "floral1.webp", mobile: "chainsmobile.webp" },
  ];

  return (
    <div className="relative w-full z-10">
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-transparent pointer-events-none z-20" />

      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-auto"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <picture className="w-full">
              {/* Mobile Image (shown on small screens) */}
              <source
                media="(max-width: 768px)"
                srcSet={`/banner/mobile/${banner.mobile}`}
              />
              {/* Desktop Image (default) */}
              <img
                src={`/banner/desktop/${banner.desktop}`}
                alt="Saaj Riwaaj Banner"
                className="w-full h-auto block" 
                loading={index === 0 ? "eager" : "lazy"}
              />
            </picture>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;