"use client";

import { Suspense, useEffect, useState } from "react";
import Banner from "../../components/user/OtherBanner";
import axios from "axios";
import Image from "next/image";


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

      <Banner title="About Us"  />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 sm:px-8 lg:px-24 xl:px-60 mx-auto  my-6 md:my-10 lg:my-16">
        <div className="hidden lg:block">
          <Image alt=""  src={'/Images/admin1.webp'} width={400} height={400} className="w-full h-auto object-cover"/>
        </div>
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