"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { FaStar, FaStarHalfAlt,FaRegStar  } from "react-icons/fa";

export default function ReviewsSection({sampleReviews,reviewCount,rating}) {
   const totalStars = 5;



  return (
    <section className=" ">
      {reviewCount > 0  && 
      <div className="space-y-6 mb-10 py-6 px-4">
        <div>
          <h2 className="text-xl md:text-2xl montserrat font-semibold text-[#292927] capitalize">
            What Our Customers Say
          </h2>

         <div className="mt-2 flex items-center gap-2 text-[#292927]">
      <span className="text-xl">{rating.toFixed(1)}</span>

      <div className="flex gap-1">
        {[...Array(totalStars)].map((_, index) => {
          const starValue = index + 1;

          if (rating >= starValue) {
            return <FaStar key={index} className="text-yellow-500" />;
          } else if (rating >= starValue - 0.5) {
            return <FaStarHalfAlt key={index} className="text-yellow-500" />;
          } else {
            return <FaRegStar key={index} className="text-yellow-500" />;
          }
        })}
      </div>

      <span className="text-sm text-slate-500">
        ({reviewCount} reviews)
      </span>
    </div>
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
            loop
            className="mt-4 md:mt-0"
          >
            {sampleReviews.length > 0 && sampleReviews.map((r, index) => (
              <SwiperSlide key={index} className="!w-[260px] lg:!w-[300px]">
                <div className="bg-white rounded-xl shadow p-5 border border-stone-200">
                  <h3 className="font-semibold text-[#292927] text-sm capitalize">
                    {r.title}
                  </h3>

                  {/* RATING */}
                  <div className="flex items-center mt-2 mb-3">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <FaStar key={i} className="text-yellow-500 text-sm" />
                    ))}
                  </div>

                  {/* REVIEW TEXT */}
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
                    {r.review}
                  </p>

                  {/* USER INFO */}
                  <div className="mt-4 border-t pt-3 border-gray-600/40">
                    <p className="text-xs font-semibold text-[#292927] capitalize">
                      {r.name}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}


          </Swiper>
        </div>
      </div>}
    </section>
  );
}