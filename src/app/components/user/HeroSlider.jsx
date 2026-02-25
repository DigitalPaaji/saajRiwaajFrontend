"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const SwiperCore = dynamic(
  async () => {
    const mod = await import("swiper/react");
    return mod.Swiper;
  },
  { ssr: false }
);

const SwiperSlide = dynamic(
  async () => {
    const mod = await import("swiper/react");
    return mod.SwiperSlide;
  },
  { ssr: false }
);

import { Pagination, Autoplay, EffectFade } from "swiper/modules";

export default function HeroSlider({ banners }) {
  return (
    <section className="relative w-full">
      <SwiperCore
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
        className="w-full"
      >
        {banners.map((banner, index) => {
          const isFirst = index === 0;

          return (
            <SwiperSlide key={banner._id || index}>
              <div className="relative w-full h-[450px] md:h-[600px] lg:h-[700px]">
                <Image
                  src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${
                    banner.desktopImage
                  }`}
                  alt={banner.title || "Banner"}
                  fill
                  priority={isFirst}
                  sizes="100vw"
                  placeholder="blur"
                  blurDataURL="/blur-placeholder.png"
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          );
        })}
      </SwiperCore>
    </section>
  );
}