"use client";

import { Suspense, useEffect, useState } from "react";
import Banner from "../../components/user/OtherBanner";
import axios from "axios";
import { base_url } from "@/app/components/store/utile";


 
export default function PrivacyPage() {
const [privacyData,setFaqData]=useState()
const [loading,setLoading]=useState(false)

 const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${base_url}/pages/get/privacy-policy`
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

      <Banner title="Privacy Policy" />
       </Suspense>

      <div className="px-4 sm:px-8 lg:px-24 xl:px-60 mx-auto my-16">
        { !loading && privacyData?.map((section, index) => (
          <div key={index} className="mb-10">
            {section.heading && (
              <h2 className="text-lg font-semibold mb-3">{section.heading}</h2>
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
