"use client";
import { useGlobalContext } from "../context/GlobalContext";
import { Heart, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { React } from "react";
import { getOptimizedImage } from "../utils/cloudinary";

export default function CartSidebar() {
  const { isWishlistOpen, setIsWishlistOpen, addToCart, wishlist, removeFromWishlist } = useGlobalContext();

  return (
    <>
    {isWishlistOpen && (
  <div
    className="fixed inset-0 bg-black/50 z-[998]"
    onClick={() => setIsWishlistOpen(false)} // close on overlay click
  />
)}

 
    <div
      className={`fixed top-0 right-0 min-h-screen 
          w-[90%] md:w-[40%] xl:w-[25%] bg-white shadow-lg z-[999] transition-transform duration-300 ${
        isWishlistOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
            <div className="absolute bottom-0 right-0 opacity-20">
                    <Image
                    
                      alt=""
                      src={"/Images/bg1.png"}
                      width={360}
                      height={360}
                      className="w-full h-auto object-cover"
                    />
                  </div>
      <div className="flex justify-between items-center px-4 py-6 border-b-[1px] border-[#99571d]">
        <h2 className="text-xl font-mosetta font-medium text-[#99571d]">Wishlist</h2>
        <button className="cursor-pointer" onClick={() => setIsWishlistOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      {wishlist.length === 0 ? (
       <div className="flex items-center justify-center h-full w-full text-center text-gray-500 px-6">
   <div className="flex flex-col my-24 items-center justify-center">
  <img
    src="/Images/cart.gif" 
    loading="lazy"
    alt="Empty Cart"
    className="w-40 h-40 mb-4 "
  />
  <p className="text-md">Your Wishlist Is Empty</p>
  </div>
</div>

      ) : (
        <div className="flex flex-col justify-between h-full">
          <div className=" p-4 space-y-4 overflow-y-auto flex-1">
            {wishlist.map((item) => (
              <Link href={`/product/${item.name}/${item._id}`} key={item._id} className="group flex items-start gap-4 text-md">
             <Image
  src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.images?.[0]}`}
  alt={item.name}
  width={96}
  height={96}
  sizes="96px"
  loading="lazy"
  className="rounded-md object-cover"
/>

                <div className="flex-1 space-y-2">
                  <p className=" ">{item.name}</p>
                 
                 
                <div className="flex flex-col gap-1">
    <div className="flex items-end gap-3">
      <span className=" tracking-wide">₹{item.finalPrice}</span>
      {item.discount > 0 && (
        <>
          <span className="line-through text-stone-600 ">₹{item.price}</span>
        </>
      )}
    </div>
         <div className="flex flex-wrap gap-2">
  {item.colorVariants.map((v, i) => (
    <button
      key={i}
      onClick={() => {
        v.images.length &&  setnewImg(v.images)
        setSelectedColor(v);
        setSelectedQty(1);
       setAddedToCart(false)
      }}
      className={`p-1 rounded-md border text-sm transition  ring-[#B67032] border-[#B67032] text-[#B67032] font-medium`}
    >
      {v?.colorName}
    </button>
  ))}
</div>
    {/* <span className="lg:text-md text-stone-500">({item.discount}% OFF)</span> */}
  </div>

     {/* <button onClick={() => addToCart(item)} className="lg:opacity-0  duration-300 lg:group-hover:opacity-100 cursor-pointer w-full flex items-center justify-center gap-1 xl:gap-2 bg-[#B67032] text-white px-4 py-2 rounded hover:bg-[#a95c2e] transition text-sm font-medium tracking-wide">
      <ShoppingCart className="w-4 h-4" />
      Add to Cart
    </button> */}
                </div>
                <button onClick={() => removeFromWishlist(item._id)} className="cursor-pointer">
                  
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </Link>
            ))}
          </div>

     <div className="p-4  space-y-4">
  <button
    onClick={() => setIsWishlistOpen(false)}
    className="text-center text-md text-[#B67032] underline mt-3 w-full"
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
