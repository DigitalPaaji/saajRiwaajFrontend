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
import { usePathname } from "next/navigation";
import Account from "./Account";




export default function Navbar() {
const [openCategoryId, setOpenCategoryId] = useState(null);

const toggleCategory = (id) => {
  setOpenCategoryId(prev => (prev === id ? null : id));
};

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const {info ,isError ,isLoading} = useSelector(state=>state.category);
  const {products} = useSelector(state=>state.randomProduct);
  const wishlist = useSelector(state=>state.wishlist.items)
  const { user } = useSelector(state=>state.user)
  const dispatch = useDispatch()
  const cart = useSelector(state=>state.cart.items)
  const slider = useSelector(state=>state.slider.slide)
  const [isScrolled, setIsScrolled] = useState(false); // Track scroll state
 
const pathname = usePathname();
  const isHomePage = pathname === "/";



useEffect(()=>{
dispatch(getCategory())
dispatch(getWishlist())
dispatch(getUser())


    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.scrollTo(0, 0);
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

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
      className={`
     left-0 right-0 z-[99] transition-all duration-500 
    ${isHomePage 
      ? isScrolled 
        ? "fixed bg-white shadow-md top-0" 
        : "fixed text-white bg-transparent top-0 py-2"
      : "sticky bg-white shadow-md top-0"
    }
  `}
      onMouseLeave={() => setActiveMegaMenu(null)}
    >
      <div className=" sm:mx-4 md:mx-12 xl:mx-24  ">
        <div className="flex justify-between items-center h-20">
          <button
            onClick={() => setIsMobileMenuOpen(prev=>(!prev))}
            className="xl:hidden p-2 "
          >
            <Menu className="w-6 h-6" />
          </button>



         <Link href="/" className="flex-shrink-0 group">
  <Image
               src={isHomePage
       ? (isScrolled ? "/Images/logo.webp" : "/Images/logoWhite.webp")
       : "/Images/logo.webp"}
               alt="Logo"
               width={120}
               height={40}
               className="h-10 w-full xl:h-12"
               priority
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
          className={`flex items-center text-[16px]   uppercase transition-colors duration-300 
                       ${
    isHomePage 
      ? (isScrolled ? "text-[#292927] " : "text-white font-semibold")
      : "text-[#292927]  font-medium "
  }`}
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
            onClick={() => dispatch(addSlide("search"))}
            className={`p-2 rounded-md `}
          >
            <Search className="w-5 h-5" />
          </button>


      {/* Search Modal */}
      {slider==="search" && (
        <SearchBar onClose={() =>  {slider==="search" ? dispatch(removeSlide(null))  : dispatch(addSlide("search"))  }} />
      )}
           
           
           
            
            <button 
             onClick={() => {
              dispatch( addSlide("wishlist"));
            }}
            className="p-2   relative">
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
      className="p-2  relative"
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
            className='p-2  '>
              {/* {user? (<span className="w-8 h-8 flex items-center justify-center bg-[#77481f] text-white rounded-full font-semibold">{user?.name?.substr(0,1).toUpperCase()}</span>) : */}
              
               <User className="w-5 h-5" />
            </button>
}


         {user &&  <button 
     onClick={() => {
              dispatch( addSlide("user"));
            }}
            className='p-2  '>
        <span className="w-8 h-8 flex items-center justify-center bg-[#77481f] text-white rounded-full font-semibold">{user?.email?.substr(0,1).toUpperCase()}</span>
              
             
            </button>
}


          </div>
        </div>
      </div>






   
    <div
        className={`fixed left-0 right-0 z-[98] transition-all duration-500 ease-in-out xl:hidden overflow-hidden bg-white shadow-xl border-t border-black/10 ${
          isMobileMenuOpen 
            ? "max-h-[85vh] opacity-100 translate-y-0" 
            : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
        } ${  isHomePage 
      ? isScrolled  ? "top-20" : "top-28" :"top-20"}`}
      >
     
          
    
          <div className="flex flex-col h-full max-h-[80vh]">
<nav className="p-6 space-y-6 overflow-y-auto">
  {info?.data?.length >0  && info?.data?.map((cat,index) => {
    const Icon = iconOptions[index];
   
    const isOpen = openCategoryId === cat.category._id;
  const hasSubCats = cat.subCategories.length > 0
    return (
      <div key={cat.category._id} className="border-b border-black/5 pb-2 last:border-0">


     <div className="flex items-center justify-between">
          
      
          <Link
            href={`/category/${formatCategoryPath(cat.category.name)}/${formatCategoryPath(cat.category._id)}`}
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[15px] font-semibold text-[#292927] hover:text-[#B67032] uppercase tracking-wide flex gap-4 items-center"
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
              className="p-2 text-black"
            >
              <IoIosArrowBack 
                className={`w-4 h-4 transition-transform ${
                  isOpen ? "rotate-90" : "-rotate-90"
                }`}
              />
            </button>
        
          )}
        </div> 






{hasSubCats && isOpen && (
  <div className="mt-4 grid grid-cols-2 gap-2 pl-2">
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
        className="text-[15px] text-stone-600 hover:text-[#B67032] capitalize py-1"
      >
        {formatCategoryLabel(sub.name)}
      </Link>
    ))}


    <Link
                        href={""}
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
        {/* </div>
      </div> */}




    </header>

   
    
      <Wishlist  isWishlistOpen={slider ==="wishlist"} setIsWishlistOpen={()=>dispatch(removeSlide(null))} />
      
       <CartSidebar  isCartOpen ={slider ==="cart" } setIsCartOpen={()=>dispatch(removeSlide(null))}  />

   <LoginSignup   isAuthOpen ={slider ==="login" } setIsAuthOpen={()=>dispatch(removeSlide(null))}  />
<Account   isAuthOpen ={slider ==="user" }   setIsAuthOpen={()=>dispatch(removeSlide(null))} />


      </>
  );
}
