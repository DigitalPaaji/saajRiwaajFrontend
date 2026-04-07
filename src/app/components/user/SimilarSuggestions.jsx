"use client";
import React, {useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { FaRupeeSign, FaStarHalfAlt } from "react-icons/fa";
import { FaHeart, FaRegStar, FaStar } from "react-icons/fa6";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getRandomProduct } from "../store/randomProductSlice";
import axios from "axios";
import { base_url } from "../store/utile";
import { addToWishlist, removeFromWishlist } from "../store/wishListSlice";

export default function EarringsMarquee({ categoryId }) {
 
  
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.randomProduct);
  const [allProduct,setAllProduct]=useState([ ])
const wishlist = useSelector(state=>state.wishlist.items)

  const fetchRandomProduct = async () => {
    try {
      setLoading(true)
     const response = await axios.get(`${base_url}/product/getrandomproduct`)
   const data = await response.data;
if(data.success){
  setAllProduct(data.products)
}

    } catch (error) {
      setAllProduct([ ])
    }finally{
      setLoading(false)
    }
  }
    








  useEffect(() => {
   fetchRandomProduct()
      dispatch(getRandomProduct(categoryId));
  
  }, [categoryId]);



  return (
    <section className="py-16 px-4 md:px-12 lg:px-24 xl:px-40 2xl:px-52">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-wrap xl:flex-nowrap mb-8">
       
          <h2 className="text-xl md:text-2xl montserrat font-semibold text-[#292927]  capitalize">
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
          
        </Swiper>
       </div>
      </div>

     
     

     
     <div className="overflow-x-auto scrollbar-hide">
        {isLoading  ? (
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
            {products.length>0 && products?.map((item, idx) => {
              return (
                <SwiperSlide key={idx}>
                  <Link
                    href={`/product/${item.name}/${item._id}`}
                    className="group flex-shrink-0 w-full   overflow-hidden "
                  >

<div className="relative w-full h-[300px] overflow-hidden group shadow-lg">
  <Image
  //  src={'/Images/4.webp'}
    src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.images?.[0]}`}
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

           <button
                          onClick={(e)=>{
                                       e.preventDefault(),
                                       dispatch(
                                           !wishlist?.some((w) => w === item._id)
                                             ? addToWishlist(item._id)
                                             : removeFromWishlist(item._id),
                                         )} }
                         className="cursor-pointer"
                       >
                        
                          {wishlist?.some((w) => w === item._id) ? (
                                         <FaHeart className="w-6 h-6 text-red-500" />
                                       ) : (
                                         <Heart className="w-6 h-6 text-stone-700" />
                                       )} 
                       
                       </button>




          </div>
  <div className="  text-red-600 py-1.5  text-sm font-semibold w-fit flex items-center gap-1 ">
    🔥 {item._id.slice(-2).charCodeAt()+new Date(Date.now()).getDate()-30} bought in last 24 hours
  </div>
          {/* ⭐ REVIEWS SECTION */}
          <div className=" flex items-center justify-center sm:justify-start gap-1">
           {[...Array(5)].map((_, index) => {
                                                                  const starValue = index + 1;
                                                        
                                                                  if (item.rating >= starValue) {
                                                                    return <FaStar key={index} className="text-yellow-500" />;
                                                                  } else if (item.rating >= starValue - 0.5) {
                                                                    return <FaStarHalfAlt key={index} className="text-yellow-500" />;
                                                                  } else {
                                                                    return <FaRegStar key={index} className="text-yellow-500" />;
                                                                  }
                                                                })}

            <span className="text-xs text-slate-500 ml-1">({item.reviewCount || 0} reviews)</span>
          </div>



        
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

                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div> 

      {/* ------------------------- ALL PRODUCTS GRID ------------------------- */}
      <div className="mt-20">
        <h2 className="text-xl md:text-2xl montserratfont-semibold  text-[#292927] mb-6">
          Explore All Products
        </h2>

        <div className="overflow-x-auto scrollbar-hide">
          {loading  ? (
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
              768: { slidesPerView: 2.5 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
              1536: { slidesPerView: 5 },
              }}
              autoplay={false}
              speed={6000}
              loop={true}
              grabCursor={true}
            >
              {allProduct.map((item, idx) => {
                return (
                  <SwiperSlide key={idx}>
                    <Link
                      href={`/product/${item.name}/${item._id}`}
                      className="group flex-shrink-0 w-full  overflow-hidden"
                    >
<div className="relative w-full h-[300px] overflow-hidden group shadow-lg">
  <Image
    //  src={'/Images/2.webp'}
    src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.images?.[0]}`}
    alt={item.name || "Product image"}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    loading="lazy"
    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
  />
</div>
                               <div className="p-3 md:p-4 flex flex-col gap-2 bg-stone-50">
        <div className="flex flex-col gap-1 text-center sm:text-left">

          {/* PRODUCT NAME */}
          <div className="flex items-center justify-between gap-1 ">
            <h3 className="text-sm md:text-base font-medium text-slate-900 capitalize leading-tight break-words montserrat">
              {item.name.toLowerCase()}
            </h3>

            <button
                          onClick={(e)=>{
                                       e.preventDefault(),
                                       dispatch(
                                           !wishlist?.some((w) => w === item._id)
                                             ? addToWishlist(item._id)
                                             : removeFromWishlist(item._id),
                                         )} }
                         className="cursor-pointer"
                       >
                        
                          {wishlist?.some((w) => w === item._id) ? (
                                         <FaHeart className="w-6 h-6 text-red-500" />
                                       ) : (
                                         <Heart className="w-6 h-6 text-stone-700" />
                                       )} 
                       
                       </button>
          </div>
  <div className="  text-red-600 py-1.5  text-sm font-semibold w-fit flex items-center gap-1 ">
    🔥 {item._id.slice(-2).charCodeAt()+new Date(Date.now()).getDate()-30} bought in last 24 hours
  </div>
         
          <div className=" flex items-center justify-center sm:justify-start gap-1">
           {[...Array(5)].map((_, index) => {
                                                                  const starValue = index + 1;
                                                        
                                                                  if (item.rating >= starValue) {
                                                                    return <FaStar key={index} className="text-yellow-500" />;
                                                                  } else if (item.rating >= starValue - 0.5) {
                                                                    return <FaStarHalfAlt key={index} className="text-yellow-500" />;
                                                                  } else {
                                                                    return <FaRegStar key={index} className="text-yellow-500" />;
                                                                  }
                                                                })}

            <span className="text-xs text-slate-500 ml-1">({item.reviewCount || 0} reviews)</span>
          </div>



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
