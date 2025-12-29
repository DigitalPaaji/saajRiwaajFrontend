'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useGlobalContext } from "../context/GlobalContext";
import { getSocket } from '../socket';
import { Flip, Slide, toast } from 'react-toastify';

export default function Footer() {
    const { categories, subCategoriesMap } = useGlobalContext();
  function formatCategoryPath(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-'); 
}

function formatCategoryLabel(name) {
  return name
  .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '); 
}



useEffect(() => {
   window.scrollTo(0, 0);
  const socket = getSocket();
  socket.once("connect", () => {
  });

  const handleBuy = (data) => {
    toast(`💎 ${data.name} bought a product now!`, { 
position: "bottom-left",
autoClose: 2500,
hideProgressBar: true,
closeOnClick: true,
pauseOnHover: false,
draggable: true,
progress: undefined,
theme: "dark",
transition: Flip,

    });
  };

  socket.on("buy", handleBuy);

  return () => {
    socket.off("buy", handleBuy); 
  };
}, []);



  return (
    <footer className="bg-[#2b2a29ef] ">
      <div className=" mx-4 md:mx-12 xl:mx-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="">
            <img src="/Images/logoWhite.webp" loading="lazy" alt="Saaj Riwaaj" className="h-16 mb-4" />
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-[#f3ecdf] hover:text-[#B67032] w-3 h-3"><Facebook /></a>
              <a href="https://www.instagram.com/saajriwaaj/" className="text-[#f3ecdf] hover:text-[#B67032] w-3 h-3"><Instagram /></a>
              <a href="#" className="text-[#f3ecdf] hover:text-[#B67032] w-3 h-3"><Twitter /></a>
              <a href="#" className="text-[#f3ecdf] hover:text-[#B67032] w-3 h-3"><Youtube /></a>
            </div>
          </div>
          <div>
            <h3 className="text-[#f3ecdf] text-md font-semibold mb-2">SHOP</h3>
         {categories.map((cat) => {
           const hasSubCats = subCategoriesMap[cat._id]?.length > 0;
    const categoryPath = `/${formatCategoryPath(cat.name)}`;
    const categoryLabel = formatCategoryLabel(cat.name);
    return (   <ul  key={cat._id} className=" text-stone-200">
              <li><Link  href={`/category/${cat.name?.trim().toLowerCase().replace(/\s+/g, '-')}/${cat._id}`} className="hover:text-[#B67032]">   {categoryLabel}</Link></li>
             
            </ul>  )})}
          </div>
          <div>
            <h3 className="text-[#f3ecdf] text-md font-semibold mb-2">Useful Links</h3>
            <ul className=" text-stone-200">
              <li><Link href={"/delivery-information"} className="hover:text-[#B67032]">
Delivery Information</Link></li>
              <li><Link href={"/refund-policy"} className="hover:text-[#B67032]">Return/Refund Policy</Link></li>
              <li><Link href={"/privacy-policy"} className="hover:text-[#B67032]">Privacy Policy</Link></li>
              <li><Link href={"/terms-and-conditions"} className="hover:text-[#B67032]">Terms & Conditions</Link></li>

            </ul>
          </div>
          <div>
            <h3 className="text-[#f3ecdf] text-md font-semibold mb-2">Customer Service</h3>
            <ul className=" text-stone-200">
              <li><Link href={"/contact"} className="hover:text-[#B67032]">Contact Us</Link></li>
              <li><Link href={"/faq"} className="hover:text-[#B67032]">FAQ</Link></li>
              <li><Link href={"/about"} className="hover:text-[#B67032]">About Us</Link></li>
            </ul>
          </div>
        
        </div>
        <div className="border-t mt-12 pt-8 text-center text-md text-[#f3ecdf]">
          <p>&copy; {new Date().getFullYear()} Saaj Riwaaj. Developed and Designed By <a href="https://digitalpaaji.com" target='_blank' className='text-[#c09167] '>Digital Paaji</a>. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}