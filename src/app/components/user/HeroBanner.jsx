'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { getOptimizedImage } from '../utils/cloudinary';
import Image from 'next/image';

export default function HeroBanner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBanners = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/banner`);
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error("Error fetching banners:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  if (loading) {
    return (
      <div className="relative w-full min-h-[300px] md:min-h-[700px] animate-pulse  flex items-center justify-center">
        <div className=" rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!loading && banners.length === 0) return null;

  return (
    <section className="relative w-full">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="w-full relative min-h-[300px]"
      >
{banners?.map((banner, index) => (
  <SwiperSlide key={index}>
    <div className="relative w-full h-full">
      {/* Mobile Banner */}
      <img
        loading="eager"
        fetchPriority="high"
        src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${banner.mobileImage}`}
        alt="Mobile Banner"
        className="block lg:hidden w-full h-full object-cover"
      />

   
     {/* <Image
  src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${banner.desktopImage}`}
  alt="Desktop Banner"
  
  priority
  sizes="(min-width: 1024px) 100vw"
  className="hidden lg:block object-cover"
/> */}
<div className="relative hidden lg:block w-full h-[300px]">
  <Image
    src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${banner.desktopImage}`}
    alt="Desktop Banner"
    fill
    priority
    sizes="100vw"
    className="object-cover"
  />
</div>

    </div>
  </SwiperSlide>
))}

      </Swiper>
    </section>
  );
}
