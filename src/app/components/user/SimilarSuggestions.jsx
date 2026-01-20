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

export default function EarringsMarquee({ categoryId }) {
  const {
    allProducts,
    refetchAllProducts,
    subCategoriesMap,
    refetchProductsByCategory,
  } = useGlobalContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
const [allLoading, setAllLoading] = useState(true);

  // const [loading, setLoading] = useState(true);

  const subCategories = subCategoriesMap[categoryId] || [];

//   useEffect(() => {
//     console.log("categoryId:", categoryId);
// console.log("filteredProducts:", filteredProducts);
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
  if (!categoryId) return;

  let mounted = true;

  const fetchData = async () => {
    setSimilarLoading(true);
    try {
      const result = await refetchProductsByCategory(categoryId);

      if (mounted && Array.isArray(result)) {
        setFilteredProducts((prev) =>
          prev.length === result.length ? prev : result
        );
      }
    } catch (err) {
      console.error("Error fetching similar products:", err);
      if (mounted) setFilteredProducts([]);
    } finally {
      if (mounted) setSimilarLoading(false);
    }
  };

  fetchData();

  return () => {
    mounted = false;
  };
}, [categoryId]); 
useEffect(() => {
  let mounted = true;

  const fetchAll = async () => {
    setAllLoading(true);
    await refetchAllProducts();
    if (mounted) setAllLoading(false);
  };

  fetchAll();

  return () => {
    mounted = false;
  };
}, []);


//useEffect(() => {
//   const fetchAll = async () => {
//     setAllLoading(true);
//     await refetchAllProducts();
//     setAllLoading(false);
//   };

//   fetchAll();
// }, [refetchAllProducts]);



  // useEffect(() => {
  //   refetchAllProducts();
  // }, [refetchAllProducts]);



  return (
    <section className="py-16 px-4 sm:px-8 lg:px-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-wrap xl:flex-nowrap mb-8">
       
          <h2 className="text-xl md:text-2xl font-mosetta  font-semibold text-[#99571d]  capitalize">
            You will also love these!
          </h2>
       
       <div className=" ">
          <Swiper
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={16}
          autoplay={{
            delay: 2500, // scroll every 2.5 sec
            disableOnInteraction: false,
          }}
          speed={800}
          loop
          className="mt-4 xl:mt-0"
        >
          {subCategories.map((sub) => (
            <SwiperSlide key={sub._id} className="!w-auto">
              {/* <Link href={`/category/neckwear/${sub._id}`}> */}
                <div className="hover:bg-[#B67032] text-nowrap hover:text-white rounded-xl px-4 py-2 transition-all duration-300 text-[#B67032] text-sm lg:text-md font-medium cursor-pointer">
                  {sub.name.toUpperCase()}
                </div>
              {/* </Link> */}
            </SwiperSlide>
          ))}
        </Swiper>
       </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        {similarLoading  ? (
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
              delay: 1,
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

<div className="relative w-full h-[300px] overflow-hidden group">
  <Image
    src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.images?.[0]}`}
    alt={item.name || "Product image"}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    loading="lazy"
    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
  />

  {/* Optional category badge */}
  {(item.subCategory || item.subcategory?.name) && (
    <div className="absolute top-2 left-2 bg-[#B67032] text-white text-xs px-2 py-1 rounded">
      {item.subCategory || item.subcategory?.name}
    </div>
  )}
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
          {allLoading  ? (
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
<div className="relative w-full h-[300px] overflow-hidden group">
  <Image
    src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.images?.[0]}`}
    alt={item.name || "Product image"}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    loading="lazy"
    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
  />
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
