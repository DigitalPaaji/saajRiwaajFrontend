"use client";
import { Tags, Copy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import axios from "axios";
import { base_url } from "../store/utile";

const deals = [
  {
    title: "First Order",
    desc: "Get 25% Discount on your purchase",
    note: "Automatically added in cart",
    code: "FIRST25",
  },
  {
    title: "Seasonal Discount",
    desc: "Get 25% Discount on your purchase",
    note: "Applied at checkout",
    code: "SEASON25",
  },
  {
    title: "Limited Time Deal",
    desc: "Get 25% Discount on your purchase",
    note: "Automatically added in cart",
    code: "LIMIT25",
  },
  {
    title: "Special Offer",
    desc: "Get 25% Discount on your purchase",
    note: "Added automatically",
    code: "SPECIAL25",
  },
];

function ProductDeals() {
  const [copiedIndex, setCopiedIndex] = useState(null);
 const [allCouponCode,setAllCouponCode]= useState([ ])

  const copyToClipboard = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);

    setTimeout(() => setCopiedIndex(null), 1500);
  };



  const fetchCouponCode= async()=>{
    try {
      const response = await axios.get(`${base_url}/coupon/all`);
      const data = await response.data;
setAllCouponCode(data.coupons)
    } catch (error) {
      setAllCouponCode([ ])
    }
  }


  useEffect(()=>{
    fetchCouponCode()
  },[])
  return (
    <Swiper
      modules={[Autoplay]}
      slidesPerView="auto"
      spaceBetween={14}
      grabCursor={true}
      loop={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      className="w-full"
    >
      { allCouponCode.length > 0 && allCouponCode?.map((item, index) => (
        <SwiperSlide key={index} className="!w-[300px]">
          <div className="p-3 bg-green-50/40 space-y-2 rounded border border-green-100">
            <div className="flex items-center gap-2">
              <Tags size={16} className="text-green-600" />
              <h3 className="text-green-600 font-semibold text-[15px]">
                {item.code}
              </h3>
            </div>

            <p className="text-gray-700 text-[14px] font-semibold">
             Get {item.discountPercent}% Discount on your purchase
            </p>

            <p className="text-gray-500 capitalize tracking-wide text-[13px]">
              {/* {item.note} */}
            </p>

            {/* Coupon Code + Copy */}
            <div className="flex items-center justify-between bg-white rounded border border-green-200 px-3 py-2 mt-2">
              <span className="text-green-700 font-semibold text-sm tracking-wider">
                {item.code}
              </span>

              <button
                onClick={() => copyToClipboard(item.code, index)}
                className="flex items-center gap-1 text-green-700 hover:text-green-900 transition text-sm"
              >
                <Copy size={14} />
                {copiedIndex === index ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default ProductDeals;