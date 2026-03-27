"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Image from "next/image";


const Carousel = () => {
  const desktopBanner = [
    // "banner.webp",
    "new2.webp",
    // "banner1.webp",
    // "banner2.webp",
  ];

  const mobileBanner = [
    // "banner.webp",
    "chainsmobile.webp",
    // "banner1.webp",
    // "banner2.webp",
  ];

  return (
    <div className="relative w-full xl:h-[924px] overflow-hidden z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-transparent pointer-events-none z-20" />
      <section className="relative w-full z-10">
        <div className="hidden md:block">
          <Swiper
            modules={[Pagination, Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="w-full relative  md:h-[420px] lg:h-[540px] xl:h-[924px]"
          >
            {desktopBanner?.map((banner, index) => {
              const isFirstSlide = index === 0;

              return (
                <SwiperSlide key={index}>
                  <div className="relative w-full  md:h-[420px] lg:h-[540px] xl:h-[924px]">
                    <div className="absolute inset-0 hidden md:block">
                      <Image
                        src={`/banner/desktop/${banner}`}
                        alt="Desktop Banner"
                        fill
                        priority={isFirstSlide}
                        sizes="100vw"
                        className=""
                      />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        <div className=" block md:hidden">
          <Swiper
            modules={[Pagination, Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="w-full relative h-[400px] "
          >
            {mobileBanner?.map((banner, index) => {
              const isFirstSlide = index === 0;

              return (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-[400px] ">
                    <div className="absolute inset-0 w-screen block md:hidden">
                      <Image
                        src={`/banner/mobile/${banner}`}
                        alt="Mobile Banner"
                        fill
                        priority={isFirstSlide}
                        sizes="100vw"
                        className=""
                      />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>
    </div>
  );
};

export default Carousel;
