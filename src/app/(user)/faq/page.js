"use client";
import React, { Suspense, useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Banner from "../../components/user/InnerBanner";
import axios from "axios";

function Faq() {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqData,setFaqData]=useState()
const [loading,setLoading]=useState(false)
  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

 const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/pages/get/faq`
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

      <Banner title="Frequently Asked Questions" />
    </Suspense>

    
      <div className="px-4 sm:px-8 lg:px-24 xl:px-60 mx-auto my-16">
        <div className="space-y-6">
          {faqData?.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-[#d4af37]/40 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <button
                onClick={() => toggleDropdown(index)}
                className="w-full flex justify-between items-center text-left py-4 px-6 font-semibold text-lg text-gray-800"
              >
                <span>{faq.heading}</span>
                {openIndex === index ? (
                  <FaChevronUp className="text-[#df9555]" />
                ) : (
                  <FaChevronDown className="text-[#B67032]" />
                )}
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 text-gray-700 leading-7 border-t border-gray-100">
                  {faq.des}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Faq;
