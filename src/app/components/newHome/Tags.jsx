'use client';
import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import { base_url } from '../store/utile';

export default function BestSellersCarousel() {
  const [tags, setTags] = useState([]);

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${base_url}/tag/getfrontend`);
      const data = response.data;
      if (data.success) {
        setTags(data.tags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      setTags([]);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="px-4 md:px-12 xl:px-24 2xl:px-40 py-16 lg:py-32 flex flex-col items-center justify-center overflow-hidden bg-[#fafafa]">
      
      {/* Header */}
      <div className="w-full text-center mb-10 md:mb-14">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#292927] mb-4 tracking-tight">
          Shop by Occasion
        </h1>
        <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
          Explore our most popular categories in 3D coverflow style
        </p>
      </div>

      {/* SWIPER */}
      {tags?.length > 0 && (
        <div className="w-full max-w-[1400px]">
          <Swiper
            key={tags.length}
             loopedSlides={tags.length}
               initialSlide={0}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            // Adjusted breakpoints for coverflow depth
            breakpoints={{
              320: { slidesPerView: 1.5 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 3.5 },
            }}
            coverflowEffect={{
              rotate: 15,          // Slide rotation angle
              stretch: 0,          // Stretch space between slides
              depth: 250,          // Depth offset (creates the 3D effect)
              modifier: 1,         // Effect multiplier
              slideShadows: false, // Disabled default shadows to use custom Tailwind shadows
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
            }}
            modules={[EffectCoverflow, Autoplay, Pagination]}
            className="w-full pb-16 pt-8" // Padding bottom for pagination dots
          >
            {tags.map((tag) => (
              <SwiperSlide key={tag._id}>
                <Link href={`/tag/${tag.name.toLowerCase().replace(/\s+/g, '-')}/${tag._id}`}>
                  
                  {/* Aspect Ratio Container with Group for Hover Effects */}
                  <div className="group relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-gray-100">
                    
                    <Image
                      src={`${base_url}/${tag.image}`}
                      alt={tag.name}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Content / Text */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end items-center text-center">
                      {/* <h3 className="text-white text-xl md:text-2xl font-bold tracking-wide mb-3 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        {tag.name}
                      </h3> */}

                      {/* CTA Button */}
                      <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75 ease-out">
                        <span className="inline-block bg-gradient-to-r from-[#bc861a] via-[#f1d981] to-[#bc861a] text-[#292927] px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_4px_15px_rgba(188,134,26,0.4)]">
                          Shop Now
                        </span>
                      </div>
                    </div>

                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}