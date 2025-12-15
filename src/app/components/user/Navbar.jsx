"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  Heart,
  ChevronDown,
  CalendarHeart,
    Sparkles,
  Leaf,
  HeartHandshake,
  Gem,
  Flower,
  HandHeart,

} from "lucide-react";
const iconOptions = [
    Sparkles,
    Gem,
    Flower,
    HandHeart,
];
import MegaMenu from "./MegaMenu";
import { useGlobalContext } from "../context/GlobalContext";
import SearchBar from "./Searchbar";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { allProducts , user, refetchUser, isLoggedIn, products, wishlist, setAuthTab, setIsWishlistOpen, setIsAuthOpen, categories, subCategoriesMap, cart, setIsCartOpen } = useGlobalContext();
  useEffect(() => {
    refetchUser();
  }, []);
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);
 
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

const cartItemCount = cart.reduce((acc, item) => acc + item?.quantity, 0);
  return (
    <header
      className="bg-[#faf8eae0]  backdrop-blur-md sticky top-0 z-[99] shadow-sm "
      onMouseLeave={() => setActiveMegaMenu(null)}
    >
      <div className=" sm:mx-4 md:mx-12 xl:mx-24  ">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="xl:hidden p-2 text-stone-700 hover:text-[#B67032]"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <img
              src="/Images/logo.webp"
              alt="Saaj Riwaaj Logo"
              className="h-10 w-auto xl:h-12 "
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center space-x-10">
 {categories.map((cat) => {
    const hasSubCats = subCategoriesMap[cat._id]?.length > 0;
    const categoryPath = `/category/${formatCategoryPath(cat.name)}/${formatCategoryPath(cat._id)}`;
    const categoryLabel = formatCategoryLabel(cat.name);
    return (
      <div
        key={cat._id}
        onMouseEnter={() => hasSubCats && setActiveMegaMenu(cat.name.toLowerCase())}
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <Link
           href={categoryPath}
          className="flex items-center text-shadow-stone-950 hover:text-[#99571d] font-bold font-mosetta transition "
        >
          {categoryLabel}
          {hasSubCats && (
            <ChevronDown
              className={`w-4 h-4 ml-1 transition-transform ${
                activeMegaMenu === cat.name.toLowerCase() ? "rotate-180" : ""
              }`}
            />
          )}
        </Link>

        {activeMegaMenu === cat.name.toLowerCase() && hasSubCats && (
          <MegaMenu
            onClose={() => setActiveMegaMenu(null)}
            category={cat}
            
            subcategories={subCategoriesMap[cat._id]}
          />
        )}
      </div>
    );
  })} 
</nav>

          {/* Right Icons */}
          <div className="flex items-center sm:space-x-2 md:space-x-4">
            {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2 rounded-md ${
              isSearchOpen ? "bg-[#B67032] text-white" : "text-stone-700 hover:text-[#B67032]"
            }`}
          >
            <Search className="w-5 h-5" />
          </button>


      {/* Search Modal */}
      {isSearchOpen && (
        <SearchBar products={allProducts} onClose={() => setIsSearchOpen(false)} />
      )}
           
           
           
            {/* <button className="hidden md:block p-2 text-stone-700 hover:text-[#B67032]">
              <Search className="w-5 h-5" />
            </button> */}
            <button 
             onClick={() => {
              setIsWishlistOpen(true);
            }}
            className="p-2 text-stone-700 hover:text-[#B67032] relative">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#b67032de] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {wishlist.length}
        </span>
      )}
            </button>
  
              <button
      onClick={() => setIsCartOpen(true)}
      className="p-2 text-stone-700 hover:text-[#B67032] relative"
    >
      <ShoppingBag className="w-5 h-5" />
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#b67032de] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cartItemCount}
        </span>
      )}
    </button>

              <button 
            onClick={() => {
              setAuthTab("login"); // or signup
              setIsAuthOpen(true);
            }}
            className='p-2 text-stone-700 hover:text-[#B67032] '>
              {isLoggedIn? (<span className="w-8 h-8 flex items-center justify-center bg-[#77481f] text-white rounded-full font-semibold">{user?.name?.substr(0,1).toUpperCase()}</span>) : ( <User className="w-5 h-5" />)}
            </button>
          </div>
        </div>
      </div>

 {/* Mega Menus (Dynamic) */}
     
{/* 
 {activeMegaMenu === cat.name.toLowerCase() && hasSubCats && (
          <MegaMenu
            onClose={() => setActiveMegaMenu(null)}
            category={cat}
            subcategories={subCategoriesMap[cat._id]}
          />
        )} */}




      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed inset-0 z-[99] transition-transform xl:hidden ${{
          true: "translate-x-0",
          false: "-translate-x-full",
        }[isMobileMenuOpen]}`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        <div className="relative w-4/5 max-w-sm h-screen bg-white shadow-xl flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
              <Link href="/" className="flex-shrink-0 group">
            <img
            
              src="/Images/logo.webp"
              alt="Saaj Riwaaj Logo"
              className="h-10 w-auto xl:h-12 "
            />
          </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="cursor-pointer p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-grow  p-4 space-y-2">
            {categories.map((cat) =>{
              const Icon = iconOptions[categories.indexOf(cat) % iconOptions.length];

                const categoryPath = `/category/${formatCategoryPath(cat.name)}/${formatCategoryPath(cat._id)}`;
                const categoryLabel = formatCategoryLabel(cat.name);
              return(
              <Link
               key={cat._id}
               href={categoryPath}
                onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all`}
      
          >
            <Icon size={18} />
            {categoryLabel}
          </Link>
        
            )})}
          </nav>
        </div>
      </div>
    </header>
  );
}
