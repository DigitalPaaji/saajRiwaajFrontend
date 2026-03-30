"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Box, Layers, Sparkles } from "lucide-react";
import Image from "next/image";

export default function DealsSection() {
  const [offers, setOffers] = useState([]);

  const fetchOffers = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/offer`);
      const data = await res.json();
      setOffers(data);
    } catch (err) {
      console.error("Error fetching offers:", err);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return (
    <section className=" py-12 md:py-16 px-4 md:px-6 lg:px-12 xl:px-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Minimalist & Bold */}
        <div className="mb-16 text-center">
          <h2 className="text-2xl md:text-4xl  text-[#292927] mb-3 tracking-tight">
            Curated Bundles & Sets
          </h2>
          <p className="text-zinc-500 uppercase tracking-[0.4em] text-[10px] md:text-xs">
            Hand-picked combinations. Automatic savings. Limited availability.
          </p>
        </div>

  {/* Bundle Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
  {offers.map((item, index) => (
    <Link
      key={item._id}
      href={`/offer/${item.slug}/${item._id}`}
      className="group relative aspect-square w-full overflow-hidden bg-stone-100 rounded-2xl flex flex-col justify-end"
    >
      {/* Background Image - Use your sample images here */}
      <div className="absolute inset-0 z-0">
        <Image
             src={'/Images/3.webp'}
         // src={`/Image/${(index % 5) + 1}.webp`} 
          alt={item.title}
          fill
          className="object-cover"
        />
        {/* Elegant Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      </div>



      {/* Content Area */}
      <div className="relative z-10 p-8 transform transition-all duration-500 translate-y-4 group-hover:translate-y-0">
        <div className="space-y-4">
       
          
          <h3 className="text-3xl font-light text-white leading-tight italic capitalize font-serif">
            {item.title}
          </h3>

    
          <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-4">
            <span className="text-white font-semibold text-[10px] tracking-[0.4em] uppercase">
              Explore Bundle
            </span>
            <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-500">
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  ))}
</div>

        {/* Bottom Tagline */}
        <div className="mt-20 text-center">
          <p className="text-[11px] text-zinc-400 uppercase tracking-[0.5em]">
            Tradition meets contemporary value
          </p>
        </div>
      </div>
    </section>
  );
}