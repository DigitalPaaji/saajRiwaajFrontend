"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useGlobalContext } from "../context/GlobalContext";
import Image from "next/image";
import { FaRupeeSign } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import { base_url } from "../store/utile";

export default function EarringsMarquee() {
  const [subcat,setSubCat]= useState([ ])
 const [loading,setLoading]=useState(true)
   const [productsByCategory2, setProductsByCategory2] = useState([ ]);
  const info = useSelector(state=>state.category.info);


  const earringsCategoryId = process.env.NEXT_PUBLIC_NECKWERE_CATEGORY_ID


const fetchProductsByCategory2 = async (categoryId) => {
  try {
   setLoading(true)

    const res = await axios.get(
      `${base_url}/product/random/${categoryId}`
    );

    const data = await res.data;

    setProductsByCategory2(data.products);

  } catch (err) {
    console.error("Error fetching products:", err);
  }finally{
    setLoading(false)
  }
};

 





useEffect(() => {
  fetchProductsByCategory2(earringsCategoryId);
}, []);





  useEffect(()=>{
 const subcatfilter = info?.data?.find(
    (item) => item?.category?._id === earringsCategoryId
  );

  setSubCat(subcatfilter?.subCategories, "filterrr");
  },[info ])

  return (
    <section className="relative py-16 px-4 sm:px-8 lg:px-16">
      {/* Background */}
    <div className="absolute -top-32 left-0 opacity-20 z-[10] pointer-events-none select-none">
      <Image
        src="/Images/bg1.png"
        alt=""
        width={360}
        height={360}
        draggable={false}
      />
    </div>

      {/* Heading + Subcategories */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center mb-8">
        <div className="max-w-xl">
          <h2 className="text-2xl md:text-3xl font-mosetta text-[#99571d]">
            Shop Neckwear
          </h2>
         <p className="text-md md:text-lg text-stone-500 font-serif mt-4">
  From lightweight daily wear to exquisite wedding neckpieces, find your perfect match.
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
            {subcat?.length > 0 &&  subcat?.map((sub) => (
              <SwiperSlide key={sub._id} className="!w-auto">
                <Link href={`/category/neckwear/${earringsCategoryId}?subcategory=${sub._id}`}>
                  <div className="montserrat hover:underline text-nowrap px-4 py-2 transition-all duration-300 text-[#B67032] text-sm lg:text-md font-medium cursor-pointer">
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
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
  {Array.from({ length: 6 }).map((_, idx) => (
    <div
      key={idx}
      className="flex-shrink-0 w-[70%] sm:w-[45%] md:w-[30%] lg:w-[22%] xl:w-[18%] rounded  animate-pulse"
    >
      <div className="relative aspect-square overflow-hidden shadow-lg rounded-lg bg-gray-200" />

      <div className="mt-4 h-5 w-3/4 bg-gray-200 rounded" />
      <div className="mt-3 h-5 w-full bg-gray-200 rounded" />
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
          {  productsByCategory2.map((item) => (
            <SwiperSlide key={item._id}>
              <Link
                href={`/product/${item.name}/${item._id}`}
                className="group block overflow-hidden transition"
              >
          
<div className="relative h-[300px] overflow-hidden group shadow-lg  ">
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

             <div className="flex items-center lg:items-start lg:gap-2 flex-row justify-between py-4 px-2">
      <h3 className="montserrat  font-medium text-stone-700 group-hover:text-[#B67032] transition-colors duration-300 capitalize">
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
             
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
