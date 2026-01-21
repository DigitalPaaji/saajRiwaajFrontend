"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaRupeeSign } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Pagination from "./Pagination";

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
                  className="shadow-lg rounded-lg bg-gray-200 animate-pulse h-[400px]"
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
