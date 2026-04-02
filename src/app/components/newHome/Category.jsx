'use client';
import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { useSelector } from 'react-redux';

export default function ShopByCategories() {

 const {data} = useSelector(state=>state.category.info);
  function formatCategoryPath(name) {
    return name.trim().toLowerCase().replace(/\s+/g, "-");
  }

  function formatCategoryLabel(name) {
    return name
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const getCategoryImage = (categoryName) => {
    const name = categoryName.toLowerCase().trim();
    const staticImages = {
      "bangles": "/Images/category/bangles.webp",
      "earrings": "/Images/category/earrings.webp",
      "exclusive": "/Images/category/exclusive.webp",
      "neckwear": "/Images/category/neckwear.webp",
    };
    return staticImages[name] || "/Images/category/exclusive.webp";
  };

  return (
    <section className="py-12 md:py-16 px-4 md:px-12 lg:px-24 xl:px-40 2xl:px-52 bg-white">
      <div className="">
        
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl text-[#292927] mb-3 tracking-tight">
            Shop by Categories
          </h2>
        </div>

        {/* --- CATEGORY GRID / SKELETON --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-8">
          {data && data.length > 0 ? (
            data.map((cat) => {
              const categoryPath = `/category/${formatCategoryPath(cat.category.name)}/${cat.category._id}`;
               const label = formatCategoryLabel(cat.category.name);
              const imageSrc = getCategoryImage(cat.category.name);
              
              return (
                <Link
                  key={cat?.category._id}
                  href={categoryPath}
                  className="group relative flex flex-col items-center overflow-hidden transition-all duration-500"
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-stone-100 mb-4 rounded-md">
                    <Image
                      src={imageSrc}
                      alt={label}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                      priority={cat.category.name.toLowerCase() === 'earrings'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <span className="bg-gradient-to-r from-[#bc861a] via-[#f1d981] to-[#bc861a]   text-[#292927]  px-6 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase shadow-2xl">
                        View Collection
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-[15px] font-medium text-[#292927] mb-1 montserrat uppercase tracking-widest">
                      {label}
                    </h3>
                    <div className="flex items-center justify-center text-[#B67032] text-[12px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0 uppercase tracking-tighter">
                      Explore <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            /* --- SKELETON LOADING STATE --- */
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center w-full">
                <div className="w-full aspect-[4/5] bg-gray-200 animate-pulse rounded-md mb-4" />
                <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded" />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}