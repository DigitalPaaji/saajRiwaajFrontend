"use client";
import axios from "axios";
import { useGlobalContext } from "../context/GlobalContext";
import { Heart, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { base_url } from "../store/utile";
import { removeFromWishlist } from "../store/wishListSlice";

export default function CartSidebar({ isWishlistOpen ,setIsWishlistOpen}) {
 
 const newwishlist = useSelector(state=>state.wishlist.items)
 const [wishlist,setWishlist]=useState([ ])
 const dispatch = useDispatch()

const fetchWishlist = async ()=>{
  try {
    const response = await axios.post(`${base_url}/wishlist/wishlistitems`,{wishlistids:newwishlist})
    const data =  await response.data;
    if(data.success){
      setWishlist(data.products)
    }
   
  } catch (error) {
    
  }
}

useEffect(()=>{
  isWishlistOpen && fetchWishlist()
},[isWishlistOpen,newwishlist ])

  return (
    <>
      {/* Overlay */}
      {isWishlistOpen && (
        <div
          className="fixed inset-0 top-0 bg-black/50 z-[998]"
          onClick={() => setIsWishlistOpen()} 
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 right-0 min-h-screen overflow-hidden w-[90%] md:w-[40%] xl:w-[25%] bg-white shadow-lg z-[999] transition-transform duration-300 ease-in-out ${
          isWishlistOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Background Graphic */}
        <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
          <Image
            alt="Background pattern"
            src="/Images/bg1.png"
            width={360}
            height={360}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-6 border-b-[1px] border-[#99571d] relative z-10 bg-white">
          <h2 className="text-xl font-mosetta font-medium text-[#99571d]">Wishlist</h2>
          <button className="cursor-pointer hover:bg-gray-100 p-1 rounded-full transition" onClick={() => setIsWishlistOpen()}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Empty State */}
        {!wishlist || wishlist.length === 0 ? (
          <div className="flex items-center justify-center h-full w-full text-center text-gray-500 px-6 relative z-10">
            <div className="flex flex-col mb-32 items-center justify-center">
              <Image
                src="/Images/cart.gif"
                alt="Empty Wishlist"
                width={160}
                height={160}
                loading="lazy"
                className="w-40 h-40 mb-4"
              />
              <p className="text-md">Your Wishlist Is Empty</p>
            </div>
          </div>
        ) : (
          /* Wishlist Items List */
          <div className="flex flex-col h-[calc(100vh-80px)] relative z-10">
            <div className="p-4 space-y-6 overflow-y-auto flex-1">
              {wishlist.map((item) => (
                <div key={item._id} className="group flex items-start gap-4 text-md relative bg-white">
                  
                  {/* Clickable Image */}
                  <Link href={`/product/${item.name}/${item._id}`} className="shrink-0" onClick={() => setIsWishlistOpen()}>
                    <Image
                      src={
                        item.images?.[0]
                          ? `${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.images[0]}`
                          : "/Images/placeholder.png" // Added safe fallback
                      }
                      alt={item.name}
                      width={96}
                      height={96}
                      sizes="96px"
                      loading="lazy"
                      className="rounded-md object-cover w-24 h-24"
                    />
                  </Link>

                  {/* Item Details */}
                  <div className="flex-1 space-y-1 pr-6">
                    <Link href={`/product/${item.name}/${item._id}`} onClick={() => setIsWishlistOpen()}>
                      <p className="capitalize font-medium hover:text-[#B67032] transition-colors">{item.name}</p>
                    </Link>

                    <div className="flex flex-col gap-2 pt-1">
                      <div className="flex items-end gap-3">
                        <span className="tracking-wide">₹{item.finalPrice}</span>
                        {item.discount > 0 && (
                          <span className="line-through text-stone-600 text-sm">₹{item.price}</span>
                        )}
                      </div>

                      {/* Read-only Color Variants */}
                      {item.colorVariants && item.colorVariants.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.colorVariants.map((v, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md border text-xs border-[#B67032] text-[#B67032] font-medium"
                            >
                              {v?.colorName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(removeFromWishlist(item._id));
                    }}
                    className="absolute right-0 top-0 cursor-pointer p-1 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Remove from Wishlist"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-white pb-8">
              <button
                onClick={() => setIsWishlistOpen()}
                className="text-center text-md text-[#B67032] underline w-full font-medium hover:text-[#99571d] transition-colors"
              >
                Explore More
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}