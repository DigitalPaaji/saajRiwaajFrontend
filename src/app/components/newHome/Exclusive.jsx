"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGlobalContext } from "../context/GlobalContext";
import { FaRupeeSign, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
// 1. Added Autoplay to imports
import { Navigation, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

export default function EarringsSlider() {
  const { productsByCategory2, refetchProductsByCategory2 } = useGlobalContext();

  const earringsCategoryId = "693bbd1b430ea8120089b2ab";
  const [hoveredId, setHoveredId] = useState(null);

  const products = productsByCategory2[earringsCategoryId] || [];
  const loading = !products.length && !productsByCategory2[earringsCategoryId];

  useEffect(() => {
    if (!products.length) {
      refetchProductsByCategory2(earringsCategoryId);
    }
  }, [earringsCategoryId, products.length, refetchProductsByCategory2]);

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 lg:px-12 xl:px-24 relative overflow-hidden">

      <div className="max-w-7xl mx-auto relative z-10">
        {/* --- HEADING SECTION --- */}
        <div className="max-w-4xl mx-auto text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-4xl  text-[#292927] mb-3 tracking-tight">
            Our Most Loved Exclusive Picks
          </h2>
          <p className="text-stone-600 text-sm md:text-[18px] max-w-xl mx-auto font-light leading-relaxed">
            A modern collection of lightweight pieces crafted with care and detail.
          </p>
        </div>

        {/* --- SWIPER SECTION --- */}
        <div className=" relative flex flex-col justify-center">
          {/* Custom Navigation Buttons */}
          <div className="flex justify-end gap-2 mb-4">
            <button className="swiper-prev-btn p-3 rounded-full border border-stone-300 text-stone-600 hover:bg-[#292927] hover:text-white transition-all">
              <FaChevronLeft size={14} />
            </button>
            <button className="swiper-next-btn p-3 rounded-full border border-stone-300 text-stone-600 hover:bg-[#292927] hover:text-white transition-all">
              <FaChevronRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 aspect-[4/5] rounded-lg" />
              ))}
            </div>
          ) : (
            <Swiper
              // 2. Added Autoplay to modules
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              // 3. Configured Autoplay
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation={{
                nextEl: ".swiper-next-btn",
                prevEl: ".swiper-prev-btn",
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="w-full"
            >
              {products.map((item) => (
                <SwiperSlide key={item._id}>
                  <Link
                    href={`/product/${item.name}/${item._id}`}
                    className="group block relative rounded-lg overflow-hidden shadow-sm aspect-[4/5]"
                    onMouseEnter={() => setHoveredId(item._id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* 1. Image Layer */}
                    <Image
                     src={'/Images/4.webp'}
                     //  src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${
                      //   hoveredId === item._id && item.images?.[1]
                      //     ? item.images[1]
                      //     : item.images?.[0]
                      // }`}
                      alt={item.name}
                      fill
                      className="object-cover z-0 transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* 2. Text Content Layer (Bottom Left) */}
                    <div className="absolute z-10 bg-gradient-to-b from-black/20 via-black/60 to-black/80 bottom-0 left-0 right-0 p-4 md:p-5">
                      <h3 className="text-sm md:text-base font-medium text-white montserrat truncate capitalize mb-1.5 shadow-text">
                        {item.name.toLowerCase()}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center text-white font-bold text-sm md:text-base">
                          <FaRupeeSign size={12} className="mr-0.5" />
                          {Math.floor(item.finalPrice)}
                        </span>
                        {item.price > item.finalPrice && (
                          <span className="flex items-center text-gray-300 text-xs line-through">
                            <FaRupeeSign size={10} className="mr-0.5" />
                            {Math.floor(item.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
}