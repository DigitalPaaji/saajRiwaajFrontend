"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useGlobalContext } from "../context/GlobalContext";
import Image from "next/image";

export default function EarringsMarquee() {
  const { subCategoriesMap } = useGlobalContext();
    const [productsByCategory, setProductsByCategory] = useState([]);
  
  const [loading, setLoading] = useState(true);

  const earringsCategoryId = "693bbd83430ea8120089b2c1";
  const subCategories = subCategoriesMap[earringsCategoryId] || [];


   const fetchProductsByCategory = useCallback(async (categoryId,page=1) => {
      try {setLoading(true)
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_PORT}/product/category/${categoryId}?page=${page}`
        );
        const data = await res.json();
        // const shuffled = Array.isArray(data)
        //   ? [...data.products].sort(() => 0.5 - Math.random())
        //   : [];

        setProductsByCategory(data.products);
      } catch (err) {
        console.error("Error fetching products by category:", err);
       
      }finally{
        setLoading(false)
      }
   }, []);

  useEffect(() => {
    // const fetchData = async () => {
    //   setLoading(true);
    //   try {
    //     const result = await refetchProductsByCategory(earringsCategoryId);
    //     if (Array.isArray(result)) {
    //       const filtered = result.filter(
    //         (p) =>
    //           p?.category === earringsCategoryId ||
    //           p?.category?._id === earringsCategoryId
    //       );
    //       setFilteredProducts(filtered);
    //     }
    //   } catch (err) {
    //     console.error(err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    fetchProductsByCategory(earringsCategoryId)
 
  }, []);

  return (
    <section className="relative py-16 px-4 sm:px-8 lg:px-16">
      {/* Background */}
      <div className="absolute -top-32 left-0 opacity-20">
        <Image src="/Images/bg1.png" alt="" width={360} height={360} />
      </div>

      {/* Heading + Subcategories */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center mb-8">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-mosetta text-[#99571d]">
            Shop Neckwear
          </h2>
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
              delay: 2500, // scroll every 2.5 sec
              disableOnInteraction: false,
            }}
            speed={800}
            loop
            className="mt-4 xl:mt-0"
          >
            {subCategories.map((sub) => (
              <SwiperSlide key={sub._id} className="!w-auto">
                <Link href={`/category/neckwear/${earringsCategoryId}?subcategory=${sub._id}`}>
                  <div className="hover:bg-[#B67032] text-nowrap hover:text-white rounded-xl px-4 py-2 transition-all duration-300 text-[#B67032] text-sm lg:text-md font-medium cursor-pointer">
                    {sub.name.toUpperCase()}
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* PRODUCTS */}
      {loading ? (
        <div className="flex gap-4 overflow-x-auto">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="min-w-[220px] bg-white rounded-xl shadow animate-pulse"
            >
              <div className="h-[300px] bg-stone-200" />
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
          slidesPerView={1}
          slidesPerGroup={1} // ⭐ 1-by-1 scroll
          spaceBetween={16}
          loop
          autoplay={{
            delay: 3000, // scroll every 3 sec
            disableOnInteraction: false,
          }}
          speed={900}
          grabCursor
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
            1536: { slidesPerView: 6 },
          }}
        >
          {productsByCategory.map((item) => (
            <SwiperSlide key={item._id}>
              <Link
                href={`/product/${item.name}/${item._id}`}
                className="group block bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition"
              >
          
<div className="relative h-[300px] overflow-hidden group">
    <Image
      src={ `${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.images?.[0]}`}
    alt={item.name}
    fill
    sizes="(max-width: 768px) 100vw, 300px"
    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
    loading="lazy"
  />

    
  {item?.subCategory && <span className="absolute top-2 left-2 bg-[#B67032] text-white text-xs px-2 py-1 rounded z-10">
    {item.subCategory }
  </span>
}
</div>

                <div className="p-4">
                  <h4 className="font-serif text-stone-800 group-hover:text-[#B67032] truncate">
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
          ))}
        </Swiper>
      )}
    </section>
  );
}
