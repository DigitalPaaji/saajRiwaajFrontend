"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Box, Layers, Sparkles } from "lucide-react";
import Image from "next/image";

export default function ProductDeal() {
  const [offers, setOffers] = useState([]);

  const fetchOffers = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/offer`);
      const data = await res.json();
      setOffers(data.filter((item) => item.showonpage));
    } catch (err) {
      console.error("Error fetching offers:", err);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return (
    <>
      {offers.length > 0 && (
        <section className="py-12 md:py-16 px-4 md:px-12 lg:px-24 xl:px-40 2xl:px-52">
          <div className="">
            {/* Header - Minimalist & Bold */}
            <div className="mb-4 text-center">
             
              <p className="text-md font-mosetta font-semibold text-[#292927] tracking-wide">
                Ongoing Offers
              </p>
            </div>

            {/* Bundle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
              {offers.map((item, index) => (
                <Link
                  key={item._id}
                  href={`/offer/${item.slug}/${item._id}`}
                  className="group relative w-full overflow-hidden bg-green-50 rounded-md flex flex-col justify-end"
                >
           

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


          </div>

        </section>
      )}
    </>
  );
}
