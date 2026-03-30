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
  Sparkles,
  Gem,
  Flower,
  HandHeart,
} from "lucide-react";
import MegaMenu from "./MegaMenu";
import { useGlobalContext } from "../context/GlobalContext";
import SearchBar from "./SearchBar";
import { IoIosArrowBack } from "react-icons/io";
import Image from "next/image";

const iconOptions = [Sparkles, Gem, Flower, HandHeart];

export default function Navbar() {
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false); // Track scroll state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { 
    allProducts, user, refetchUser, isLoggedIn, wishlist, 
    setAuthTab, setIsWishlistOpen, setIsAuthOpen, categories, 
    subCategoriesMap, cart, setIsCartOpen 
  } = useGlobalContext();

  const toggleCategory = (id) => {
    setOpenCategoryId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    // Scroll listener to handle background change
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.scrollTo(0, 0);
    setTimeout(() => {
      refetchUser();
    }, 1000);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [refetchUser]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  function formatCategoryPath(name) {
    return name.trim().toLowerCase().replace(/\s+/g, "-");
  }

  function formatCategoryLabel(name) {
    return name
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const cartItemCount = cart
    ?.filter((item) => item.buytype == "cart")
    .reduce((acc, item) => acc + item?.quantity, 0);

  return (
    <header
      className={`fixed backdrop-blur-lg left-0 right-0 z-[99] transition-all duration-500 ${
        isScrolled 
          ? "bg-white backdrop-blur-lg shadow-md  top-0" 
          : "bg-transparent py-2 top-8" 
      }`}
      onMouseLeave={() => setActiveMegaMenu(null)}
    >
      <div className="px-4 md:px-12 xl:px-24">
        <div className="flex justify-between items-center   h-20">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`xl:hidden p-2 transition-colors ${
              isScrolled ? "text-[#292927]" : "text-white"
            }`}
          >
            <Menu className="w-6 h-6" />
          </button>

 

       
                   {/* Logo */}
          <Link href="/" className="flex-shrink-0 group ">
            <Image
              src={isScrolled ? "/Images/logo.webp":"/Images/logoWhite.webp"}
              alt="Logo"
              width={120}
              height={40}
              className="h-10 w-full xl:h-12"
              priority
            />
          </Link>
   {/* Desktop Navigation */}
          <nav className=" hidden xl:flex items-center space-x-10">
            {categories.map((cat) => {
              const hasSubCats = subCategoriesMap[cat._id]?.length > 0;
              const categoryPath = `/category/${formatCategoryPath(cat.name)}/${cat._id}`;
              const categoryLabel = formatCategoryLabel(cat.name);
              return (
                <div
                  key={cat._id}
                  onMouseEnter={() => hasSubCats && setActiveMegaMenu(cat.name.toLowerCase())}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link
                    href={categoryPath}
                    className={`flex items-center text-[16px]   uppercase transition-colors duration-300 ${
                      isScrolled ? "text-[#292927] font-medium " : "text-white font-semibold"
                    }`}
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
          <div className={` justify-end flex items-center sm:space-x-2 md:space-x-4 ${isScrolled ? "text-[#292927]" : "text-white"}`}>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:opacity-70 transition-opacity"
            >
              <Search className="w-5 h-5" />
            </button>

            {isSearchOpen && (
              <SearchBar products={allProducts} onClose={() => setIsSearchOpen(false)} />
            )}

            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 relative hover:opacity-70 transition-opacity"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B67032] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 relative hover:opacity-70 transition-opacity"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B67032] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setAuthTab("login");
                setIsAuthOpen(true);
              }}
              className="p-2 hover:opacity-70 transition-opacity"
            >
              {isLoggedIn ? (
                <span className="w-8 h-8 flex items-center justify-center bg-[#B67032] text-white rounded-full font-semibold text-sm">
                  {user?.name?.substr(0, 1).toUpperCase()}
                </span>
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

 {/* Mobile Dropdown Menu (Replacing Sidebar) */}
      <div
        className={`fixed left-0 right-0 z-[98] transition-all duration-500 ease-in-out xl:hidden overflow-hidden bg-white shadow-xl border-t border-black/10 ${
          isMobileMenuOpen 
            ? "max-h-[85vh] opacity-100 translate-y-0" 
            : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
        } ${isScrolled ? "top-20" : "top-28"}`}
      >
        <div className="flex flex-col h-full max-h-[80vh]">
          <nav className="p-6 space-y-6 overflow-y-auto">
            {categories.map((cat) => {
              const categoryLabel = formatCategoryLabel(cat.name);
              const categoryPath = `/category/${formatCategoryPath(cat.name)}/${cat._id}`;
              const subcategories = subCategoriesMap?.[cat._id] || [];
              const hasSubcategories = subcategories.length > 0;
              const isOpen = openCategoryId === cat._id;

              return (
                <div key={cat._id} className="border-b border-black/5 pb-2 last:border-0">
                  <div className="flex items-center justify-between">
                    <Link
                      href={categoryPath}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[15px] font-semibold text-[#292927] hover:text-[#B67032] uppercase tracking-wide"
                    >
                      {categoryLabel}
                    </Link>
                    {hasSubcategories && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategory(cat._id);
                        }}
                        className="p-2 bg-stone-50 rounded-full"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 text-stone-500 ${
                            isOpen ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  
                  {hasSubcategories && isOpen && (
                    <div className="mt-4 grid grid-cols-2 gap-2 pl-2">
                      {subcategories.map((sub) => (
                        <Link
                          key={sub._id}
                          href={{
                            pathname: `/category/${formatCategoryPath(cat.name)}/${cat._id}`,
                            query: { subcategory: sub._id },
                          }}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-[15px] text-stone-600 hover:text-[#B67032] capitalize py-1"
                        >
                          {formatCategoryLabel(sub.name).toLowerCase()}
                        </Link>
                      ))}
                      <Link
                        href={categoryPath}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="col-span-2 text-[14px] font-semibold text-[#B67032] flex items-center pt-2"
                      >
                        View All Collections <IoIosArrowBack className="rotate-180 ml-1 w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          
     
        </div>
      </div>

      {/* Backdrop for Dropdown */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0  z-[97] xl:hidden "
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}