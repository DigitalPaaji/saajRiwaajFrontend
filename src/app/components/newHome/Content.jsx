"use client";
import { motion } from "framer-motion";

export default function OurStory() {
  return (
    <section className="px-5 md:px-10 lg:px-20 xl:px-32 py-16 md:py-24 bg-gray-100">
      <div className="max-w-5xl mx-auto text-center">
        
        {/* Small Subheading */}
        <motion.h4
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-3"
        >
          Our Story
        </motion.h4>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-serif text-[#292927] mb-8"
        >
          Born From a <span className="italic">Simple Belief</span>
        </motion.h2>

        {/* Paragraphs */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-[15px] md:text-[16px] leading-relaxed text-zinc-600 max-w-3xl mx-auto"
        >
          We started SaajRiwaaj because we were tired of choosing between
          <span className="font-medium text-zinc-800"> “looks good” </span>
          and
          <span className="font-medium text-zinc-800"> “costs too much.” </span>
          Why should stunning jewellery cost a month's salary?
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-[15px] md:text-[16px] leading-relaxed text-zinc-600 max-w-3xl mx-auto mt-4"
        >
          Every piece is designed in-house, handcrafted by artisans who've been
          perfecting their craft for generations. We source materials that are
          skin-safe, anti-tarnish, and built to last — not built to break after
          one wedding.
        </motion.p>

        {/* Meaning Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 text-[15px] md:text-[16px] text-zinc-700"
        >
          <p className="font-serif text-[#292927] italic">
            “Saaj” means adornment. “Riwaaj” means tradition.
          </p>
          <p className="mt-2 text-zinc-600">
            Together, we're making beautiful traditions accessible to every woman.
          </p>
        </motion.div>
      </div>
    </section>
  );
}