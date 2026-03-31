"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

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


  const earringsCategoryId = process.env.NEXT_PUBLIC_EARRINGS_CATEGORY_ID


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
    <section className="relative py-16 px-4 sm:px-8 lg:px-16 overflow-hidden">

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center mb-8">
        <div className="max-w-xl">
          <h2 className="text-2xl md:text-3xl font-mosetta text-[#99571d]">
            Shop Earrings
          </h2>
          <p className="text-md md:text-lg text-stone-500 font-serif mt-4">
            From timeless studs to graceful chandbalis, find your perfect pair.
          </p>
        </div>

        {/* Subcategories */}
        <Swiper
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={16}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          speed={800}
          loop={subcat?.length > 3}

        >
          { subcat?.length >0 && subcat.map((sub) => (
            <SwiperSlide key={sub._id} className="!w-auto">
              <Link href={`/category/neckwear/${earringsCategoryId}?subcategory=${sub._id}`}>
                <div className="montserrat hover:underline text-nowrap px-4 py-2 transition-all duration-300 text-[#B67032] text-sm font-medium">
                  {sub.name.toUpperCase()}
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
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
          spaceBetween={16}
          loop={productsByCategory2.length >= 6}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          speed={900}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
            1536: { slidesPerView: 6 },
          }}
        >
          {productsByCategory2.length > 0 &&  productsByCategory2.map((item) => (
            <SwiperSlide key={item._id}>
              <Link
                href={`/product/${item.name}/${item._id}`}
                className="group block  overflow-hidden "
              >
                <div className="relative shadow-lg   h-[300px] overflow-hidden">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.images?.[0]}`}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-200"
                  />
                </div>

               
               <div className="flex items-center lg:items-start lg:gap-2 flex-row justify-between py-4 px-2">
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
              
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}

