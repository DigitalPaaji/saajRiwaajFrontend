"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useGlobalContext } from "../context/GlobalContext";
import { FaRupeeSign } from "react-icons/fa";
import Image from "next/image";
import { getOptimizedImage } from "../utils/cloudinary";

export default function ShopByCategory() {
  const { featuredProducts, refetchFeaturedProducts } = useGlobalContext();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      await refetchFeaturedProducts();
      setLoading(false);
    };
    fetch();
  }, [refetchFeaturedProducts]);

  const skeletons = Array.from({ length: 6 });

  if (!loading && featuredProducts.length === 0) return null; 

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute -top-32 -right-12 opacity-10 ">
        <Image
          alt=""
          
          src={"/Images/bg2.png"}
          width={360}
          height={360}
          className="w-full h-auto object-cover"
        />
      </div>
      <div>
        <h2 className="text-2xl md:text-3xl font-mosetta text-center font-medium text-[#99571d]">
          Most loved by our customers
        </h2>
       <p className="text-md md:text-lg text-stone-500 montserrat text-center mt-4">
  Our most loved pieces, chosen for their comfort, quality, and everyday charm.
</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6 xl:gap-12 text-center pt-24">
        {loading
          ? skeletons.map((_, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-full  animate-pulse"
              ></div>
            ))
          : [...featuredProducts]
              .sort(() => 0.5 - Math.random())
              .slice(0, 6)
              .map((product) => (
                <Link
                  href={`/product/${product.name}/${product._id}`}
                  key={product._id}
                  className="group"
                >
    <div className="aspect-square rounded-full overflow-hidden shadow-lg relative group">
  <Image
    src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${product.images?.[0]}`}
    alt={product.name}
    fill
    sizes="(max-width: 768px) 50vw, 200px"
    loading="lazy"
    className="object-cover transition-transform duration-500 group-hover:scale-110"
  />
          {/* Desktop Add to Cart */}
        <div className="hidden lg:group-hover:flex absolute inset-0 transition-all duration-300 items-end justify-center p-4 z-20 bg-black/5">
          <button
            onClick={(e) => handleAddToCart(e, item)}
            className="montserrat w-full
             
              text-black font-semibold py-2.5 text-xs rounded shadow-lg 
              transform translate-y-4 group-hover:-translate-y-1 
              transition-all duration-500 ease-out flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} />
            ADD TO CART
          </button>
        </div>

        {/* Mobile Add to Cart */}
        <div className="lg:hidden absolute bottom-2 right-2 z-20">
          <button
            onClick={(e) => handleAddToCart(e, item)}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md active:scale-90 transition-transform text-[#292927] border border-gray-100"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
</div>
                 <h3 className="montserrat text-stone-700 group-hover:text-[#B67032] transition-colors duration-300 capitalize mt-4">
  {product.name
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())}
</h3>

                  <h3 className="font-semibold  text-md text-[#B67032] transition-colors duration-300 flex items-center justify-center">
                    <span className="line-through mr-4 flex items-center">
                      <FaRupeeSign size={14} />
                      {Math.floor(product.price)}
                    </span>
                    <FaRupeeSign size={14} />
                    {Math.floor(product.finalPrice)}
                  </h3>
                </Link>
              ))}
      </div>
    </section>
    
  );
}
