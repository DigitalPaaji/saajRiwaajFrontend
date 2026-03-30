"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { IoSearch } from "react-icons/io5";
import { getOptimizedImage } from "../utils/cloudinary";
import Image from "next/image";
import axios from "axios";

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [placeholder, setPlaceholder] = useState("Search products names...");
  const modalRef = useRef(null);




const fetchSearch = async(text)=>{
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/product/search/${text}`)
    const data = await response.json();

    if(data.success){
    setFiltered(data.data)  
    }
  } catch (error) {
    
  }
}


 useEffect(() => {
  if (query.trim().length < 2) return;

  const handler = setTimeout(() => {
    fetchSearch(query);
  }, 300);

  return () => clearTimeout(handler);
}, [query]);




  
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
    <div className="absolute top-full left-0 w-full bg-white text-[#292927] shadow-lg animate-[fadeIn_0.3s_ease-out] z-50 ">
      <div
        ref={modalRef}
        className="w-full overflow-hidden md:max-w-screen-2xl mx-auto px-4 md:px-8 py-6 relative"
      >
        <div className="mb-4 flex items-center justify-center gap-2 mx-2  relative">
          <input
            type="text"
            placeholder={`${placeholder}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full border border-black/20 px-4 py-2 rounded-md focus:outline-none text-base"
          />
          <IoSearch  className="absolute right-14 text-xl" />
          <button
            onClick={onClose}
            className="p-2 rounded-full  hover:bg-stone-200 transition transform hover:rotate-90"
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
      className="flex-shrink-0 sm:w-40 lg:w-60 group flex flex-col items-center overflow-hidden hover:shadow-md transition-shadow"
    >
<div className="relative w-full h-40 lg:h-60 overflow-hidden group">
  <Image
    src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.images?.[0]}`}
    alt={item.name || "Product image"}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
    loading="lazy"
    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
  />
</div>
          <div className="flex items-start justify-start py-4 px-2">
            <h3 className="montserrat  font-medium text-stone-700 group-hover:text-[#B67032] transition-colors duration-300 capitalize">
        {item.name
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase())}
      </h3>
                              {/* <h3 className="font-semibold  text-md text-[#B67032] transition-colors duration-300 flex items-center ">
                                                              <span className="line-through mr-4 flex items-center">
                                                                <FaRupeeSign size={14} />
                                                                {Math.floor(item.price)}
                                                              </span>
                                                              <FaRupeeSign size={14} />
                                                              {Math.floor(item.finalPrice)}
                                </h3> */}
                     
                     </div>
    </Link>
  ))}
</div>

      </div>
    </div>
  );
}
