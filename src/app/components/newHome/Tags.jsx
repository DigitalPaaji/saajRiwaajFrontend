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
  const [tags, setTags] = useState([]);

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${base_url}/tag/getfrontend`);
      const data = await response.data;
      if (data.success) {
        setTags(data.tags);
      }
    } catch (error) {
      setTags([]);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

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


      <Swiper
       modules={[EffectCoverflow, Autoplay, Navigation]}

  effect={'coverflow'}

  grabCursor={true}

  // 1. THIS IS THE KEY CHANGE

  centeredSlides={false}

 

  // 2. Ensures it starts at the first index

  initialSlide={0}

 

  slidesPerView={'auto'}

  loop={true}

  speed={1000}

  autoplay={{

    delay: 3000,

    disableOnInteraction: false,

  }}

  // navigation={true}

  coverflowEffect={{

    rotate: 20,

    stretch: 10, // Adjusted for left-alignment

    depth: 100,

    modifier: 1,

    slideShadows: true,

  }}

        breakpoints={{

          320: { coverflowEffect: { rotate: 20, depth: 50 } },

          768: { coverflowEffect: { rotate: 30, depth: 100 } },

        }}

              className="w-full h-[320px] sm:h-[370px] md:h-[420px] lg:h-[500px]"

      >
        {tags?.length > 0 &&
          tags.map((tag) => {
            return (
              <SwiperSlide
                key={tag._id}
                className="!w-[220px] sm:!w-[260px] md:!w-[320px] lg:!w-[380px] rounded-2xl overflow-hidden"
              >
                <Link href={`/tag/${tag.name.toLowerCase().replace(/\s+/g, '-')}/${tag._id}`}>
                  <div className="relative w-full h-full rounded-2xl overflow-hidden  ">
                    <Image
                      src={`${base_url}/${tag.image}`}
                      alt={tag.name}
                      fill
                      className="object-cover"
                    />

                    {/* Gradient + hover text */}
                    <div className="absolute inset-0 bg-gradient-to-t rounded-2xl from-black/30 to-transparent opacity-0 hover:opacity-100 transition duration-500" />

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