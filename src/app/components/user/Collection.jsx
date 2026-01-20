"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useGlobalContext } from "../context/GlobalContext";
import Image from "next/image";
import { FaRupeeSign } from "react-icons/fa";
import { getOptimizedImage } from "../utils/cloudinary";

export default function Collection({
  Pid,
  filters = { subCategories: [], tags: [], prices: [] },
}) {
  const toSlug = (str = "") => str.toLowerCase().trim().replace(/\s+/g, "-");

  const { addToCart, refetchProductsByCategory } = useGlobalContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const skeletons = Array.from({ length: 6 });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const result = await refetchProductsByCategory(Pid);

        // ✅ Ensure correct category
        let filtered = Array.isArray(result)
          ? result.filter(
              (p) => p?.category === Pid || p?.category?._id === Pid,
            )
          : [];

        const { subCategories = [], tags = [], prices = [] } = filters;

        // ================= SUBCATEGORY FILTER =================
        if (subCategories.length > 0) {
          filtered = filtered.filter((p) => {
            const productSubSlug = toSlug(p.subcategory?.name);
            return subCategories.includes(productSubSlug);
          });
        }

        // ================= TAG FILTER =================
        if (tags.length > 0) {
          filtered = filtered.filter((p) =>
            p.tags?.some((tagId) => tags.includes(tagId)),
          );
        }

        // ================= PRICE FILTER =================
        if (prices.length > 0) {
          filtered = filtered.filter((p) => {
            const price = p.finalPrice;
            return prices.some((range) => {
              if (range === "Under ₹1000") return price < 1000;
              if (range === "₹1000 - ₹2500")
                return price >= 1000 && price <= 2500;
              if (range === "₹2500 - ₹5000")
                return price > 2500 && price <= 5000;
              if (range === "Above ₹5000") return price > 5000;
              return false;
            });
          });
        }

        setFilteredProducts(filtered);
      } catch (error) {
        console.error("Error fetching products:", error);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [Pid, filters]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);

  //     try {
  //       const result = await refetchProductsByCategory(Pid);
  //       let filtered = Array.isArray(result)
  //         ? result.filter(p => p?.category === Pid || p?.category?._id === Pid)
  //         : [];

  //       const { subCategories = [], tags = [], prices = [] } = filters;
  //       const hasFilters = subCategories.length > 0 || tags.length > 0 || prices.length > 0;

  //       if (hasFilters) {
  //         // Subcategory filter
  //         if (subCategories.length > 0) {
  //           filtered = filtered.filter(p =>
  //             subCategories.includes(p.subcategory?.name?.toUpperCase())
  //           );
  //         }

  //         // Tag filter (compare tag IDs directly)
  //         if (tags.length > 0) {
  //           filtered = filtered.filter(p =>
  //             p.tags?.some(tagId => tags.includes(tagId))
  //           );
  //         }

  //         // Price filter
  //         if (prices.length > 0) {
  //           filtered = filtered.filter(p => {
  //             const price = p.finalPrice;
  //             return prices.some(range => {
  //               if (range === 'Under ₹1000') return price < 1000;
  //               if (range === '₹1000 - ₹2500') return price >= 1000 && price <= 2500;
  //               if (range === '₹2500 - ₹5000') return price > 2500 && price <= 5000;
  //               if (range === 'Above ₹5000') return price > 5000;
  //               return false;
  //             });
  //           });
  //         }
  //       }

  //       setFilteredProducts(filtered);
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //       setFilteredProducts([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [Pid, filters]);

  return (
    <section>
      <div className=" col-span-1 xl:col-span-8 flex flex-col justify-center">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading
            ? skeletons.map((_, idx) => (
                <div
                  key={idx}
                  className="shadow-lg rounded-lg bg-gray-200 animate-pulse h-[400px]"
                ></div>
              ))
            : filteredProducts.map((product, index) => (
                <Link
                  href={`/product/${product.name}/${product._id}`}
                  key={product._id}
                  className="group block border border-stone-200 p-4 "
                >
                  <div
                    className="group relative aspect-square overflow-hidden hover:shadow-xl transition-all duration-300"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
  <div className="relative w-full h-full overflow-hidden group">
  <Image
    src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${
      hoveredIndex === index && product.images?.[1]
        ? product.images[1]
        : product.images?.[0]
    }`}
    alt={product.name || "Product image"}
    fill
    className="object-cover transition-transform duration-500 group-hover:scale-105"
    sizes="100vw"
    loading="lazy"
  />
</div>

              
                    {/* <div className="relative w-full h-full overflow-hidden">
                     <Image
                        src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${hoveredIndex === index && product.images?.[1]?product.images[1]:product.images?.[0]}`}
                        alt={product.name || "Product image"}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        loading="lazy"
                        className="object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                      /> 




                    </div> */}
                  </div>

                  <div className="flex items-center justify-between flex-wrap mt-4 px-1">
                    {/* <h3 className="font-semibold md:text-lg text-stone-800 group-hover:text-[#B67032] transition-colors duration-300 truncate max-w-[60%]">
       {product.description?.paragraphs?.[0] && (
                        <p className="text-sm text-stone-600 mt-1 line-clamp-2">
                          {product.description.paragraphs[0]
                            .split(" ")
                            .slice(0, 10)
                            .join(" ")}
                          ...
                        </p>
                      )}
    </h3> */}
                    <h3 className="font-semibold md:text-md text-gray-700 group-hover:text-[#B67032] transition-colors duration-300 truncate max-w-[60%]">
                      {product.name}
                    </h3>
                    <h3 className="flex items-center md:text-md font-semibold text-[#B67032] transition-colors duration-300">
                      <span className="line-through mr-3 flex items-center text-gray-700 text-sm">
                        <FaRupeeSign size={14} />
                        {Math.floor(product.price)}
                      </span>
                      <FaRupeeSign size={16} /> {Math.floor(product.finalPrice)}
                    </h3>
                  </div>
                  {/* <button 
    onClick={(e) => {
      e.preventDefault();
      addToCart(product);
    }}  
    className="py-2 md:py-3 w-full cursor-pointer bg-[#B67032] hover:bg-[#9a5c28] rounded-xl text-white font-semibold mt-4 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
  >
    Add To Cart
  </button> */}
                </Link>
              ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
