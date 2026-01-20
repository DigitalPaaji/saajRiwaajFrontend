"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useGlobalContext } from "../context/GlobalContext";
import { getOptimizedImage } from "../utils/cloudinary";
import Image from "next/image";

export default function EarringsMarquee() {
  const {
    allProducts,
    refetchAllProducts,
  } = useGlobalContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

//   const subCategories = subCategoriesMap[categoryId] || [];

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const result = await refetchProductsByCategory(categoryId);

//         if (Array.isArray(result)) {
//           const filtered = result.filter(
//             (p) => p?.category === categoryId || p?.category?._id === categoryId
//           );
//           setFilteredProducts(filtered);
//         } else {
//           setFilteredProducts([]);
//         }
//       } catch (err) {
//         console.error("Error fetching earrings:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

  useEffect(() => {
    refetchAllProducts();
  }, [refetchAllProducts]);



  return (
    <section className="py-16 ">
     

   

      {/* ------------------------- ALL PRODUCTS GRID ------------------------- */}
      <div className="">
        <h2 className="text-xl md:text-2xl font-mosetta font-semibold text-[#99571d] mb-6">
          Explore All Products
        </h2>

        <div className="overflow-x-auto scrollbar-hide">
          
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
              delay: 1,
              disableOnInteraction: false,
            }}
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
                    <div className="relative w-full h-[300px] group">
  <Image
    src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.images?.[0]}`}
    alt={item.name || "Product Image"}
    fill
    sizes="(max-width: 768px) 100vw, 300px"
    loading="lazy"
    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
  />

  {/* Optional subCategory badge */}
  {item.subCategory || item.subcategory?.name ? (
    <div className="absolute top-2 left-2 bg-[#B67032] text-white text-xs px-2 py-1 rounded">
      {item.subCategory || item.subcategory?.name}
    </div>
  ) : null}
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
