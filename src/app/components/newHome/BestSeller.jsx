"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { base_url } from "../store/utile";
import { getRandomProduct } from "../store/randomProductSlice";
import { addTocart, addTocartUser } from "../store/cartSlice";
import { addSlide } from "../store/sliderSlice";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa6";
// import { useGlobalContext } from "../context/GlobalContext";

export default function MostLovedFeatured() {
  const { data } = useSelector((state) => state.category.info);
  const { user } = useSelector((state) => state.user);
  const [filteredProducts, setfilteredProducts] = useState([]);
  const [allProduct, setAllProduct] = useState([]);
  const [Loading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.randomProduct);

  const formatCategoryLabel = (name) =>
    name
      .trim()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const handelAddtocartProduct = async (product) => {
    try {
      if (user) {
        try {
          const response = await axios.post(`${base_url}/cart/post`, {
            productid: product._id,
            quantity: 1,
            price: product.finalPrice,
            color: product.colorVariants[0]?._id,
          });
          const data = await response.data;
          if (data.success) {
            dispatch(addTocartUser(data.cart));
          }
        } catch (error) {
          toast.error(error.response.data.message);
        }
      } else {
        dispatch(
          addTocart({
            product: product._id,
            quantity: 1,
            price: product.finalPrice,
            color: product.colorVariants[0]?._id,
          }),
        );
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      dispatch(addSlide("cart"));
    }
  };
















const CardContent = ({ item }) => {
  const [soldCount, setSoldCount] = useState(null);





  useEffect(() => {
    if (item?._id) {
      setSoldCount(item._id.slice(-2).charCodeAt()+new Date(Date.now()).getDate()-30);
    }
  }, [item]);

  return (
    <>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 ">
        <Image
          src={"/Images/3.webp"}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Desktop Add to Cart */}
        <div className="hidden lg:group-hover:flex absolute inset-0 transition-all duration-300 items-end justify-center p-4 z-20 ">
          <button
            onClick={(e) => {
              e.preventDefault();
              handelAddtocartProduct(item);
            }}
            className="montserrat w-full bg-gradient-to-r from-[#bc861a] via-[#f1d981] to-[#bc861a] text-[#292927] font-semibold py-2.5 text-xs  
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
            onClick={(e) => {
              e.preventDefault();
              handelAddtocartProduct(item);
            }}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md active:scale-90 transition-transform text-[#292927] border border-gray-100"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4 flex flex-col gap-2">
        <div className="flex flex-col gap-1 text-center sm:text-left">

          {/* PRODUCT NAME */}
          <div className="flex items-center justify-between gap-1 ">
            <h3 className="text-sm md:text-base font-medium text-slate-900 capitalize leading-tight break-words montserrat">
              {item.name.toLowerCase()}
            </h3>

            <button className="cursor-pointer">
              <Heart className="w-6 h-6 text-stone-700" />
            </button>
          </div>

          {/* ⭐ REVIEWS SECTION */}
          <div className=" mb-1 flex items-center justify-center sm:justify-start gap-1">
            {[1, 2, 3, 4].map((star) => (
              <FaStar key={star} size={12} className="text-yellow-500" />
            ))}
            <FaStarHalfAlt size={12} className="text-yellow-500" />

            <span className="text-xs text-slate-500 ml-1">(120 reviews)</span>
          </div>

{soldCount === undefined ? (
  <div className="w-28 h-3 bg-gray-200 animate-pulse rounded"></div>
) : (
  <p className="text-[11px] text-red-600 font-semibold">
    🔥 {soldCount} bought in last 24 hours
  </p>
)}

          {/* PRICE SECTION */}
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
            <span className="flex items-center text-[#8b5424] font-bold text-sm md:text-base">
              <FaRupeeSign size={12} className="md:w-3.5" />
              {Math.floor(item.finalPrice)}
            </span>

            {item.price > item.finalPrice && (
              <span className="flex items-center text-slate-400 text-xs line-through">
                <FaRupeeSign size={10} />
                {Math.floor(item.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};


  const fetchFeturProduct = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${base_url}/product/featured`);
      const data = await response.data;
      setfilteredProducts(data);
      setAllProduct(data);
    } catch (error) {
      setfilteredProducts([]);
      setAllProduct([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeturProduct();
  }, []);

  useEffect(() => {
    if (activeCategory == "all") {
    } else {
      dispatch(getRandomProduct(activeCategory));
    }
  }, [activeCategory]);

  useEffect(() => {
    setfilteredProducts(products);
  }, [products]);

  return (
    <section className="py-12 md:py-20 px-4 md:px-12 lg:px-24 xl:px-40 2xl:px-52 relative overflow-hidden">
      {/* Decorative BG */}
      <div className="absolute -top-32 -right-12 opacity-5 pointer-events-none">
        <Image alt="" src="/Images/bg2.png" width={400} height={400} />
      </div>

      <div className="relative z-10">
        {/* Heading */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl text-[#292927] mb-4 tracking-tight montserrat font-light">
            Best Sellers
          </h2>
          <p className="text-stone-500 text-sm md:text-lg max-w-xl mx-auto font-light leading-relaxed montserrat">
            Our most popular pieces, chosen for their quality and everyday
            charm.
          </p>
        </div>

        {/* ----------------- TABS ----------------- */}
        <div className="flex flex-wrap gap-3 md:gap-4 justify-center my-8 pb-2 ">
          {/* ALL TAB */}
          <button
            className={`
              px-3 py-1 text-sm md:text-base font-medium border whitespace-nowrap
              ${
                activeCategory === "all"
                  ? "bg-[#292927] text-white"
                  : "text-[#292927]/80 hover:text-[#292927]"
              }
            `}
            onClick={() => {
              (setActiveCategory("all"), setfilteredProducts(allProduct));
            }}
          >
            All
          </button>

          {/* Dynamic Categories */}
          {data &&
            data.length > 0 &&
            data?.map((cat) => {
              const label = formatCategoryLabel(cat.category.name);
              return (
                <button
                  key={cat.category._id}
                  onClick={() => setActiveCategory(cat.category._id)}
                  className={`
                  px-3 py-1 text-sm md:text-base border whitespace-nowrap
                  ${
                    activeCategory === cat.category._id
                      ? "bg-[#292927] text-white"
                      : "text-[#292927]/80 hover:text-[#292927]"
                  }
                `}
                >
                  {label}
                </button>
              );
            })}
        </div>

        {Loading && isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xl:gap-8">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-md bg-stone-100 aspect-[4/6]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xl:gap-8">
            {filteredProducts.slice(0, 8)?.map((item) => (
              <Link
                key={item._id}
                href={`/product/${item.name.toLowerCase().replace(/\s+/g, "-")}/${item._id}`}
                className="group relative flex flex-col overflow-hidden rounded-md transition-all duration-300 shadow-2xl "
              >
                <CardContent item={item} />
              </Link>
            ))}
          </div>
        )}

        {!Loading && !isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-stone-400 italic">
   
          </div>
        )}
      </div>
    </section>
  );
}
