"use client";
import React, { useState, useEffect, useMemo } from "react";
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
const iconOptions = [
    Sparkles,
    Gem,
    Flower,
    HandHeart,
];
import MegaMenu from "./MegaMenu";
import { useGlobalContext } from "../context/GlobalContext";
import SearchBar from "./Searchbar";
import { IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../store/categorySlice";
import { getRandomProduct } from "../store/randomProductSlice";
import { addFullList, getWishlist } from "../store/wishListSlice";
import Wishlist from '../user/Wishlist'
import { getUser } from "../store/getUserSlice";
import { getcart, getCartItem } from "../store/cartSlice";
import CartSidebar from "./CartSidebar";
import { addSlide, removeSlide } from "../store/sliderSlice";
import LoginSignup from "../user/LoginSignup";




export default function Navbar() {
const [openCategoryId, setOpenCategoryId] = useState(null);

const toggleCategory = (id) => {
  setOpenCategoryId(prev => (prev === id ? null : id));
};

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const {info ,isError ,isLoading} = useSelector(state=>state.category);
  const {products} = useSelector(state=>state.randomProduct);
  const wishlist = useSelector(state=>state.wishlist.items)
  const { user } = useSelector(state=>state.user)
  const dispatch = useDispatch()
  const cart = useSelector(state=>state.cart.items)
 const slider = useSelector(state=>state.slider.slide)

useEffect(()=>{
dispatch(getCategory())
dispatch(getWishlist())
dispatch(getUser())
},[ ])

useEffect(()=>{
if(user){
dispatch(addFullList(user.wishlist))
dispatch(getCartItem())
}
else{
dispatch(getcart())

}

},[user])





useEffect(()=>{

if(activeMegaMenu){
dispatch(getRandomProduct(activeMegaMenu))
}


},[ activeMegaMenu])




 
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

// const cartItemCount = cart?.filter((item=>item.buytype=="cart")).reduce((acc, item) => acc + item?.quantity, 0);
  return (
     <>
    <header
      className="bg-[#faf8eae0]  backdrop-blur-md sticky top-0 z-[99] shadow-sm "
      onMouseLeave={() => setActiveMegaMenu(null)}
    >
      <div className=" sm:mx-4 md:mx-12 xl:mx-24  ">
        <div className="flex justify-between items-center h-20">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="xl:hidden p-2 text-stone-700 hover:text-[#B67032]"
          >
            <Menu className="w-6 h-6" />
          </button>



         <Link href="/" className="flex-shrink-0 group">
  <Image
    src="/Images/logo.webp"
    alt="Saaj Riwaaj Logo"
    width={120}      
    height={40}       
    className="h-10 w-auto xl:h-12"
    loading="lazy"    
  />
</Link>

        {isLoading ? <div>Loading... </div> :

      <nav className="hidden xl:flex items-center space-x-10">
 { info?.data?.length >0  && info?.data?.map((cat) => {
    const hasSubCats = cat.subCategories.length > 0
   
    return (
      <div
        key={cat.category._id}
        onMouseEnter={() => hasSubCats && setActiveMegaMenu(cat.category._id)}
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
 
        <Link
           href={`/category/${formatCategoryPath(cat.category.name)}/${formatCategoryPath(cat.category._id)}`}
          className="flex items-center text-shadow-stone-950 hover:text-[#99571d] font-bold font-mosetta transition "
        >
          {cat.category.name}
          {hasSubCats && (
            <ChevronDown
              className={`w-4 h-4 ml-1 transition-transform 
              // ${activeMegaMenu === cat.category.name.toLowerCase() ? "rotate-180" : ""}
              `}
            />
          )}
        </Link>

        {activeMegaMenu === cat.category._id && hasSubCats && (
          <MegaMenu
            onClose={() => setActiveMegaMenu(null)}
            category={cat.category}
             products={products}
            subcategories={cat.subCategories}
          />


        )} 
         
           
         
        
      </div>
    );
  })} 
</nav> 
        }
        
   

        
          <div className="flex items-center sm:space-x-2 md:space-x-4">
      
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2 rounded-md ${
              isSearchOpen ? "bg-[#B67032] text-white" : "text-stone-700 hover:text-[#B67032]"
            }`}
          >
            <Search className="w-5 h-5" />
          </button>


      {/* Search Modal */}
      {/* {isSearchOpen && (
        <SearchBar products={allProducts} onClose={() => setIsSearchOpen(false)} />
      )} */}
           
           
           
            {/* <button className="hidden md:block p-2 text-stone-700 hover:text-[#B67032]">
              <Search className="w-5 h-5" />
            </button> */}
            <button 
             onClick={() => {
              dispatch( addSlide("wishlist"));
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
       onClick={() => {
              dispatch(addSlide("cart"));
            }}
      className="p-2 text-stone-700 hover:text-[#B67032] relative"
    >
      <ShoppingBag className="w-5 h-5" />
      {cart.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#b67032de] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cart.length}
        </span>
      )}
    </button>

            {!user &&  <button 
            onClick={() =>  dispatch(addSlide("login")) }
            className='p-2 text-stone-700 hover:text-[#B67032] '>
              {/* {user? (<span className="w-8 h-8 flex items-center justify-center bg-[#77481f] text-white rounded-full font-semibold">{user?.name?.substr(0,1).toUpperCase()}</span>) : */}
              
               <User className="w-5 h-5" />
            </button>
}


         {user &&  <button 
            // onClick={() =>  dispatch(addSlide("login")) }
            className='p-2 text-stone-700 hover:text-[#B67032] '>
        <span className="w-8 h-8 flex items-center justify-center bg-[#77481f] text-white rounded-full font-semibold">{user?.email?.substr(0,1).toUpperCase()}</span>
              
             
            </button>
}


          </div>
        </div>
      </div>






   
    <div
        className={`fixed inset-0 z-[99] transition-transform xl:hidden ${isMobileMenuOpen? "translate-x-0":"-translate-x-full"}`}
      >
        <div
          className="absolute inset-0 bg-black/40 h-screen"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        <div className="relative w-4/5 max-w-sm h-screen bg-white shadow-xl flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
             <Link href="/" className="flex-shrink-0 group">
  <Image
    src="/Images/logo.webp"
    alt="Saaj Riwaaj Logo"
    width={120}      
    height={48}      
    className="h-10 w-auto xl:h-12"
    loading="lazy"
  />
</Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="cursor-pointer p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
<nav className="flex-grow p-4 space-y-2 overflow-y-auto">
  {info?.data?.length >0  && info?.data?.map((cat,index) => {
    const Icon = iconOptions[index];
   
    const isOpen = openCategoryId === cat.category._id;
  const hasSubCats = cat.subCategories.length > 0
    return (
      <div key={cat.category._id} className="rounded-xl bg-stone-50">


     <div className="flex items-center justify-between px-4 py-3">
          
      
          <Link
            href={`/category/${formatCategoryPath(cat.category.name)}/${formatCategoryPath(cat.category._id)}`}
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 text-sm font-medium"
          >
            <Icon size={18} />
            {cat.category.name}
          </Link>

   
          {hasSubCats && (
            <button
              onClick={(e) => {
                e.stopPropagation(); 
                toggleCategory(cat.category._id);
              }}
              className="p-2"
            >
              <IoIosArrowBack 
                className={`w-4 h-4 transition-transform ${
                  isOpen ? "rotate-90" : ""
                }`}
              />
            </button>
        
          )}
        </div> 






{hasSubCats && isOpen && (
  <div className="pl-12 pb-3 space-y-2">
    {cat.subCategories.map((sub) => (
      <Link
        key={sub._id}
        href={{
          pathname: `/category/${formatCategoryPath(cat.category.name)}/${cat.category._id}`,
          query: {
            subcategory: sub._id,
          },
        }}
        onClick={() => setIsMobileMenuOpen(false)}
        className="block text-sm text-stone-600 hover:text-[#B67032]"
      >
        {formatCategoryLabel(sub.name)}
      </Link>
    ))}


    <Link
      href={`/category/${formatCategoryPath(cat.category.name)}/${cat.category._id}`}
      onClick={() => setIsMobileMenuOpen(false)}
      className="block text-sm font-semibold text-[#B67032] pt-1"
    >
      View All
    </Link>
  </div>
)}

      </div>
    );
  })}
</nav>


 
        </div>
      </div>




    </header>

   
    
      <Wishlist  isWishlistOpen={slider ==="wishlist"} setIsWishlistOpen={()=>dispatch(removeSlide(null))} />
      
       <CartSidebar  isCartOpen ={slider ==="cart" } setIsCartOpen={()=>dispatch(removeSlide(null))}  />

   <LoginSignup   isAuthOpen ={slider ==="login" } setIsAuthOpen={()=>dispatch(removeSlide(null))}  />



      </>
  );
}
