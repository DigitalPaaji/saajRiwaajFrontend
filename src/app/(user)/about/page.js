"use client";

import { Suspense, useEffect, useState } from "react";
import Banner from "../../components/user/InnerBanner";
import axios from "axios";

// const returnsPolicyData = [
//   {
//     heading: "About Saajriwaaj",
//     para: `At Saajriwaaj, we believe jewellery is not just something you wear – it’s a feeling, a memory, and a way to express who you are.

// Saajriwaaj is created from a love for Indian culture and meaningful designs. We bring you a carefully chosen range of quality artificial jewellery that mixes classic Indian style with a fresh, today’s look. Every piece is made with thought and detail to help you feel confident, pretty, and yourself.

// Our designs are inspired by India’s rich jewellery traditions but made for the women who are stylish, and true to their personality. Whether it’s for a festival, or your everyday look, Saajriwaaj pieces are made to make you feel special.

// We focus on good-quality plating, neat finishing, and skin-friendly materials so that every piece is comfortable, long-lasting, and beautiful. Every order is packed with care, and we even share a packaging video for full honesty and trust.

// At Saajriwaaj, our goal is simple:
// To create jewellery that feels like you – meaningful, smart-looking, and made to be loved for years.

// Adorn yourself with beauty. Adorn yourself with Saajriwaaj.`,
//   },


// ];

export default function PrivacyPage() {

const [returnsPolicyData,setFaqData]=useState()
  const [loading,setLoading]=useState(false)
  
  
   const fetchPages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_LOCAL_PORT}/pages/get/about-us`
        );
        const data = await response.data;
        if (data.success) {
          setFaqData(data?.data?.contant || []);
        } else {
          setFaqData([]);
        }
      } catch (error) {
        console.error("Error fetching pages:", error);
        setFaqData([]);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(()=>{
      fetchPages()
    },[])

  return (
    <div>
      <Suspense fallback={null}>

      <Banner title="About Us" />
      </Suspense>

      <div className="px-4 sm:px-8 lg:px-24 xl:px-60 mx-auto my-16">
        {returnsPolicyData?.map((section, index) => (
          <div key={index} className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-[#111]">
              {section.heading}
            </h2>
            <p className="text-gray-700 leading-7 whitespace-pre-line">
              {section.des}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
