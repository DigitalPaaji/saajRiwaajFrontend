"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaRupeeSign } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Pagination from "./Pagination";
import { FiShoppingBag } from 'react-icons/fi';
import { ShoppingBag } from "lucide-react";
export default function Collection({
 product,pages,loading,fetchProducts
}) {
  
const router = useRouter()


  

  const skeletons = Array.from({ length: 6 });






const onPageChange = (pageNumber) => {
  fetchProducts(
    { page: pageNumber },
    { resetPage: false }
  );
};




const handleClear = () => {
 router.push("?")

  };

  return (
    <section>
      <div className=" col-span-1 xl:col-span-8 flex flex-col justify-center ">
<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
{loading
            && skeletons.map((_, idx) => (
                <div
                  key={idx}
                  className="shadow-lg rounded-lg bg-gray-200 animate-pulse h-[200px] "
                ></div>
              ))}

</div>
        <div className="">
          { !loading &&  (!product || product.length === 0)
            ? <div className="flex items-center justify-center  p-6 ">
      <div className="text-center max-w-md">
        
     
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 flex items-center justify-center rounded-full ">
            {/* <ShoppingBag className="w-12 h-12 text-gray-600" /> */}
            <img src="/Images/shopping.png" alt="" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          No Products Found
        </h2>

        {/* Description */}
        <p className="text-gray-500 mb-6">
          We couldn&apos;t find any items matching your filters.  
          Try adjusting your search or explore all products.
        </p>

  
        <button
        onClick={handleClear}
          className="inline-block px-6 py-3 rounded-lg border  border-black font-medium "
        >
          Browse All Products
        </button>

      </div>
    </div>
            :
            
            
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">  
          {  product?.map((product, index) => (
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
              ))
            } 
            </div>  
              }




        </div>
   {product.length > 0 &&     <Pagination page={pages?.page} pages={pages?.pages} onPageChange={onPageChange} />
      
            }</div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
