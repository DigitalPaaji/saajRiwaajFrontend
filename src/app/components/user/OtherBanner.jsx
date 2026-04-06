"use client";
import React from "react";
import Link from "next/link";


export default function HeroBanner({title}) {
  return (
    <section className="relative w-full">




      {/* TEXT BOX BELOW IMAGE */}
      <div className="relative z-10 py-3  lg:py-6 border-b border-gray-400/50 mt-4 text-center px-4 md:px-0">
        <h1 className="text-lg md:text-xl montserrat  text-[#292927] capitalize">
          {title}
        </h1>

        <div className=" md:mt-2 text-sm md:text-base text-gray-800 space-x-1">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="capitalize">{title}</span>

      
          
        </div>
      </div>
    </section>
  );
}