"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { IoSearch } from "react-icons/io5";
import { getOptimizedImage } from "../utils/cloudinary";
import Image from "next/image";

export default function SearchBar({ products, onClose }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [placeholder, setPlaceholder] = useState("Search products...");
  const modalRef = useRef(null);

  // Debounce search results
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim() === "") {
          
                const randomProducts = [...products]
          .sort(() => 0.5 - Math.random())
          .slice(0, 10);
        setFiltered(randomProducts);
      } else {
      
        const matches = products.filter((p) =>
          p.name?.toLowerCase().includes(query.toLowerCase()) || p.category?.name?.toLowerCase().includes(query.toLowerCase())
        );

        if (matches.length > 0) {
          setFiltered(matches);
        } else {
          
          setFiltered([]);
        }
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query, products]);

 
  useEffect(() => {
    if (!products?.length) return;
    let idx = 0;
    const interval = setInterval(() => {
      setPlaceholder(products[idx % products.length]?.name || "Search...");
      idx++;
    }, 3000);
    return () => clearInterval(interval);
  }, [products]);

  
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="absolute top-full left-0 w-full bg-[#faf8ea] shadow-lg border-t animate-[fadeIn_0.3s_ease-out] z-50 ">
      <div
        ref={modalRef}
        className="w-full overflow-hidden md:max-w-screen-2xl mx-auto px-4 md:px-8 py-6 relative"
      >
        <div className="mb-4 flex items-center justify-center gap-2 mx-2  relative">
          <input
            type="text"
            placeholder={`Search for '${placeholder}'`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full border px-4 py-2 rounded-md focus:outline-none text-base"
          />
          <IoSearch  className="absolute right-14 text-xl" />
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200 transition transform hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 mx-auto w-fit overflow-hidden pb-2">
  {(query.trim() === "" 
    ? filtered.slice(
        0,
        typeof window !== "undefined"
          ? window.innerWidth >= 1280
            ? 6
            : window.innerWidth >= 768
            ? 4
            : 2
          : 6
      )
    : filtered
  ).map((item) => (
    <Link
      key={item._id}
      href={`/product/${item.name
        ?.toLowerCase()
        .replace(/\s+/g, "-")}/${item._id}`}
      onClick={onClose}
      className="flex-shrink-0 sm:w-40 lg:w-60 group flex flex-col items-center bg-stone-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
<div className="w-full relative h-40 lg:h-60 overflow-hidden">
  <Image
    src={getOptimizedImage(item.images?.[0], { maxWidth: 600 })}
    alt={item.name || "Product image"}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
    loading="lazy"
    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
  />
</div>
      <div className="p-2 flex-1">
        <h4 className="font-semibold text-stone-800 text-base group-hover:text-[#B67032] transition-colors">
          {item.name}
        </h4>
        {item.description?.paragraphs?.[0] && (
          <p className="text-base text-stone-600">
            {item.description.paragraphs[0]
              .split(" ")
              .slice(0, 10)
              .join(" ")}
            ...
          </p>
        )}
      </div>
    </Link>
  ))}
</div>

      </div>
    </div>
  );
}
