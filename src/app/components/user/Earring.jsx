"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useGlobalContext } from "../context/GlobalContext";
import { Heart } from "lucide-react";
import Image from "next/image";
import { getOptimizedImage } from "../utils/cloudinary";

export default function EarringsMarquee() {
  const { subCategoriesMap, wishlist, refetchProductsByCategory } = useGlobalContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const earringsCategoryId = "693bbd1b430ea8120089b2ab";
  const subCategories = subCategoriesMap[earringsCategoryId] || [];

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
      } catch (err) {
        console.error("Error fetching earrings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loop = filteredProducts;
  return (
    <section className="relative z-50 py-16 px-4 sm:px-8 lg:px-16">
       <div className="absolute z-0 top-0  right-1/2 opacity-40">
      <Image
  src="/Images/bg1.png"
  alt=""
  width={220}
  height={220}
  priority={false}
  sizes="(max-width: 768px) 100vw, 220px"
  className="w-full h-auto object-cover"
/>

      </div>
     
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center mb-8">
        <div className="max-w-xl">
          {" "}
          <h2 className="text-3xl md:text-4xl font-mosetta font-medium text-[#99571d]">Shop Earrings</h2>
          <p className="text-md md:text-xl text-stone-500 font-serif mt-4">
            From timeless studs to graceful chandbalis, find your perfect pair.
          </p>
        </div>
       <div>
        <Swiper
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={16}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          speed={800}
          loop={subCategories.length > 3}
          className="mt-4 xl:mt-0"
        >
          {subCategories?.map((sub) => (
            <SwiperSlide key={sub._id} className="!w-auto">
              <Link href={`/category/earrings/${earringsCategoryId}`}>
                <div className="hover:bg-[#B67032] text-nowrap hover:text-white rounded-xl px-4 py-2 transition-all duration-300 text-[#B67032] text-sm lg:text-md font-medium cursor-pointer">
                  {sub.name.toUpperCase()}
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      </div>
      <div className="z-50 overflow-x-auto scrollbar-hide">
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
            // 2. Add FreeMode to modules
            modules={[Navigation, Autoplay, FreeMode]} 
            slidesPerView={1.3}
            spaceBetween={16}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
              1536: { slidesPerView: 6 },
            }}
            autoplay={{
              delay: 0, // Continuous flow
              disableOnInteraction: false,
              pauseOnMouseEnter: true, 
            }}
            speed={5000} // Adjusted speed for smoothness
            loop={loop.length > 4} // Only loop if enough items
            freeMode={true} // 3. IMPORTANT: Prevents "snapping" calculation which is heavy on iOS
            grabCursor={true}
            style={{ width: '100%', height: '100%' }}
          > 
           {loop?.map((item) => (
            <SwiperSlide key={item._id}>
              <Link
                href={`/product/${item.name}/${item._id}`}
                className="group block bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition"
              >
          
<div className="relative h-[300px] overflow-hidden group">
  <Image
    src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.images?.[0]}`}
    alt={item.name || "Product image"}
    fill
    sizes="(max-width: 768px) 100vw, 300px"
    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
    loading="lazy"
  />

  {item?.subCategory && (
    <span className="absolute top-2 left-2 bg-[#B67032] text-white text-xs px-2 py-1 rounded z-10">
      {item.subCategory}
    </span>
  )}
</div>

                <div className="p-4">
                  <h4 className="font-serif text-stone-800 group-hover:text-[#B67032] truncate">
                    {item?.name}
                  </h4>
                  {item.description?.paragraphs?.[0] && (
                    <p className="text-sm text-stone-600 mt-1 line-clamp-2">
                      {item.description?.paragraphs[0]
                        .split(" ")
                        .slice(0, 10)
                        .join(" ")}
                      ...
                    </p>
                  )}
                </div>
              </Link>
            </SwiperSlide>
          ))}
            {/* {loop.map((item, idx) => {
              return (
                <SwiperSlide key={`${item._id}-${idx}`} className="h-auto">
                  <Link
                    href={`/product/${item.name}/${item._id}`}
                    className="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 border border-stone-100"
                  >
                    <div className="w-full h-[300px] relative overflow-hidden">
                      
                   
                      <img
                        // 4. Reduce resolution (400px is enough for thumbnails)
                        src={getOptimizedImage(item.images?.[0], { maxWidth: 400 })}
                        
                        // 5. CRITICAL: Use lazy loading so iPhone doesn't download 50 images at once
                        loading="lazy" 
                        
                        // 6. REMOVED fetchPriority="high"
                        alt={item.name}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                      />
                 

                      <div className="absolute top-2 left-2 bg-[#B67032] text-white text-[10px] uppercase px-2 py-1 rounded shadow-sm">
                        {item.subCategory || "Earring"}
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-serif font-medium text-stone-800 text-sm md:text-md line-clamp-1">
                          {item.name}
                        </h4>
                        <Heart className="w-5 h-5 text-stone-400" />
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })} */}
          </Swiper>
        )}
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
