'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useSelector } from 'react-redux';

export default function Banner({ title, image = '/Images/innerBanner3.webp',idc,subcategory="" }) {
const [cats,setCat]=useState()
 const formatText = (str = '') =>str.split('-').join(' ');
 const {info ,isError ,isLoading} = useSelector(state=>state.category);



  const cat = info?.data?.find((item)=>item.category._id==idc)


  return (
    <div
      className="relative w-full h-[250px] md:h-[400px] flex items-center justify-center text-[#B67032]   px-4 md:px-6 lg:px-12 xl:px-24 "
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Text Content */}
      <div className="relative z-10 py-6">
   <h1 className="text-2xl md:text-xl font-mosetta font-semibold text-[#292927] capitalize">
         {cat?.category?.name}
        </h1> 

        <div className="mt-2 text-sm md:text-base text-gray-800 space-x-1">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="capitalize">{formatText(title)}</span>

          {/* 👉 show subcategory only if exists */}
          {subcategory && (
            <>
              <span>/</span>
              <span className="capitalize">{cat?.subCategories?.find(item=>item._id==subcategory).name}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
