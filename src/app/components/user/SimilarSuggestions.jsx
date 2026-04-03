"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useGlobalContext } from "../context/GlobalContext";
import Image from "next/image";
import { FaRupeeSign, FaStarHalfAlt } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { Heart } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
    const [productsByCategory, setProductsByCategory] = useState([]);

  const subCategories = subCategoriesMap[categoryId] || [];


  
     const fetchProductsByCategory = useCallback(async (categoryId,page=1) => {
        try {setLoading(true)
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_LOCAL_PORT}/product/random/${categoryId}?page=${page}`
          );
          const data = await res.json();
     
  
          setProductsByCategory(data.products);
        } catch (err) {
          console.error("Error fetching products by category:", err);
         
        }finally{
          setLoading(false)
        }
     }, []);


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
fetchProductsByCategory(categoryId)
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






  return (
    <section className="py-16 px-4 md:px-12 lg:px-24 xl:px-40 2xl:px-52">
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
                <div className="montserrat hover:underline  text-nowrap px-4 py-2 transition-all duration-300 text-[#B67032] text-sm lg:text-md cursor-pointer">
                  {sub.name.toUpperCase()}
                </div>
              {/* </Link> */}
            </SwiperSlide>
          ))}
        </Swiper>
       </div>
      </div>

     
     

     
     <div className="overflow-x-auto scrollbar-hide">
        {loading  ? (
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
              768: { slidesPerView: 2.5 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
              1536: { slidesPerView: 5 },
            }}
            autoplay={{
              delay: 1,
              disableOnInteraction: false,
            }}
            speed={6000}
            loop={true}
            grabCursor={true}
          >
            {productsByCategory.length>0 && productsByCategory?.map((item, idx) => {
              return (
                <SwiperSlide key={idx}>
                  <Link
                    href={`/product/${item.name}/${item._id}`}
                    className="group flex-shrink-0 w-full   overflow-hidden "
                  >

<div className="relative w-full h-[300px] overflow-hidden group shadow-lg">
  <Image
   src={'/Images/4.webp'}
    // src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.images?.[0]}`}
    alt={item.name || "Product image"}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    loading="lazy"
    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
  />


  {(item.subCategory || item.subcategory?.name) && (
    <div className="absolute top-2 left-2 bg-[#B67032] text-white text-xs px-2 py-1 rounded capitalize">
      {item.subCategory || item.subcategory?.name}
    </div>
  )}
</div>
                    <div className="p-3 md:p-4 flex flex-col gap-2 bg-stone-50">
        <div className="flex flex-col gap-1 text-center sm:text-left">

          {/* PRODUCT NAME */}
          <div className="flex items-center justify-between gap-1 ">
            <h3 className="text-sm md:text-base font-medium text-slate-900 capitalize leading-tight break-words montserrat">
              {item.name.toLowerCase()}
            </h3>

            <button className="cursor-pointer">
              <Heart className="w-6 h-6 text-stone-700" />
            </button>
          </div>

          {/* ⭐ REVIEWS SECTION */}
          <div className=" mb-1 flex items-center justify-center sm:justify-start gap-1">
            {[1, 2, 3, 4].map((star) => (
              <FaStar key={star} size={12} className="text-yellow-500" />
            ))}
            <FaStarHalfAlt size={12} className="text-yellow-500" />

            <span className="text-xs text-slate-500 ml-1">(120 reviews)</span>
          </div>

{/* {soldCount === undefined ? (
  <div className="w-28 h-3 bg-gray-200 animate-pulse rounded"></div>
) : (
  <p className="text-[11px] text-red-600 font-semibold">
    🔥 {soldCount} bought in last 24 hours
  </p>
)} */}

          {/* PRICE SECTION */}
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
            <span className="flex items-center text-[#8b5424] font-bold text-sm md:text-base">
              <FaRupeeSign size={12} className="md:w-3.5" />
              {Math.floor(item.finalPrice)}
            </span>

            {item.price > item.finalPrice && (
              <span className="flex items-center text-slate-400 text-xs line-through">
                <FaRupeeSign size={10} />
                {Math.floor(item.price)}
              </span>
            )}
          </div>
        </div>
      </div>      
      {/* <div className="flex items-center lg:items-start lg:gap-2 flex-row justify-between py-4 px-2">
                  <h3 className="montserrat font-medium text-stone-700 group-hover:text-[#B67032] transition-colors duration-300 capitalize">
  {item.name
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())}
</h3>
                        <h3 className="font-semibold  text-md text-[#B67032] transition-colors duration-300 flex items-center ">
                                                        <span className="line-through mr-4 flex items-center">
                                                          <FaRupeeSign size={14} />
                                                          {Math.floor(item.price)}
                                                        </span>
                                                        <FaRupeeSign size={14} />
                                                        {Math.floor(item.finalPrice)}
                                                      </h3>
               
               </div>
               */}
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
                  className="w-[400px] overflow-hidden shadow-md animate-pulse flex-shrink-0"
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
                      className="group flex-shrink-0 w-full  overflow-hidden"
                    >
<div className="relative w-full h-[300px] overflow-hidden group shadow-lg">
  <Image
     src={'/Images/2.webp'}
    // src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.images?.[0]}`}
    alt={item.name || "Product image"}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    loading="lazy"
    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
  />
</div>
                  <div className="flex items-center lg:items-start lg:gap-2 flex-row justify-between py-4 px-2">
                  <h3 className="montserrat text-stone-700 group-hover:text-[#B67032] transition-colors duration-300 capitalize">
  {item.name
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())}
</h3>
                        <h3 className="font-semibold  text-md text-[#B67032] transition-colors duration-300 flex items-center ">
                                                        <span className="line-through mr-4 flex items-center">
                                                          <FaRupeeSign size={14} />
                                                          {Math.floor(item.price)}
                                                        </span>
                                                        <FaRupeeSign size={14} />
                                                        {Math.floor(item.finalPrice)}
                                                      </h3>
               
               </div>
                      {/* <div className="p-4 flex flex-col justify-between">
                        <h4 className="font-semibold text-stone-800 group-hover:text-[#B67032] transition-colors text-md capitalize">
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
                      </div> */}
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
