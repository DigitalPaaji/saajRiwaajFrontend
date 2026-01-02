"use client";

import { Suspense, useEffect, useState } from "react";
import Banner from "../../components/user/InnerBanner";
import axios from "axios";

// const privacyData = [
//   {
//     heading: "Order Processing",
//     para: `At Saajriwaaj, every order is packed with care, precision, and love — because your jewellery deserves to reach you as beautifully as it was crafted.

// All orders are carefully processed and packed within 1–3 business days after confirmation.

// Each parcel is securely sealed, and before dispatch, a short packaging video is recorded to ensure transparency and trust.`
//   },

//   {
//     heading: "Domestic Shipping (India)",
//     para: `• Estimated Delivery Time: 3–7 business days (depending on your location)
// • All domestic orders are shipped via trusted courier partners for safe and timely delivery.
// • Once your order is shipped, you will receive a tracking link via email or WhatsApp to follow your parcel's journey.`
//   },

//   {
//     heading: "International Shipping",
//     para: `• We offer worldwide delivery on all orders.
// • Estimated Delivery Time: 7–14 business days (depending on destination and customs processing).
// • International shipping rates are calculated at checkout.`
//   },

//   {
//     heading: "Packaging & Assurance",
//     para: `Every order is dispatched in our signature luxury box, perfect for gifting and safe storage.

// To ensure full transparency, a video of your packaged order will be shared before shipping.

// If you receive a damaged or defective piece, please provide an unboxing video from the moment of opening the parcel for review.

// After approval, a replacement or exchange will be arranged promptly.`
//   },

//   {
//     heading: "Delivery Support",
//     para: `For any delivery-related assistance, kindly contact our Client Care Team:

// Email: saajriwaaj22@gmail.com
// WhatsApp: wa.me/919988823422
// Call: +91 99888 23422
// Instagram: @saajriwaaj

// We are always here to ensure your Saajriwaaj experience is smooth, secure, and truly special.`
//   }
// ];

export default function PrivacyPage() {


   const [privacyData,setFaqData]=useState()
  const [loading,setLoading]=useState(false)
  
  
   const fetchPages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_LOCAL_PORT}/pages/get/delivery-information`
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

      <Banner title="Delivery Information" />
 </Suspense>


      <div className="px-4 sm:px-8 lg:px-24 xl:px-60 mx-auto my-16">
        {privacyData?.map((section, index) => (
          <div key={index} className="mb-10">
            {section.heading && (
              <h2 className="text-lg font-semibold mb-3 text-[#111]">
                {section.heading}
              </h2>
            )}
            <p className="text-gray-700 leading-7 whitespace-pre-line">
              {section.des}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
