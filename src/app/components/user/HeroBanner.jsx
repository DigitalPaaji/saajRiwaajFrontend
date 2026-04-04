"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function HeroBanner() {
  const banners = [
    { 
      desktopImg: "chain.webp", 
      mobileImg: "chainsmobile.webp", 
      title: "The Bridal Edit", 
      subtitle: "Discover Now", 
      color: "#ffffff" 
    },
    { 
      desktopImg: "banner1.webp", 
      mobileImg: "banner1.webp", 
      title: "Everyday Elegance", 
      subtitle: "Discover Now", 
      color: "#e8d9b5" 
    },
    { 
      desktopImg: "banner2.webp", 
      mobileImg: "banner2.webp", 
      title: "The Festive Collection", 
      subtitle: "Discover Now", 
      color: "#f3eadf" 
    },
  ];

  return (
    <section className="relative w-full overflow-hidden">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        // Retaining your precise heights
        className="w-full h-[400px] md:h-[420px] lg:h-[540px] xl:h-[800px]"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            {/* The main container MUST be relative to allow internal absolute positioning */}
            <div className="relative w-full h-full flex justify-center">
              
              {/* 1. IMAGE LAYER (FORCE TO BACK) */}
              <div className="absolute inset-0 z-0 w-full h-full">
                {/* Desktop Images */}
                <div className="hidden md:block absolute inset-0 w-full h-full">
                  <Image
                    src={`/banner/desktop/${banner.desktopImg}`}
                    alt={`${banner.title} - Desktop`}
                    fill
                    priority={index === 0} // Only first image gets priority load
                    className="object-cover object-center"
                    sizes="100vw"
                  />
                </div>

                {/* Mobile Images */}
                <div className="block md:hidden absolute inset-0 w-full h-full">
                  <Image
                    src={`/banner/mobile/${banner.mobileImg}`}
                    alt={`${banner.title} - Mobile`}
                    fill
                    priority={index === 0}
                    className="object-cover object-center"
                    sizes="100vw"
                  />
                </div>
              </div>

              {/* 2. TEXT OVERLAY LAYER (FORCE TO FRONT) */}
              {/* Positioned Bottom-Center: relative to the main container */}
              <div className="absolute bottom-12 md:bottom-20 z-10 flex flex-col items-center text-center px-6">
                <div className="content-animator">
                  <h2
                    className="text-3xl lg:text-5xl xl:text-6xl font-semibold tracking-wide"
                    style={{ 
                      color: banner.color,
                      textShadow: '0px 2px 8px rgba(0,0,0,0.4)' // Enhanced readability
                    }}
                  >
                    {banner.title}
                  </h2>
                  <div className="flex justify-center mt-5">
                    <p
                      className="text-sm md:text-md px-6 py-2 rounded-full border border-white/50 backdrop-blur-md"
                      style={{ color: banner.color }}
                    >
                      {banner.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* STYLES */}
      <style jsx global>{`
        /* Smooth Slide-Up Animation */
        @keyframes slideUpFadeIn {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Default state of content */
        .content-animator {
          opacity: 0;
          will-change: transform, opacity;
        }

        /* Active Slide Trigger */
        .swiper-slide-active .content-animator {
          animation: slideUpFadeIn 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          animation-delay: 0.15s; /* Small offset for smoothness */
        }
      `}</style>
    </section>
  );
}

// "use client";
// import React, { useEffect, useState, useCallback } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Autoplay, EffectFade } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/effect-fade";
// import Image from "next/image";

// export default function HeroBanner() {
//   // const [banners, setBanners] = useState([]);
//   // const [loading, setLoading] = useState(true);

// const desktopBanner= [
//   // "banner.webp",
//   "chain.webp",
// // "banner1.webp",
// // "banner2.webp",
// ]

// const mobileBanner= [
//     // "banner.webp",
//     "chainsmobile.webp",
// // "banner1.webp",
// // "banner2.webp",
// ]



//   // const fetchBanners = useCallback(async () => {
//   //   try {
//   //     const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/banner`);
//   //     const data = await res.json();
//   //     setBanners(data);
//   //   } catch (err) {
//   //     console.error("Error fetching banners:", err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // }, []);

//   // useEffect(() => {
//   //   fetchBanners();
//   // }, [fetchBanners]);

//   // if (loading) {
//   //   return (
//   //     <div className="relative w-full h-[400px] md:h-[720px] lg:h-[540px] xl:h-[680px] animate-pulse  flex items-center justify-center">
//   //       <div className=" rounded-lg animate-pulse" />
//   //     </div>
//   //   );
//   // }

//   // if (!loading && banners.length === 0) return null;

//   return (
//     <section className="relative w-full">
//       <div className="hidden md:block">
//       <Swiper
//         modules={[Pagination, Autoplay, EffectFade]}
//         effect="fade"
//         fadeEffect={{ crossFade: true }}
//         pagination={{ clickable: true }}
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         loop={true}
//         className="w-full relative  md:h-[420px] lg:h-[540px] xl:h-[800px]"
//       >
//         {desktopBanner?.map((banner, index) => {
//           const isFirstSlide = index === 0;

//           return (
//             <SwiperSlide key={index}>
//               <div className="relative w-full  md:h-[420px] lg:h-[540px] xl:h-[800px]">
              

//                 <div className="absolute inset-0 hidden md:block">
//                   <Image
//                    src={`/banner/desktop/${banner}`}
//                     alt="Desktop Banner"
//                     fill
//                     priority={isFirstSlide}
//                     sizes="100vw"
//                     className=""
//                   />
//                 </div>
//               </div>
//             </SwiperSlide>
//           );
//         })}



        
//       </Swiper>
// </div>

// <div className=" block md:hidden">
//         <Swiper
//         modules={[Pagination, Autoplay, EffectFade]}
//         effect="fade"
//         fadeEffect={{ crossFade: true }}
//         pagination={{ clickable: true }}
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         loop={true}
//         className="w-full relative h-[400px] "
//       >
//         {mobileBanner?.map((banner, index) => {
//           const isFirstSlide = index === 0;

//           return (
//             <SwiperSlide key={index}>
//               <div className="relative w-full h-[400px] ">
//                 <div className="absolute inset-0 w-screen block md:hidden">
//                   <Image
//                   src={`/banner/mobile/${banner}`}
//                     alt="Mobile Banner"
//                     fill
//                     priority={isFirstSlide}
//                     sizes="100vw"
//                     className=""
//                   />
//                 </div>

             
//               </div>
//             </SwiperSlide>
//           );
//         })}



        
//       </Swiper>
//       </div>
//     </section>
//   );
// }
