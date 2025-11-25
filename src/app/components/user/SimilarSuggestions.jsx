"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useGlobalContext } from "../context/GlobalContext";

export default function EarringsMarquee({ categoryId, categoryName }) {
  const {
    allProducts,
    refetchAllProducts,
    subCategoriesMap,
    refetchProductsByCategory,
  } = useGlobalContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const subCategories = subCategoriesMap[categoryId] || [];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await refetchProductsByCategory(categoryId);

        if (Array.isArray(result)) {
          const filtered = result.filter(
            (p) => p.category === categoryId || p.category?._id === categoryId
          );
          setFilteredProducts(filtered);
        } else {
          setFilteredProducts([]);
        }
      } catch (err) {
        console.error("Error fetching earrings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    refetchAllProducts();
  }, [refetchAllProducts]);



  return (
    <section className="py-16 px-4 sm:px-8 lg:px-16">
      <div className="flex items-center justify-between gap-4 xl:gap-0 flex-wrap xl:flex-nowrap mb-8">
        <div className="max-w-xl">
          <h2 className="text-xl md:text-2xl font-mosetta  font-semibold text-[#99571d]  capitalize">
            You will also love these!
          </h2>
        </div>
        <ul className="flex gap-4  flex-wrap text-md font-medium">
          {subCategories.map((sub) => (
            <Link
              key={sub._id}
              href={`/category/${categoryName}/${categoryId}`}
            >
              <li>
                <div className="hover:bg-[#B67032] hover:text-white rounded-xl p-2 transition-all duration-300 text-[#B67032]">
                  {sub.name.toUpperCase()}
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        {loading ? (
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="w-[400px] bg-white rounded-xl overflow-hidden shadow-md animate-pulse flex-shrink-0"
              >
                <div className="w-full h-[300px] bg-stone-200" />
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
            slidesPerView={1.3}
            spaceBetween={16}
            breakpoints={{
              640: { slidesPerView: 1.3 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
              1536: { slidesPerView: 6 },
            }}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            speed={6000}
            loop={true}
            grabCursor={true}
          >
            {filteredProducts.map((item, idx) => {
              return (
                <SwiperSlide key={idx}>
                  <Link
                    href={`/product/${item.name}/${item._id}`}
                    className="group flex-shrink-0 w-full bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow"
                  >
                    <div className="w-full h-[300px] relative">
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {item.subCategory ||
                        (item.subcategory?.name && (
                          <div className="absolute top-2 left-2 bg-[#B67032] text-white text-xs px-2 py-1 rounded"></div>
                        ))}
                    </div>
                    <div className="p-4 flex flex-col justify-between">
                      <h4 className="font-semibold text-stone-800 group-hover:text-[#B67032] transition-colors text-md truncate">
                        {item.name}
                      </h4>
                      {item.description?.paragraphs?.[0] && (
                        <p className="text-sm text-stone-600 mt-1 line-clamp-2">
                          {item.description.paragraphs[0]
                            .split(" ")
                            .slice(0, 10)
                            .join(" ")}
                          ...
                        </p>
                      )}
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>

      {/* ------------------------- ALL PRODUCTS GRID ------------------------- */}
      <div className="mt-20">
        <h2 className="text-xl md:text-2xl font-mosetta font-semibold text-[#99571d] mb-6">
          Explore All Products
        </h2>

        <div className="overflow-x-auto scrollbar-hide">
          {loading ? (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-[400px] bg-white rounded-xl overflow-hidden shadow-md animate-pulse flex-shrink-0"
                >
                  <div className="w-full h-[300px] bg-stone-200" />
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
              slidesPerView={1.3}
              spaceBetween={16}
              breakpoints={{
                640: { slidesPerView: 1.3 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 },
                1536: { slidesPerView: 6 },
              }}
              autoplay={false}
              speed={6000}
              loop={true}
              grabCursor={true}
            >
              {allProducts.map((item, idx) => {
                return (
                  <SwiperSlide key={idx}>
                    <Link
                      href={`/product/${item.name}/${item._id}`}
                      className="group flex-shrink-0 w-full bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow"
                    >
                      <div className="w-full h-[300px] relative">
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* {item.subCategory ||
                          (item.subcategory?.name && (
                            <div className="absolute top-2 left-2 bg-[#B67032] text-white text-xs px-2 py-1 rounded"></div>
                          ))} */}
                      </div>
                      <div className="p-4 flex flex-col justify-between">
                        <h4 className="font-semibold text-stone-800 group-hover:text-[#B67032] transition-colors text-md truncate">
                          {item.name}
                        </h4>
                        {item.description?.paragraphs?.[0] && (
                          <p className="text-sm text-stone-600 mt-1 line-clamp-2">
                            {item.description.paragraphs[0]
                              .split(" ")
                              .slice(0, 10)
                              .join(" ")}
                            ...
                          </p>
                        )}
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
