'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube, ArrowRight } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function Footer() {
  const {info ,isError ,isLoading} = useSelector(state=>state.category);

console.log(info,"sss")

  const formatCategoryPath = (name) => name?.trim().toLowerCase().replace(/\s+/g, '-');
  const formatCategoryLabel = (name) => 
    name?.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <footer className="bg-[#292927] text-white font-sans overflow-hidden ">
      {/* 1. High-End Newsletter Section */}
      <div className="px-4 md:px-12 lg:px-24 xl:px-40 2xl:px-52 py-20 border-b border-white/5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="max-w-xl">
            <h3 className="text-white text-lg md:text-xl font-serif tracking-wide mb-3">
              Join the <span className="italic text-zinc-300">Saaj Riwaaj</span> Circle
            </h3>
            <p className="text-zinc-400 text-sm md:text-base tracking-wide font-light">
              Be the first to explore our latest heritage collections and private gallery openings.
            </p>
          </div>
          <div className="w-full lg:w-auto flex items-center border-b border-white/30 py-3 focus-within:border-white transition-colors">
            <input 
              type="email" 
              placeholder="ENTER YOUR EMAIL" 
              className="bg-transparent text-xs md:text-sm tracking-[0.2em] outline-none w-full lg:w-80 uppercase placeholder:text-zinc-600"
            />
            <button className="text-white hover:translate-x-2 transition-transform duration-300">
              <ArrowRight size={20} strokeWidth={1} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Grid */}
      <div className="py-20 px-4 md:px-12 lg:px-24 xl:px-40 2xl:px-52">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-16 gap-x-12">
          
        
          <div className="col-span-2 lg:col-span-2 pr-0 lg:pr-32">
            <Link href="/">
              <Image
                src="/Images/logoWhite.webp" 
                alt="Saaj Riwaaj"
                width={120} // Increased size
                height={40}
                className="mb-4 opacity-90"
                loading="lazy"
              />
            </Link>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed tracking-wide mb-8 font-light">
              Curating timeless elegance since 2019. We specialize in handcrafted 
              jewelry that bridges the gap between ancestral heritage and 
              contemporary sophistication.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-white hover:text-zinc-400 transition-colors"><Facebook size={18} strokeWidth={1.2} /></a>
              <a href="https://www.instagram.com/saajriwaaj/" className="text-white hover:text-zinc-400 transition-colors"><Instagram size={18} strokeWidth={1.2} /></a>
              <a href="#" className="text-white hover:text-zinc-400 transition-colors"><Twitter size={18} strokeWidth={1.2} /></a>
              <a href="#" className="text-white hover:text-zinc-400 transition-colors"><Youtube size={18} strokeWidth={1.2} /></a>
            </div>
          </div>

          
          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.3em] uppercase mb-8">Collections</h4>
            <ul className="space-y-5">
              {!isLoading && info?.data?.map((cat) => (
                <li key={cat.category._id}>
                  <Link 
                    href={`/category/${formatCategoryPath(cat.category.name)}/${cat.category._id}`} 
                    className="text-zinc-400 hover:text-white text-xs md:text-[13px] uppercase tracking-[0.15em] transition-all duration-300 block hover:translate-x-1"
                  >
                    {formatCategoryLabel(cat.category.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.3em] uppercase mb-8">Client Care</h4>
            <ul className="space-y-5">
              <li><Link href="/delivery-information" className="text-zinc-400 hover:text-white text-xs md:text-[13px] uppercase tracking-[0.15em] transition-all duration-300 block hover:translate-x-1">Shipping</Link></li>
              <li><Link href="/refund-policy" className="text-zinc-400 hover:text-white text-xs md:text-[13px] uppercase tracking-[0.15em] transition-all duration-300 block hover:translate-x-1">Returns</Link></li>
              <li><Link href="/faq" className="text-zinc-400 hover:text-white text-xs md:text-[13px] uppercase tracking-[0.15em] transition-all duration-300 block hover:translate-x-1">Assistance</Link></li>
              <li><Link href="/contact" className="text-zinc-400 hover:text-white text-xs md:text-[13px] uppercase tracking-[0.15em] transition-all duration-300 block hover:translate-x-1">Book Appointment</Link></li>
            </ul>
          </div>

          {/* Legal/Company */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.3em] uppercase mb-8">Explore</h4>
            <ul className="space-y-5">
              <li><Link href="/about" className="text-zinc-400 hover:text-white text-xs md:text-[13px] uppercase tracking-[0.15em] transition-all duration-300 block hover:translate-x-1">Our Story</Link></li>
              <li><Link href="/privacy-policy" className="text-zinc-400 hover:text-white text-xs md:text-[13px] uppercase tracking-[0.15em] transition-all duration-300 block hover:translate-x-1">Privacy</Link></li>
              <li><Link href="/terms-and-conditions" className="text-zinc-400 hover:text-white text-xs md:text-[13px] uppercase tracking-[0.15em] transition-all duration-300 block hover:translate-x-1">Terms</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Credits Bar */}
      <div className="bg-black/20 py-2 px-4 md:px-12 lg:px-24 xl:px-40 2xl:px-52">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-xs tracking-[0.2em] text-zinc-400 uppercase">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} SAAJ RIWAAJ. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2">
             <span className="opacity-50">CRAFTED BY</span>
             <a href="https://digitalpaaji.com" target="_blank" className="text-zinc-300 font-semibold hover:text-white transition-colors">
               DIGITAL PAAJI
             </a>
          </div>
        </div>
      </div>
    </footer>
  );
}