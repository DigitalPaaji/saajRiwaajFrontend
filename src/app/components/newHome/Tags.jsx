'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from 'react';

export default function BestSellersCarousel() {
  // ⭐ Fetching Categories from Redux
  const { data: categories } = useSelector((state) => state.category.info);

  // 🔄 Repeat data to ensure at least 8-12 slides for a smooth 5-slide view
  const displayCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    // If you have 4 categories, this makes it 12 (4 x 3)
    return [...categories, ...categories, ...categories];
  }, [categories]);

  // Format URL slug
  function formatCategoryPath(name) {
    return name.trim().toLowerCase().replace(/\s+/g, "-");
  }

  // Format title
  function formatCategoryLabel(name) {
    return name
      .trim()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  // Static fallback images  
  const getCategoryImage = (categoryName) => {
    const name = categoryName.toLowerCase().trim();
    const staticImages = {
      "bangles": "/banner/desktop/everyday.webp",
      "earrings": "/Images/category/earrings.webp",
      "exclusive": "/Images/category/exclusive.webp",
      "neckwear": "/Images/category/neckwear.webp",
    };
    return staticImages[name] || "/Images/category/exclusive.webp";
  };

  return (
    <div className="px-4 md:px-12 xl:px-24 2xl:px-40 py-16 lg:py-32 flex flex-col items-center justify-center overflow-hidden">

      {/* Header */}
      <div className="w-full text-center mb-10 md:mb-14">
        <h1 className="text-2xl md:text-3xl text-[#292927] mb-3 tracking-tight">
          FOR EVERY YOU
        </h1>
        <p className="text-gray-600 text-md xl:text-lg">
          Explore our most popular categories in 3D coverflow style
        </p>
      </div>

      {/* SWIPER */}
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        // Fix: slidePerView set to 5 on desktop via breakpoints
        slidesPerView={"auto"} 
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 25,
          stretch: -20,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
        breakpoints={{
          // Mobile
          320: { 
            slidesPerView: 2,
            coverflowEffect: { rotate: 15, stretch: -10, depth: 50 }
          },
          // Tablet
          768: { 
            slidesPerView: 3,
            coverflowEffect: { rotate: 25, stretch: -20, depth: 100 }
          },
          // Desktop: Now shows more slides by pulling them closer with 'stretch'
          1280: { 
            slidesPerView: 5,
            coverflowEffect: { rotate: 30, stretch: -50, depth: 150 }
          },
        }}
        
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
        className="w-full h-[320px] sm:h-[370px] md:h-[420px] lg:h-[500px]"
      >
        {displayCategories.length > 0 &&
          displayCategories.map((cat, index) => {
            const category = cat.category;
            const label = formatCategoryLabel(category.name);
            const imageSrc = getCategoryImage(category.name);
            const path = `/category/${formatCategoryPath(category.name)}/${category._id}`;

            return (
              <SwiperSlide
                key={`${category._id}-${index}`} // Unique key for repeated items
                className="!w-[220px] sm:!w-[260px] md:!w-[320px] lg:!w-[380px]"
              >
                <Link href={path}>
                  <div className="relative w-full h-full rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105">
                    <Image
                      src={imageSrc}
                      alt={label}
                      fill
                      className="object-cover"
                      priority={index < 5}
                    />

                    {/* gradient + hover text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition duration-500" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-500 translate-y-4 hover:translate-y-0">
                      <span className="bg-gradient-to-r from-[#bc861a] via-[#f1d981] to-[#bc861a] text-[#292927] px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">
                        Shop Now
                      </span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </div>
  );
}