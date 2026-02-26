"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Image from "next/image";

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
      <div className="relative w-full h-[400px] md:h-[720px] lg:h-[540px] xl:h-[680px] animate-pulse  flex items-center justify-center">
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
        className="w-full relative h-[400px] md:h-[720px] lg:h-[540px] xl:h-[680px]"
      >
        {banners?.map((banner, index) => {
          const isFirstSlide = index === 0;

          return (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[400px] md:h-[720px] lg:h-[540px] xl:h-[680px]">
                <div className="absolute inset-0 w-screen block lg:hidden">
                  <Image
                  // src={'/Images/banner1.webp'}
                    src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${banner.mobileImage}`}
                    alt="Mobile Banner"
                    fill
                    priority={isFirstSlide}
                    sizes="100vw"
                    className=""
                  />
                </div>

                <div className="absolute inset-0 hidden lg:block">
                  <Image
                  //  src={'/Images/banner2.webp'}
                    src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${banner.desktopImage}`}
                    alt="Desktop Banner"
                    fill
                    priority={isFirstSlide}
                    sizes="100vw"
                    className="object-cove"
                  />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
