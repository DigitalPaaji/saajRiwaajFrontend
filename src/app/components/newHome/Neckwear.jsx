'use client';
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { FaRupeeSign, FaStar, FaStarHalfAlt } from "react-icons/fa";  
import axios from 'axios';
import { base_url } from '../store/utile';
import { useDispatch, useSelector } from 'react-redux';
import { addTocart, addTocartUser } from '../store/cartSlice';
import { addSlide } from '../store/sliderSlice';

export default function Earrings() {

const dispatch = useDispatch()

 const [loading,setLoading]=useState(true)
   const [productsByCategory2, setProductsByCategory2] = useState([ ]);
 const { user } = useSelector(state=>state.user)

  const earringsCategoryId = process.env.NEXT_PUBLIC_EARRINGS_CATEGORY_ID



const fetchProductsByCategory2 = async (categoryId) => {
  try {
   setLoading(true)

    const res = await axios.get(
      `${base_url}/product/random/${categoryId}`
    );

    const data = await res.data;

    setProductsByCategory2(data.products);

  } catch (err) {
    console.error("Error fetching products:", err);
  }finally{
    setLoading(false)
  }
};

 





useEffect(() => {
  fetchProductsByCategory2(earringsCategoryId);
}, []);


 const handelAddtocartProduct = async(product)=>{

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
      dispatch(addTocart({product:product._id,quantity:1,price:product.finalPrice,color:product.colorVariants[0]?._id}))
    }
  } catch (error) {
  toast.error(error.response.data.message)
  }finally{
    dispatch(addSlide("cart"))
  }
}
 
  const CardContent = ({ item }) => (
    <>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden ">
        <Image
        src={'/Images/2.webp'}
          // src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.images?.[0]}`}
          alt={item.name}
          fill
          className="absolute inset-0 object-cover"
        />

      </div>
      
 {/* Content Area */}
<div className="p-3 md:p-4 bg-white flex flex-col gap-3">

  {/* NAME */}
  <h3 className="text-sm md:text-base font-medium text-slate-900 leading-tight break-words montserrat capitalize">
    {item.name
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())}
  </h3>

  {/* ⭐ REVIEWS */}
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4].map((i) => (
      <FaStar key={i} size={12} className="text-yellow-500" />
    ))}
    <FaStarHalfAlt size={12} className="text-yellow-500" />
    <span className="text-xs text-slate-500 ml-1">(120 reviews)</span>
  </div>

  {/* PRICE */}
  <div className="flex items-center gap-2">
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

  {/* 🛒 ADD TO CART BUTTON */}
  <button
   onClick={(e)=>{  e.preventDefault()
              handelAddtocartProduct(item)}}
    className="w-full mt-1 
               text-white font-semibold text-xs md:text-sm py-2 rounded-md 
                bg-[#292927] shadow-sm transition-all duration-300"
  >
    Add to Cart
  </button>

</div>
    </>
  );

  return (
    <section className="py-12 md:py-16 px-4 md:px-12 lg:px-24 xl:px-40 2xl:px-52 bg-stone-100">
    

      <div className="">
        
        {/* --- HEADING SECTION --- */}
        <div className="max-w-4xl mx-auto text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-4xl  text-[#292927] mb-3 tracking-tight">
            Shop Earrings
          </h2>
          <p className="text-stone-600 text-sm md:text-[18px] max-w-xl mx-auto font-light leading-relaxed">
            From timeless studs to graceful chandbalis, find your perfect pair.
          </p>
        </div>

        {/* --- GRID LAYOUT --- */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-8">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="animate-pulse rounded-lg bg-gray-100 aspect-[4/6]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-8">
            {productsByCategory2.slice(0,12).map((item) => (
              <Link
                key={item._id}
                href={`/product/${item.name}/${item._id}`}
                className="group relative flex flex-col overflow-hidden rounded-lg transition-all duration-300"
              >
                <CardContent item={item} />
              </Link>
            ))}
          </div>
        )}
        
        {!loading && productsByCategory2.length === 0 && (
          <div className="text-center py-20 text-stone-400">
            No items available in this collection.
          </div>
        )}
      </div>
    </section>
  );
}