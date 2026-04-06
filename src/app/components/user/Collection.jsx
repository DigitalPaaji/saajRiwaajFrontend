"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaRupeeSign, FaStarHalfAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Pagination from "./Pagination";
import { FiShoppingBag } from "react-icons/fi";
import { ShoppingBag } from "lucide-react";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { base_url } from "../store/utile";
import {  useDispatch, useSelector } from "react-redux";
import { addTocart, addTocartUser } from "../store/cartSlice";
import { addSlide } from "../store/sliderSlice";
import axios from "axios";
import { toast } from "react-toastify";
export default function Collection({ product, pages, loading, fetchProducts }) {
       const { user } = useSelector(state=>state.user)
const dispatch  = useDispatch()
  const router = useRouter();  

  const skeletons = Array.from({ length: 8 });

  const onPageChange = (pageNumber) => {
    fetchProducts({ page: pageNumber }, { resetPage: false });
  };

  const handleClear = () => {
    router.push("?");
  };
  const handleAddToCart = async(product) => {
  try {

    if(user){

try {
  const response = await axios.post(`${base_url}/cart/post`,{
    productid:product._id, quantity:1, price:product.finalPrice,color:product.colorVariants[0]?._id
  })
  const data = await response.data;
if(data.success){
dispatch(addTocartUser(data.cart))
  
}
} catch (error) {
toast.error(error.response.data.message)  
}



    }
    else{
          console.log(product,"proooo")
      dispatch(addTocart({product:product._id,quantity:1,price:product.finalPrice,color:product.colorVariants[0]?._id}))
    }
  } catch (error) {
  toast.error(error?.response?.data?.message)
  }finally{
    dispatch(addSlide("cart"))
  }
  };

  return (
    <section>
      <div className=" col-span-1 xl:col-span-8 flex flex-col justify-center px-4 ">
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-8">
          {loading &&
            skeletons.map((_, idx) => (
              <div
                key={idx}
                className="shadow-lg rounded-lg bg-gray-200 animate-pulse h-[200px] "
              ></div>
            ))}
        </div>
        <div className="">
          {!loading && (!product || product.length === 0) ? (
            <div className="flex items-center justify-center  p-6 ">
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
                  We couldn&apos;t find any items matching your filters. Try
                  adjusting your search or explore all products.
                </p>

                <button
                  onClick={handleClear}
                  className="inline-block px-6 py-3 rounded-lg border  border-black font-medium "
                >
                  Browse All Products
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-8">
              {product?.map((product, index) => (
                <Link
                  href={`/product/${product.name}/${product._id}`}
                  key={product._id}
                  className="group block border border-stone-200 p-4 "
                >
                  <div className="group relative aspect-[4/5] overflow-hidden ">
                    <div className="relative w-full h-full overflow-hidden group">
                      <Image
                      //  src={'/Images/1.webp'}
                        src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${product.images?.[0]}`}
                        alt={" "}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="100vw"
                        loading="lazy"
                      />
                            
        {/* Desktop Add to Cart */}
        <div className="hidden lg:group-hover:flex absolute inset-0 transition-all duration-300 items-end justify-center p-4 z-20 ">
          <button
            onClick={(e) =>{ e.preventDefault() ,handleAddToCart(product)}}
className="montserrat w-full bg-gradient-to-r from-[#bc861a] via-[#f1d981] to-[#bc861a] text-[#292927] font-semibold py-2.5 text-xs rounded shadow-lg  transform translate-y-4 group-hover:-translate-y-1 transition-all duration-500 ease-out flex items-center justify-center gap-2"          >
            <ShoppingBag size={16} />
            ADD TO CART
          </button>
        </div>

        {/* Mobile Add to Cart */}
        <div className="lg:hidden absolute bottom-2 right-2 z-20">
          <button
            onClick={(e) => {e.preventDefault() ,handleAddToCart(product)}}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md active:scale-90 transition-transform text-[#292927] border border-gray-100"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
                    </div>
                  </div>

                  <div className=" mt-4 space-y-1">
                    <h3 className="w-full montserrat capitalize font-semibold text-base lg:text-md text-gray-700 group-hover:text-[#292927] transition-colors duration-300 ">
                      {product.name
                        .toLowerCase()
                        .replace(/\b\w/g, (char) => char.toUpperCase())
                        .toLowerCase()}
                    </h3>
                    {/* ⭐ REVIEWS SECTION */}
                    <div className="flex items-center justify-center sm:justify-start gap-1">
                      {/* Stars */}
                     {[...Array(5)].map((_, index) => {
                                                       const starValue = index + 1;
                                             
                                                       if (product.rating >= starValue) {
                                                         return <FaStar key={index} className="text-yellow-500" />;
                                                       } else if (product.rating >= starValue - 0.5) {
                                                         return <FaStarHalfAlt key={index} className="text-yellow-500" />;
                                                       } else {
                                                         return <FaRegStar key={index} className="text-yellow-500" />;
                                                       }
                                                     })}
                     

                      {/* Review count */}
                      <span className="text-xs text-slate-500 ml-1">
                        ({product.reviewCount} reviews)
                      </span>
                    </div>
                    <h3 className="flex items-center md:text-md font-semibold text-[#292927] transition-colors duration-300">
                      <span className="line-through mr-3 flex items-center text-gray-700 text-sm">
                        <FaRupeeSign size={14} />
                        {Math.floor(product.price)}
                      </span>
                      <FaRupeeSign size={16} /> {Math.floor(product.finalPrice)}
                    </h3>


                  </div>
{/*        
        <div className="">
          <button
            onClick={(e) => handleAddToCart(e, product)}
               className="montserrat w-full flex items-center justify-center gap-2  text-[#292927] hover:text-white font-semibold text-xs md:text-sm py-2 rounded-md border border-[#292927] hover:bg-[#292927] shadow-sm transition-all duration-300"
          >
            <ShoppingBag size={16} />
            ADD TO CART
          </button>
        </div> */}
                </Link>
              ))}
            </div>
          )}
        </div>
        {product.length > 0 && (
          <Pagination
            page={pages?.page}
            pages={pages?.pages}
            onPageChange={onPageChange}
          />
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
