"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

// CSS Imports
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const Carousel = () => {
  const banners = [
      { 
      desktop: "everyday.webp", 
      mobile: "1.webp",
      title: "Everyday Elegance",
      subtitle: "Shop Collection"
    },
      { 
      desktop: "wedding.webp", 
      mobile: "3.webp",
      title: "The Bridal Edit",
      subtitle: "Discover Now"
    },
      { 
      desktop: "exclusive.webp", 
      mobile: "2.webp",
      title: "The Signature Series",
      subtitle: "Discover Now"
    },
  ];

  return (
    <div className="relative w-full overflow-hidden">
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
            <div className="relative w-full h-full">
              
              {/* LAYER 1: IMAGE (Background) */}
              <picture className="w-full block relative z-0">
                <source
                  media="(max-width: 768px)"
                  srcSet={`/banner/mobile/${banner.mobile}`}
                />
                <img
                  src={`/banner/desktop/${banner.desktop}`}
                  alt="Saaj Riwaaj Banner"
                  className="w-full h-auto block" 
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </picture>

              {/* LAYER 2: DARK OVERLAY (Inside Slide) */}
             {/* LAYER 2: DARK OVERLAY */}
<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 z-10 pointer-events-none" />

              {/* LAYER 3: TEXT CONTENT (Highest Z-Index) */}
              <div className="absolute bottom-12 xl:bottom-36 2xl:bottom-44  inset-0 z-20 flex flex-col items-center justify-end px-6 pointer-events-none">
                <div className="slide-content-box text-center">
                  <h2 className="text-white text-3xl md:text-4xl xl:text-6xl font-mosetta px-2 font-medium tracking-[0.4rem] drop-shadow-2xl">
                    {banner.title}
                  </h2>
                  <div className="mt-2 lg:mt-8">
                    <span className="inline-block text-white text-xs xl:text-sm montserrat  pb-2 border-b border-white/80 pointer-events-auto cursor-pointer uppercase tracking-[0.2em]">
                      {banner.subtitle}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Slide-up Animation Styles */}
      <style jsx global>{`
      /* 3. Custom Pagination Lines */
.swiper-pagination {
  z-index: 50 !important;
  bottom: 20px !important; /* Adjust distance from bottom if needed */
}

.swiper-pagination-bullet {
  width: 20px !important;      /* Increased width for a line look */
  height: 1px !important;      /* Thin line height */
  background: white !important;
  opacity: 0.4;                /* Lower opacity for inactive lines */
  border-radius: 0 !important; /* Square edges; change to 2px for rounded ends */
  margin: 0 6px !important;    /* Spacing between lines */
  transition: all 0.3s ease;   /* Smooth transition when active */
}

.swiper-pagination-bullet-active {
  opacity: 1;
  width: 30px !important;      /* Active line grows longer */
  background: white !important;
}
      `}</style>
    </div>
  );
};

export default Carousel;


// "use client";
// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Autoplay, EffectFade } from "swiper/modules";
// import Image from "next/image";

// // CSS Imports
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/effect-fade";

// const Carousel = () => {
//   const banners = [
//     { desktop: "b2.webp", mobile: "b1.webp" },

//   ];

//   return (
//     <div className="relative w-full z-10">
//       {/* Overlay Gradient */}
//       <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/0 to-transparent pointer-events-none z-20" />

//       <Swiper
//         modules={[Pagination, Autoplay, EffectFade]}
//         effect="fade"
//         fadeEffect={{ crossFade: true }}
//         pagination={{ clickable: true }}
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         loop={true}
//         className="w-full h-auto"
//       >
//         {banners.map((banner, index) => (
//           <SwiperSlide key={index}>
//             <picture className="w-full">
//               {/* Mobile Image (shown on small screens) */}
//               <source
//                 media="(max-width: 768px)"
//                 srcSet={`/banner/mobile/${banner.mobile}`}
//               />
//               {/* Desktop Image (default) */}
//               <img
//                 src={`/banner/desktop/${banner.desktop}`}
//                 alt="Saaj Riwaaj Banner"
//                 className="w-full h-auto block" 
//                 loading={index === 0 ? "eager" : "lazy"}
//               />
//             </picture>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default Carousel;