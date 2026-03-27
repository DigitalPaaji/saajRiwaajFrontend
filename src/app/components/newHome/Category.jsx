'use client';
import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useGlobalContext } from "../context/GlobalContext";

export default function ShopByCategories() {
  const { categories } = useGlobalContext();

  // Helper function to format the URL (matches your Navbar logic)
  function formatCategoryPath(name) {
    return name.trim().toLowerCase().replace(/\s+/g, "-");
  }

  // Helper to format labels
  function formatCategoryLabel(name) {
    return name
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Static image mapping based on category names.
   * Matches your folder structure: /Images/category/...
   */
  const getCategoryImage = (categoryName) => {
    const name = categoryName.toLowerCase().trim();
    
    const staticImages = {
      "bangles": "/Images/category/bangles.webp",
      "earrings": "/Images/category/earrings.webp",
      "exclusive": "/Images/category/exclusive.webp",
      "neckwear": "/Images/category/neckwear.webp",
       
    };

    return staticImages[name] || "/Images/category/exclusive.webp"; // Fallback image
  };

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 lg:px-12 xl:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADING SECTION --- */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl  text-[#292927] mb-3 tracking-tight">
            Shop by Categories
          </h2>

        </div>

        {/* --- CATEGORY GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {categories.map((cat) => {
            const categoryPath = `/category/${formatCategoryPath(cat.name)}/${cat._id}`;
            const label = formatCategoryLabel(cat.name);
            const imageSrc = getCategoryImage(cat.name);
            
            return (
              <Link
                key={cat._id}
                href={categoryPath}
                className="group relative flex flex-col items-center overflow-hidden transition-all duration-500"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-stone-100 mb-4 rounded-sm">
                  <Image
                    src={imageSrc}
                    alt={label}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    priority={cat.name.toLowerCase() === 'earrings'} // Priority load for first items
                  />
                  
                  {/* Elegant Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* View Collection Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <span className="bg-white text-[#292927] px-6 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase shadow-2xl">
                      View Collection
                    </span>
                  </div>
                </div>

                {/* Text Content */}
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
          })}
        </div>

        {/* Empty State */}
        {(!categories || categories.length === 0) && (
          <div className="text-center py-20 text-stone-400 font-light tracking-widest">
            LOADING COLLECTIONS...
          </div>
        )}
      </div>
    </section>
  );
}