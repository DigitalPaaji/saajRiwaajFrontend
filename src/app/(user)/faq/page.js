"use client";
import React, { Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Banner from "../../components/user/InnerBanner";
import axios from "axios";
import Link from "next/link";

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-zinc-200 last:border-none">
      <button
        onClick={onClick}
        className="w-full py-7 flex justify-between items-center text-left transition-all duration-300"
      >
        <span className="text-sm md:text-base font-medium tracking-wide text-[#292927] uppercase">
          {question}
        </span>

        <div className="text-[#292927] ml-4">
          {isOpen ? <Minus size={18} strokeWidth={1.5} /> : <Plus size={18} strokeWidth={1.5} />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-8 text-zinc-600 text-sm leading-relaxed max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(false);

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
      console.error("Error fetching FAQ:", error);
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

      <section className="px-4 md:px-12 lg:px-24 xl:px-40 2xl:px-52 bg-white">
        <div className="max-w-7xl mx-auto py-12 md:py-16">

          {/* HEADING SECTION */}
          <div className="text-center mb-16">
            <h2 className="text-[16px] uppercase tracking-[0.2em] text-zinc-500 mb-3">
              The stuff everyone asks before their first order
            </h2>
            {/* <h3 className="text-3xl md:text-4xl font-serif text-[#292927]">
              Got Questions?
              <span className="italic"> We've Got Answers</span>
            </h3> */}
          </div>

          {/* FAQ ACCORDION */}
          <div className="mt-12 border-t border-zinc-200">
            {faqData?.map((faq, index) => (
              <AccordionItem
                key={index}
                question={faq.heading}
                answer={faq.des}
                isOpen={openIndex === index}
                onClick={() =>
                  setOpenIndex(openIndex === index ? -1 : index)
                }
              />
            ))}
          </div>

          {/* CALL TO ACTION */}
          <div className="mt-16 text-center">
            <p className="text-xs text-zinc-400 uppercase tracking-widest mb-4">
              Still have questions?
            </p>
            <Link
              href={"/contact"}
              className="text-[11px] uppercase tracking-widest font-semibold text-[#292927] border-b border-[#292927] pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-colors"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}