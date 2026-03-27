'use client';
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";
import { useGlobalContext } from "../context/GlobalContext";

export default function MostLovedFeatured() {
  const {
    featuredProducts,
    refetchFeaturedProducts,
    addToCart,
  } = useGlobalContext();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      await refetchFeaturedProducts();
      setIsLoading(false);
    };
    fetch();
  }, [refetchFeaturedProducts]);

  const handleAddToCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (addToCart) {
      addToCart(item);
    }
  };

  const CardContent = ({ item }) => (
    <>
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <Image
          src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.images?.[0]}`}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* DESKTOP: Add to Cart Overlay */}
        <div className="hidden lg:group-hover:flex absolute inset-0 transition-all duration-300 items-end justify-center p-4 z-20 bg-black/5">
          <button
            onClick={(e) => handleAddToCart(e, item)}
            className="montserrat w-full bg-white text-[#292927] border border-[#292927] 
                       hover:text-white hover:bg-[#292927]
                       py-2.5 text-xs font-bold rounded shadow-lg 
                       transform translate-y-4 group-hover:-translate-y-1 
                       transition-all duration-500 ease-out
                       flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} />
            ADD TO CART
          </button>
        </div>

        {/* MOBILE: Icon Only Button */}
        <div className="lg:hidden absolute bottom-2 right-2 z-20">
          <button
            onClick={(e) => handleAddToCart(e, item)}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md active:scale-90 transition-transform text-[#292927] border border-gray-100"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 md:p-4 bg-white flex flex-col gap-2">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h3 className="text-sm md:text-base font-medium text-slate-900 capitalize leading-tight break-words montserrat">
            {item.name.toLowerCase()}
          </h3>

          <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
            <span className="flex items-center text-[#8b5424] font-bold text-sm md:text-base">
              <FaRupeeSign size={12} className="md:w-3.5" />
              {Math.floor(item.finalPrice)}
            </span>
            {item.price > item.finalPrice && (
              <span className="flex items-center text-slate-400 text-xs line-through">
                <FaRupeeSign size={10} />
                {Math.floor(item.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <section className="py-12 md:py-20 px-4 md:px-6 lg:px-12 xl:px-24 relative overflow-hidden">
      {/* Optional Background Decorative Image */}
      <div className="absolute -top-32 -right-12 opacity-5 pointer-events-none">
        <Image alt="" src="/Images/bg2.png" width={400} height={400} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* --- HEADING SECTION --- */}
        <div className="max-w-4xl mx-auto text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl text-[#292927] mb-4 tracking-tight montserrat font-light">
        Best Sellers
          </h2>
          <p className="text-stone-500 text-sm md:text-lg max-w-xl mx-auto font-light leading-relaxed montserrat">
            Our most popular pieces, chosen for their quality and everyday charm.
          </p>
        </div>

        {/* --- GRID LAYOUT --- */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="animate-pulse rounded-lg bg-stone-100 aspect-[4/6]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6 md:gap-x-8 md:gap-y-10">
            {featuredProducts.slice(0, 8).map((item) => (
              <Link
                key={item._id}
                href={`/product/${item.name.toLowerCase().replace(/\s+/g, '-')}/${item._id}`}
                className="group relative flex flex-col overflow-hidden rounded-sm transition-all duration-300"
              >
                <CardContent item={item} />
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && featuredProducts.length === 0 && (
          <div className="text-center py-20 text-stone-400 italic">
            No featured items currently available.
          </div>
        )}
      </div>
    </section>
  );
}