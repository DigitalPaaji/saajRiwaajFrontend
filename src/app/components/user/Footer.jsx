'use client';
import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useGlobalContext } from "../context/GlobalContext";

export default function Footer() {
    const { categories, subCategoriesMap } = useGlobalContext();
  function formatCategoryPath(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-'); // e.g., Saaj Riwaaj Exclusive → saaj-riwaaj-exclusive
}

function formatCategoryLabel(name) {
  return name
  .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '); // e.g., saaj riwaaj → Saaj Riwaaj
}
  return (
    <footer className="bg-[#2b2a29ef] ">
      <div className=" mx-4 md:mx-12 xl:mx-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="">
            <img src="/Images/logoWhite.webp" alt="Saaj Riwaaj" className="h-16 mb-4" />
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-[#f3ecdf] hover:text-[#B67032] w-3 h-3"><Facebook /></a>
              <a href="#" className="text-[#f3ecdf] hover:text-[#B67032] w-3 h-3"><Instagram /></a>
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
              {/* <li><Link href={"/returns"} className="hover:text-[#B67032]">Returns</Link></li> */}
            </ul>
          </div>
          {/* <div className="col-span-2 md:col-span-4 lg:col-span-1">
             <h3 className="text-[#f3ecdf] text-md font-semibold mb-4">Sign Up for Our Newsletter</h3>
             <p className="text-stone-200 mb-4">Receive exclusive offers, styling tips, and more.</p>
             <form className="flex">
               <input type="email" placeholder="Your email" className="w-full text-[#f3ecdf] px-3 py-2 border border-r-0 rounded-l-md focus:outline-none focus:ring-1 focus:ring-amber-500" />
               <button className="bg-[#f3ecdf] font-semibold hover:text-white rounded-r-md hover:bg-[#B67032] transition-colors w-full">Sign Up</button>
             </form>
          </div> */}
        </div>
        <div className="border-t mt-12 pt-8 text-center text-md text-[#f3ecdf]">
          <p>&copy; {new Date().getFullYear()} Saaj Riwaaj. Developed and Designed By <a href="https://digitalpaaji.com" className='text-[#c09167] '>Digital Paaji</a>. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}