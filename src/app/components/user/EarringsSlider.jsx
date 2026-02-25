"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const Swiper = dynamic(
  async () => (await import("swiper/react")).Swiper,
  { ssr: false }
);

const SwiperSlide = dynamic(
  async () => (await import("swiper/react")).SwiperSlide,
  { ssr: false }
);

import { Autoplay } from "swiper/modules";

export default function EarringsSlider({ products, categoryId }) {
  return (
    <section className="relative py-16 px-4 sm:px-8 lg:px-16">
      <h2 className="text-3xl font-mosetta text-[#99571d] mb-8">
        Shop Neckwear
      </h2>

      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        spaceBetween={16}
        autoplay={{ delay: 3000 }}
        loop
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {products.map((item, index) => (
          <SwiperSlide key={item._id}>
            <Link
              href={`/product/${item.name}/${item._id}`}
              className="block bg-white rounded-xl overflow-hidden shadow"
            >
              <div className="relative h-[300px]">
                <Image
                  src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.images?.[0]}`}
                  alt={item.name}
                  fill
                  sizes="(max-width:768px) 100vw, 300px"
                  priority={index < 2}   // only first 2 images priority
                  loading={index < 2 ? "eager" : "lazy"}
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h4 className="font-serif text-stone-800 truncate">
                  {item.name}
                </h4>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}