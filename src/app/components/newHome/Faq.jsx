"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react"; // Or use standard SVG
import { useDispatch, useSelector } from "react-redux";
import { getFaqs } from "../store/faqSlice";
import Link from "next/link";
import Image from "next/image";

const FAQ_DATA = [
  {
    question: "How should I care for my jewelry?",
    answer: "To maintain the brilliance of your pieces, avoid contact with perfumes, lotions, and water. Store each piece separately in its original Saaj Riwaaj pouch to prevent scratching."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship our exclusive collections worldwide. Delivery times vary by region, typically ranging from 7 to 14 business days for international orders."
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns on non-customized pieces within 14 days of delivery. The item must be in its original, unworn condition with all security tags intact."
  },
  {
    question: "Are the gemstones ethically sourced?",
    answer: "Every gemstone in our collection is hand-selected and ethically sourced from certified partners, ensuring the highest standards of quality and social responsibility."
  }
];

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-zinc-100 last:border-none">
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
            <p className="pb-8 text-zinc-500 text-sm leading-relaxed max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0); 

const {faqs,isLoading} = useSelector(state=>state.faq)

const dispatch = useDispatch()

 useEffect(()=>{

    dispatch(getFaqs())
  },[])
  return (
    <>
        <div className=" relative z-10  pt-6 md:pt-8 lg:pt-12 px-4 md:px-12 lg:px-24 xl:px-40 2xl:px-52">
                <Image
                width={1080}
                height={700}
                  src="/Images/careImage.webp"
                  alt=""
                  className="w-full h-auto object-cover"
                />
              </div>

    <section className="px-4 md:px-12 lg:px-24 xl:px-40 2xl:px-52 bg-white">

      <div className="max-w-4xl mx-auto  py-12 md:py-16">
       
       
        <div className="text-center mb-4 lg:mb-16">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-3">
           The stuff everyone asks before their first order
          </h2>
          <h3 className="text-2xl md:text-4xl font-serif text-[#292927]">
           Got Questions? <span className="italic"> We've Got Answers</span>
          </h3>
        </div>

        <div className="mt-4 lg:mt-12 border-t border-zinc-100">
          {faqs?.slice(0,5).map((faq, index) => (
            <AccordionItem
              key={index}
              question={faq.heading}
              answer={faq.des}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-xs text-zinc-400 uppercase tracking-widest mb-4">
            Still have questions?
          </p>
          <Link href={'/contact'} className="text-[11px] uppercase tracking-widest font-semibold text-[#292927] border-b border-[#292927] pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-colors">
            Contact Concierge
          </Link>
        </div>
      </div>
    </section>
    </>

  );
}