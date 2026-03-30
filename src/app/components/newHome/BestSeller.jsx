'use client';
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";
import { useGlobalContext } from "../context/GlobalContext";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function MostLovedFeatured() {
  const {
    categories,
    featuredProducts,
    refetchFeaturedProducts,
    addToCart,
  } = useGlobalContext();

  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  // ---------------------------------
  // Helpers
  // ---------------------------------
  const formatCategoryPath = (name) =>
    name.trim().toLowerCase().replace(/\s+/g, "-");

  const formatCategoryLabel = (name) =>
    name
      .trim()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  // ---------------------------------
  // Fetch Featured Products
  // ---------------------------------
  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      await refetchFeaturedProducts();
      setIsLoading(false);
    };
    fetch();
  }, [refetchFeaturedProducts]);

  // ---------------------------------
  // Add to Cart
  // ---------------------------------
  const handleAddToCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (addToCart) addToCart(item);
  };

  // ---------------------------------
  // Card Component
  // ---------------------------------
  const CardContent = ({ item }) => (
    <>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 ">
        <Image
          src={'/Images/3.webp'}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Desktop Add to Cart */}
        <div className="hidden lg:group-hover:flex absolute inset-0 transition-all duration-300 items-end justify-center p-4 z-20 bg-black/5">
          <button
            onClick={(e) => handleAddToCart(e, item)}
            className="montserrat w-full
              text-white group-hover:bg-white group-hover:text-black 
              text-black font-semibold py-2.5 text-xs font-bold rounded shadow-lg 
              transform translate-y-4 group-hover:-translate-y-1 
              transition-all duration-500 ease-out flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} />
            ADD TO CART
          </button>
        </div>

        {/* Mobile Add to Cart */}
        <div className="lg:hidden absolute bottom-2 right-2 z-20">
          <button
            onClick={(e) => handleAddToCart(e, item)}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md active:scale-90 transition-transform text-[#292927] border border-gray-100"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4 flex flex-col gap-2">
  <div className="flex flex-col gap-1 text-center sm:text-left">
    
    {/* PRODUCT NAME */}
    <h3 className="text-sm md:text-base font-medium text-slate-900 capitalize leading-tight break-words montserrat">
      {item.name.toLowerCase()}
    </h3>

    {/* ⭐ REVIEWS SECTION */}
    <div className="flex items-center justify-center sm:justify-start gap-1">
      {/* Stars */}
      {[1, 2, 3, 4].map((star) => (
        <FaStar key={star} size={12} className="text-yellow-500" />
      ))}
      <FaStarHalfAlt size={12} className="text-yellow-500" />

      {/* Review count */}
      <span className="text-xs text-slate-500 ml-1">
        (120 reviews)
      </span>
    </div>

    {/* PRICE SECTION */}
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

  // ---------------------------------
  // Filtered Products by Category
  // ---------------------------------
  const filteredProducts =
    activeCategory === "all"
      ? featuredProducts
      : featuredProducts.filter((p) => p.category_id === activeCategory);

  // ---------------------------------
  // Component Return
  // ---------------------------------
  return (
    <section className="py-12 md:py-20 px-4 md:px-6 lg:px-12 xl:px-24 relative overflow-hidden">
      
      {/* Decorative BG */}
      <div className="absolute -top-32 -right-12 opacity-5 pointer-events-none">
        <Image alt="" src="/Images/bg2.png" width={400} height={400} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Heading */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl text-[#292927] mb-4 tracking-tight montserrat font-light">
            Best Sellers
          </h2>
          <p className="text-stone-500 text-sm md:text-lg max-w-xl mx-auto font-light leading-relaxed montserrat">
            Our most popular pieces, chosen for their quality and everyday charm.
          </p>
        </div>

        {/* ----------------- TABS ----------------- */}
        <div className="flex flex-wrap gap-3 md:gap-4 justify-center my-8 pb-2 ">

          {/* ALL TAB */}
          <button
            className={`
              px-3 py-1 text-sm md:text-base font-medium border whitespace-nowrap
              ${activeCategory === "all"
                ? "bg-[#292927] text-white"
                : "text-[#292927]/80 hover:text-[#292927]"}
            `}
            onClick={() => setActiveCategory("all")}
          >
            All
          </button>

          {/* Dynamic Categories */}
          {categories?.map((cat) => {
            const label = formatCategoryLabel(cat.name);
            return (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={`
                  px-3 py-1 text-sm md:text-base border whitespace-nowrap
                  ${
                    activeCategory === cat._id
                      ? "bg-[#292927] text-white"
                      : "text-[#292927]/80 hover:text-[#292927]"
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* ----------------- PRODUCT GRID ----------------- */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="animate-pulse rounded-2xl bg-stone-100 aspect-[4/6]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-8">
            {filteredProducts.slice(0, 8).map((item) => (
              <Link
                key={item._id}
                href={`/product/${item.name.toLowerCase().replace(/\s+/g, '-')}/${item._id}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 shadow-2xl "
              >
                <CardContent item={item} />
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-stone-400 italic">
            No items found in this category.
          </div>
        )}
      </div>
    </section>
  );
}