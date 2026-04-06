"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);

  // 🔥 SAMPLE REVIEWS (fallback)
  const sampleReviews = [
    {
      name: "Simran",
      email: "simran@example.com",
      title: "Amazing Quality!",
      rating: 5,
      review:
        "Loved the finish and craftsmanship. Delivery was super fast as well!",
    },
    {
      name: "Rahul",
      email: "rahul@example.com",
      title: "Highly Recommended",
      rating: 4,
      review:
        "The jewellery looks even better in real life. Totally worth it!",
    },
    {
      name: "Ayesha",
      email: "ayesha@example.com",
      title: "Beautiful & Elegant",
      rating: 5,
      review:
        "I bought this for my sister and she absolutely loved it. Stunning design!",
    },
  ];

  // ⭐ FETCH REVIEWS FROM BACKEND (auto fallback to sample)
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_PORT}/api/reviews`
        );
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        } else {
          setReviews(sampleReviews);
        }
      } catch (error) {
        console.log("Failed to fetch reviews → Using sample reviews.");
        setReviews(sampleReviews); // fallback
      }
    }

    fetchReviews();
  }, []);

  return (
    <section className="py-6 px-4">
      {/* TOP HEADING */}
      <div className="space-y-6 mb-10">
        <div>
          <h2 className="text-xl md:text-2xl montserrat font-semibold text-[#292927] capitalize">
            What Our Customers Say
          </h2>

          <div className="mt-2 flex items-center gap-2 text-[#292927]">
            <span className="text-xl">4.8</span>
            <div className="flex gap-1">
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStarHalfAlt className="text-yellow-500" />
            </div>
            <span className="text-sm text-slate-500">(312 reviews)</span>
          </div>
        </div>

        {/* REVIEWS SWIPER */}
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
            {reviews.map((r, index) => (
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
                    <p className="text-[11px] text-slate-500">{r.email}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}