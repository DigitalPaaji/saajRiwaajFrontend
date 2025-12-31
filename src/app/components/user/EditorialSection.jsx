"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGlobalContext } from "../context/GlobalContext";
import { getOptimizedImage } from "../utils/cloudinary";

export default function EditorialSection() {
    const {  offers } = useGlobalContext();
  




  return (
    <section className=" ">
     
   <div className="flex flex-wrap gap-6 justify-center  px-4 sm:px-6 lg:px-8">
  {offers.map((item) => (
    <div
      key={item._id}
      className="relative w-full sm:w-[48%]  my-20 lg:w-[31%] h-96 rounded-xl overflow-hidden group"
    >
<img
  src={getOptimizedImage(item.image, { maxWidth: 800 })}
  loading="eager"
fetchPriority="high"
  alt={item.title}
  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
/>


      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>

      <div className="absolute bottom-0 left-0 p-6 text-white z-20">
        <h3 className="text-2xl lg:text-3xl font-serif mb-1">{item.title}</h3>

        <Link
          href={`/offer/${item.slug}/${item._id}`}
          className="font-semibold text-sm flex items-center group-hover:underline"
        >
          Shop Now{" "}
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  ))}
</div>

    
    </section>
  );
}
