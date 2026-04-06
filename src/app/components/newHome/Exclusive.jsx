"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaRupeeSign, FaChevronLeft, FaChevronRight, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
// 1. Added Autoplay to imports
import { Navigation, Autoplay } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { ArrowRight, ShoppingBag } from "lucide-react";
import axios from "axios";
import { base_url } from "../store/utile";

export default function EarringsSlider() {
const [featuredProducts,setFeaturedProducts]=useState([ ])
  const [loading, setLoading] = useState(true);
const fetchFeaturedProducts = async () => {
    try { 
      setLoading(true)
      const res = await axios(
        `${base_url}/product/featured`
      );
      const data = await res.data;
  
      setFeaturedProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching featured products:", err);
      setFeaturedProducts([]);
    }finally{
      setLoading(false)
    }
  }




  useEffect(() => {
   fetchFeaturedProducts()
  }, [ ]);

  return (
    <section className="py-12 md:py-16 px-4 md:px-12 lg:px-24 xl:px-40 2xl:px-52 relative overflow-hidden">

      <div className="relative z-10">
        {/* --- HEADING SECTION --- */}
        <div className="max-w-4xl mx-auto text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-4xl  text-[#292927] mb-3 tracking-tight">
            Our Most Loved Exclusive Picks
          </h2>
          <p className="text-stone-600 text-sm md:text-[18px] max-w-xl mx-auto font-light leading-relaxed">
            A modern collection of lightweight pieces crafted with care and detail.
          </p>
        </div>

        
        <div className=" relative flex flex-col justify-center">
        
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
              
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
             
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
              {featuredProducts.map((item) => (
                <SwiperSlide key={item._id}>
                  <Link
                    href={`/product/${item.name}/${item._id}`}
                    className="group block relative rounded-lg overflow-hidden shadow-sm aspect-[4/5]"
                    // onMouseEnter={() => setHoveredId(item._id)}
                    // onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* 1. Image Layer */}
                    <Image
                    //  src={'/Images/4.webp'}
                      src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.images?.[0]
                        // hoveredId === item._id && item.images?.[1]
                        //   ? item.images[1]
                        //   : item.images?.[0]
                      }`}
                      alt={item.name}
                      fill
                      className="object-cover z-0 transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* 2. Text Content Layer (Bottom Left) */}
            <div className="absolute z-10 bg-gradient-to-b from-black/40 via-black/60 to-black/80 bottom-0 left-0 right-0 p-4 md:p-5">




  <div className=" flex items-center justify-between">
              <h3 className="text-sm md:text-base font-medium text-white montserrat truncate capitalize mb-1.5 shadow-text">
    {item.name.toLowerCase()}
  </h3>
            <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-500">
           <ShoppingBag size={14} />
            </div>
          </div>
        {/* ⭐ REVIEWS SECTION */}
        <div className="flex items-center justify-center sm:justify-start gap-1">
          {/* Stars */}
          {[1, 2, 3, 4].map((star) => (
            <FaStar key={star} size={12} className="text-yellow-500" />
          ))}
          <FaStarHalfAlt size={12} className="text-yellow-500" />
    

        </div>        {/* PRICE SECTION */}
  <div className="flex items-center gap-3 ">
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