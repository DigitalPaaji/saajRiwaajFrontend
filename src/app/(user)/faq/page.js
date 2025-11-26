"use client";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Banner from "../../components/user/InnerBanner";

function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

const faqData = [
  {
    question: "What materials are used in Saajriwaaj jewellery?",
    answer:
      "Each Saajriwaaj piece is crafted using premium-quality alloys, brass, and copper bases, finished with high-grade gold, rose gold, or rhodium plating. We use fine-cut crystals, cubic zirconia, and imitation pearls, chosen for their brilliance and durability.",
  },
  {
    question: "Are Saajriwaaj pieces hypoallergenic?",
    answer:
      "Yes. All Saajriwaaj jewellery is made with nickel-free, skin-safe materials, ensuring comfort and elegance for everyday wear.",
  },
  {
    question: "How should I care for my Saajriwaaj jewellery?",
    answer:
      "To keep your jewellery shining like new:\n- Avoid contact with water, perfume, or harsh chemicals.\n- Wipe gently with a soft, dry cloth after each use.\n- Store pieces in the original Saajriwaaj box or a soft pouch to prevent scratches and tarnishing.\nProper care helps your jewellery retain its polish and finish for years.",
  },
  {
    question: "What is Saajriwaaj's return or exchange policy?",
    answer:
      "We accept returns or exchanges within 7 days of delivery for unworn items in their original packaging. A full unboxing video is required for damaged or defective items. Earrings, sale items, and customized jewellery are non-returnable. We also provide a packaging video before dispatch for transparency.",
  },
  {
    question: "Does Saajriwaaj jewellery come with a warranty?",
    answer:
      "Yes, all Saajriwaaj pieces include a 6-month warranty covering manufacturing defects. This does not include issues caused by mishandling, water exposure, or perfume contact.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are dispatched within 1-3 business days.\nDomestic (India): 3-7 business days.\nInternational: 7-14 business days.\nTracking details will be shared via email or WhatsApp after shipping.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes! Saajriwaaj proudly offers worldwide shipping. International rates and delivery times vary based on your location.",
  },
  {
    question: "Is Saajriwaaj packaging gift-ready?",
    answer:
      "Absolutely. Every order arrives in our signature luxury box, perfect for gifting. You can also add a personalized note at checkout.",
  },
  {
    question: "How can I contact Saajriwaaj for queries or assistance?",
    answer:
      "Email: saajriwaaj22@gmail.com\nWhatsApp: wa.me/919988823422\nCall: +91 99888 23422\nInstagram: @saajriwaaj\nOur customer care team is always ready to help with any queries.",
  },
  {
    question: "How long does the polish last?",
    answer:
      "With proper care, Saajriwaaj jewellery retains its finish for 1–2 years. Keep it dry, avoid perfume, and store it safely after each use.",
  },
];


  return (
    <div>
   
      <Banner title="Frequently Asked Questions" />

    
      <div className="px-4 sm:px-8 lg:px-24 xl:px-60 mx-auto my-16">
        <div className="space-y-6">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-[#d4af37]/40 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <button
                onClick={() => toggleDropdown(index)}
                className="w-full flex justify-between items-center text-left py-4 px-6 font-semibold text-lg text-gray-800"
              >
                <span>{faq.question}</span>
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
                  {faq.answer}
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
