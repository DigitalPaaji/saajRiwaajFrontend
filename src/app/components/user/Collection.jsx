"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaRupeeSign } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Pagination from "./Pagination";
import { FiShoppingBag } from 'react-icons/fi';
export default function Collection({
 product,pages,loading,fetchProducts
}) {
  
const route = useRouter()

 
  

  const skeletons = Array.from({ length: 6 });






const onPageChange = (pageNumber) => {
  fetchProducts(
    { page: pageNumber },
    { resetPage: false }
  );
};






  return (
    <section>
      <div className=" col-span-1 xl:col-span-8 flex flex-col justify-center">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading
            ? skeletons.map((_, idx) => (
                <div
                  key={idx}
                  className="shadow-lg rounded-lg bg-gray-200 animate-pulse h-[200px] "
                ></div>
              ))
            : product?.map((product, index) => (
                <Link
                  href={`/product/${product.name}/${product._id}`}
                  key={product._id}
                  className="group block border border-stone-200 p-4 "
                >
                  <div
                    className="group relative aspect-square overflow-hidden hover:shadow-xl transition-all duration-300"
                 
                  >
  <div className="relative w-full h-full overflow-hidden group">
  <Image
    src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${product.images?.[0]}`}
    alt={product.name || "Product image"}
    fill
    className="object-cover transition-transform duration-500 group-hover:scale-105"
    sizes="100vw"
    loading="lazy"
  />
</div>

              
                 
                  </div>

                  <div className="flex items-center justify-between flex-wrap mt-4 px-1">
           
                    <h3 className="font-semibold md:text-md text-gray-700 group-hover:text-[#B67032] transition-colors duration-300 truncate max-w-[60%]">
                      {product.name}
                    </h3>
                    <h3 className="flex items-center md:text-md font-semibold text-[#B67032] transition-colors duration-300">
                      <span className="line-through mr-3 flex items-center text-gray-700 text-sm">
                        <FaRupeeSign size={14} />
                        {Math.floor(product.price)}
                      </span>
                      <FaRupeeSign size={16} /> {Math.floor(product.finalPrice)}
                    </h3>
                  </div>
               
                </Link>
              ))}

{(!product || product.length === 0) && (
  <div className="flex flex-col items-center justify-center py-24 px-6 text-center border border-dashed border-gray-300 rounded-2xl bg-gray-50/50 my-12 max-w-3xl mx-auto transition-all duration-500">
    
    {/* Icon Container */}
    <div className="bg-white p-6 rounded-full shadow-sm mb-6 border border-gray-100">
      <FiShoppingBag size={40} className="text-gray-300" strokeWidth={1} />
    </div>
    
    {/* Heading */}
    <h3 className="text-2xl md:text-3xl font-light text-gray-800 mb-4 tracking-wide">
      Currently Unavailable
    </h3>
    
    {/* Subtext */}
    <p className="text-gray-500 max-w-md mx-auto mb-10 text-sm leading-relaxed">
      It looks like we don't have any products matching your current selection. Try adjusting your filters or explore our other collections.
    </p>
    
  <Link href={"/"}>
  Go Home
  </Link>
  </div>
)}


        </div>
        <Pagination page={pages?.page} pages={pages?.pages} onPageChange={onPageChange} />
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
