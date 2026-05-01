'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import Image from "next/image";
import Link from "next/link";
import axios from 'axios';
import { base_url } from '../store/utile';
import { useEffect, useState } from 'react';

export default function BestSellersCarousel() {

   const [tags,setTags]=useState([ ])

  const fetchTags = async()=>{
    try {
      const response =  await axios.get(`${base_url}/tag/getfrontend`)
      const data = await response.data;
if(data.success){
  setTags(data.tags)
}

    } catch (error) {
      setTags([ ])
    }


  }
  
  useEffect(()=>{
    fetchTags()
  },[ ])




  return (
    <div className="px-4 md:px-12 xl:px-24 2xl:px-40 py-16 lg:py-32 flex flex-col items-center justify-center overflow-hidden">

      {/* Header */}
      <div className="w-full text-center mb-10 md:mb-14">
        <h1 className="text-2xl md:text-3xl text-[#292927] mb-3 tracking-tight">
   Shop by Occassion
        </h1>
        <p className="text-gray-600 text-md xl:text-lg">
          Explore our most popular categories in 3D coverflow style
        </p>
      </div>

  {tags?.length > 0 &&
    <Swiper
        loop={true}
        grabCursor={true}
        centeredSlides={true}
        spaceBetween={24}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false, // Keeps autoplay running after user interaction
        }}
        breakpoints={{
          // Mobile
          320: { slidesPerView: 1.5 },
          // Tablet
          768: { slidesPerView: 2.5 },
          // Laptop
          1024: { slidesPerView: 3.5 },
          // Desktop
          1280: { slidesPerView: 4.5 },
        }}
        modules={[Autoplay]}
        className="w-full"
      >
        {tags.map((tag) => (
          <SwiperSlide key={tag._id} className="pb-8">
            <Link href={`/tag/${tag.name.toLowerCase().replace(/\s+/g, '-')}/${tag._id}`}>
              {/* Group wrapper for unified hover effects */}
              <div className="group relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-500 bg-gray-100">
                
                {/* Image with zoom-in hover effect */}
                <Image
                  src={`${base_url}/${tag.image}`}
                  alt={tag.name}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />

                {/* Always-on subtle gradient to make text readable, darkens on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Content Container */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end items-center text-center">
                  
                  {/* Category/Tag Name */}
                  <h3 className="text-white text-xl md:text-2xl font-bold tracking-wide mb-3 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    {tag.name}
                  </h3>

                  {/* Shop Now Button */}
                  <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75 ease-out">
                    <span className="inline-block bg-gradient-to-r from-[#bc861a] via-[#f1d981] to-[#bc861a] text-[#292927] px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_4px_15px_rgba(188,134,26,0.4)] hover:shadow-[0_4px_20px_rgba(188,134,26,0.6)]">
                      Shop Now
                    </span>
                  </div>

                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
}    </div>
  );
}

