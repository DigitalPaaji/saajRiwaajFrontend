'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaRupeeSign } from 'react-icons/fa';

export default function Collection({ offerId }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const skeletons = Array.from({ length: 6 });

  useEffect(() => {
    const fetchProducts = async () => {
      if (!offerId) return;

      setLoading(true);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/product/offer/${offerId}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.log("Error fetching offer products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [offerId]);

  return (
    <section>
      <div className="col-span-1 xl:col-span-8 flex flex-col justify-center">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

          {loading
            ? skeletons.map((_, idx) => (
                <div key={idx} className="shadow-lg rounded-lg bg-gray-200 animate-pulse h-[400px]"></div>
              ))
            : products.map((product, index) => (
                <Link
                  href={`/product/${product.name}/${product._id}`}
                  key={product._id}
                  className="group block border border-stone-200 p-4"
                >
                  <div
                    className="group relative aspect-square overflow-hidden hover:shadow-xl transition-all duration-300"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Image
                      src={
                        hoveredIndex === index && product.images?.[1]
                          ? product.images[1]
                          : product.images?.[0]
                      }
                      alt={product.name}
                      fill
                      className="object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                      
                    />
                  </div>

                  <div className="flex items-center justify-between flex-wrap mt-4 px-1">
                    <h3 className="font-semibold md:text-md text-gray-700 group-hover:text-[#B67032] transition-colors duration-300 truncate max-w-[60%]">
                      {product.name}
                    </h3>

                    <h3 className="flex items-center md:text-md font-semibold text-[#B67032] transition-colors duration-300">
                      <span className="line-through mr-3 flex items-center text-gray-700 text-sm">
                        <FaRupeeSign size={14} /> {product.price}
                      </span>
                      <FaRupeeSign size={16} /> {product.finalPrice}
                    </h3>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
