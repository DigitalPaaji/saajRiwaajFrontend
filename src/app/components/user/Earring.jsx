"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useGlobalContext } from "../context/GlobalContext";
import { Heart } from "lucide-react";
import Image from "next/image";
import { getOptimizedImage } from "../utils/cloudinary";

export default function EarringsMarquee() {
  const { subCategoriesMap, wishlist, refetchProductsByCategory } =
    useGlobalContext();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const earringsCategoryId = "693bbd1b430ea8120089b2ab";
  const subCategories = subCategoriesMap?.[earringsCategoryId] || [];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await refetchProductsByCategory(earringsCategoryId);

        if (Array.isArray(result)) {
          const filtered = result.filter(
            (p) =>
              p?.category === earringsCategoryId ||
              p?.category?._id === earringsCategoryId
          );
          setFilteredProducts(filtered);
        } else {
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error("Error fetching earrings:", error);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [earringsCategoryId, refetchProductsByCategory]);

  if (!loading && !filteredProducts.length) return null;

  return (
    <section className="relative z-50 py-16 px-4 sm:px-8 lg:px-16 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute z-0 top-0 right-1/2 opacity-40 pointer-events-none">
        <Image
          src="/Images/bg1.png"
          alt=""
          width={220}
          height={220}
          sizes="(max-width: 768px) 100vw, 220px"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Header */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center mb-8 relative z-10">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-mosetta font-medium text-[#99571d]">
            Shop Earrings
          </h2>
          <p className="text-md md:text-xl text-stone-500 font-serif mt-4">
            From timeless studs to graceful chandbalis, find your perfect pair.
          </p>
        </div>

        {/* Subcategory Marquee */}
        <Swiper
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={12}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          speed={700}
          loop
          className="mt-4 xl:mt-0"
        >
          {subCategories.map((sub) => (
            <SwiperSlide key={sub._id} className="!w-auto">
              <Link href={`/category/earrings/${earringsCategoryId}`}>
                <div className="hover:bg-[#B67032] hover:text-white text-nowrap rounded-xl px-4 py-2 transition-all duration-300 text-[#B67032] text-sm font-medium cursor-pointer">
                  {sub.name?.toUpperCase()}
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Products */}
      <div className="relative z-10">
        {loading ? (
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="w-[300px] bg-white rounded-xl overflow-hidden shadow animate-pulse flex-shrink-0"
              >
                <div className="w-full h-[260px] bg-stone-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-stone-300 rounded w-3/4" />
                  <div className="h-3 bg-stone-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={1.2} // ✅ iOS-safe
            spaceBetween={14}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            autoplay={{
              delay: 1, // ✅ MUST NOT be 0 (Safari fix)
              disableOnInteraction: false,
            }}
            speed={3500} // ✅ iPhone GPU safe
            loop
            grabCursor
            allowTouchMove
          >
            {filteredProducts.map((item) => (
              <SwiperSlide key={item._id}>
                <Link
                  href={`/product/${item.name}/${item._id}`}
                  className="group block rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow bg-white"
                >
                  {/* Image */}
                  <div className="w-full h-[260px] relative overflow-hidden">
                    <img
                      src={getOptimizedImage(item.images?.[0], {
                        maxWidth: 800,
                      })}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      style={{ willChange: "transform" }}
                    />

                    <div className="absolute top-2 left-2 bg-[#B67032] text-white text-xs px-2 py-1 rounded">
                      {item.subCategory ||
                        item.subcategory?.name ||
                        "Earring"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-serif font-medium text-stone-800 group-hover:text-[#B67032] transition-colors text-sm truncate">
                        {item.name}
                      </h4>

                      <Heart
                        className={`w-5 h-5 flex-shrink-0 ${
                          wishlist?.includes(item._id)
                            ? "text-red-500"
                            : "text-stone-700"
                        }`}
                      />
                    </div>

                    {item.description?.paragraphs?.[0] && (
                      <p className="text-sm text-stone-600 mt-1 line-clamp-2">
                        {item.description.paragraphs[0]
                          .split(" ")
                          .slice(0, 10)
                          .join(" ")}
                        …
                      </p>
                    )}
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* iOS hover fix */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @media (hover: none) {
          .group-hover\\:scale-105 {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
