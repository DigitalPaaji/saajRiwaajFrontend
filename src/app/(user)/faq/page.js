"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";
import Banner from "../../components/user/InnerBanner";
import axios from "axios";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/pages/get/faq`
      );

      const data = response.data;
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

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <div>
      <Suspense fallback={null}>
        <Banner title="Frequently Asked Questions" />
      </Suspense>

      {/* MAIN FAQ SECTION */}
      <section className="px-4 md:px-6 lg:px-12 xl:px-24 bg-white">
        <div className="max-w-6xl mx-auto py-12 md:py-16">
          
          {/* TOP HEADING */}
          <div className="text-center mb-16">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-3">
              The stuff everyone asks before their first order
            </h2>

            <h3 className="text-3xl md:text-4xl font-serif text-[#292927]">
              Got Questions? <span className="italic">We've Got Answers</span>
            </h3>
          </div>

          {/* ACCORDION CONTAINER */}
          <div className="mt-10 border-t border-zinc-100">
            {faqData?.map((faq, index) => (
              <div
                key={index}
                className="border-b border-zinc-100 last:border-none"
              >
                {/* Accordion Button */}
                <button
                  onClick={() => toggleDropdown(index)}
                  className="w-full py-7 flex justify-between items-center text-left transition-all duration-300"
                >
                  <span className="text-sm md:text-base font-medium tracking-wide text-[#292927] uppercase">
                    {faq.heading}
                  </span>

                  <div className="text-[#292927] ml-4">
                    {openIndex === index ? (
                      <Minus size={18} strokeWidth={1.5} />
                    ) : (
                      <Plus size={18} strokeWidth={1.5} />
                    )}
                  </div>
                </button>

                {/* Dropdown Content */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-out ${
                    openIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="pb-8 text-zinc-500 text-sm leading-relaxed max-w-3xl">
                    {faq.des}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CONTACT CTA */}
          <div className="mt-16 text-center">
            <p className="text-xs text-zinc-400 uppercase tracking-widest mb-4">
              Still have questions?
            </p>
            <button className="text-[11px] uppercase tracking-widest font-semibold text-[#292927] border-b border-[#292927] pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-colors">
              Contact Concierge
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
// "use client";
// import React, { Suspense, useEffect, useState } from "react";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import Banner from "../../components/user/InnerBanner";
// import axios from "axios";

// function Faq() {
//   const [openIndex, setOpenIndex] = useState(null);
//   const [faqData,setFaqData]=useState()
// const [loading,setLoading]=useState(false)
//   const toggleDropdown = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//  const fetchPages = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_LOCAL_PORT}/pages/get/faq`
//       );
//       const data = await response.data;
//       if (data.success) {
//         setFaqData(data?.data?.contant || []);
//       } else {
//         setFaqData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching pages:", error);
//       setFaqData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(()=>{
//     fetchPages()
//   },[])
  
//   return (
//     <div>
//     <Suspense fallback={null}>

//       <Banner title="Frequently Asked Questions" />
//     </Suspense>

    
//       <div className="px-4 sm:px-8 lg:px-24 xl:px-60 mx-auto my-16">
//         <div className="space-y-6">
//           {faqData?.map((faq, index) => (
//             <div
//               key={index}
//               className="rounded-xl border border-[#d4af37]/40 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
//             >
//               <button
//                 onClick={() => toggleDropdown(index)}
//                 className="w-full flex justify-between items-center text-left py-4 px-6 font-semibold text-lg text-gray-800"
//               >
//                 <span>{faq.heading}</span>
//                 {openIndex === index ? (
//                   <FaChevronUp className="text-[#df9555]" />
//                 ) : (
//                   <FaChevronDown className="text-[#B67032]" />
//                 )}
//               </button>
//               <div
//                 className={`overflow-hidden transition-all duration-500 ease-in-out ${
//                   openIndex === index
//                     ? "max-h-96 opacity-100"
//                     : "max-h-0 opacity-0"
//                 }`}
//               >
//                 <div className="px-6 pb-6 text-gray-700 leading-7 border-t border-gray-100">
//                   {faq.des}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Faq;
