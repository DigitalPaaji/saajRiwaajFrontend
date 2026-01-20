"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useGlobalContext } from "../context/GlobalContext";
import { FaRupeeSign } from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getOptimizedImage } from "../utils/cloudinary";

export default function ShopByCategory() {
  const { refetchProductsByCategory } = useGlobalContext();
  const [exclusiveProducts, setExclusiveProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const skeletons = Array.from({ length: 6 });
  const earringsCategoryId = "693bbf62430ea8120089b320"; 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await refetchProductsByCategory(earringsCategoryId);

        const filtered = Array.isArray(result)
          ? result.filter(
              (p) =>
                p?.category === earringsCategoryId ||
                p?.category?._id === earringsCategoryId
            )
          : [];

        setExclusiveProducts(filtered);
      } catch (err) {
        console.error(" Error fetching category-exclusive products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const editorialItems = [
    {
      title: "The Wedding Edit",
      description: "Find the perfect jewels for your special day.",
      link: "Wedding",
      imageUrl:
        "https://www.tanishq.co.in/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw1eded5b5/homepage/tanishq-collections/dailywear-chains.jpg",
    },
    // {
    //   title: 'Everyday Diamonds',
    //   description: 'Subtle sparkle for your daily life.',
    //   link: 'Diamonds',
    //   imageUrl: 'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dw08083f53/homepage/new-arrivals/new-arrivals-background.jpg',
    // },
    // {
    //   title: 'Gifts of Love',
    //    link: 'Gifts',
    //   imageUrl: 'https://www.tanishq.co.in/on/demandware.static/-/Library-Sites-TanishqSharedLibrary/default/dwfba22b76/homepage/tanishq-collections/stunning-every-ear.jpg',
    // },
  ];

  return (
    <section className="py-12 z-50 relative">

        <div className="absolute -top-24 -right-12 opacity-20">
              <Image
                alt=""
                
                src={"/Images/bg1.png"}
                width={360}
                height={360}
                className="w-full h-auto rotate-[300deg] object-cover"
              />
            </div>

      <div className="px-4 sm:px-6 lg:px-8 z-50">
        {/* <div>
          <h2 className="text-3xl md:text-4xl font-serif text-center">Saaj Riwaaj Exclusive</h2>
          <p className="text-md md:text-xl text-stone-500 font-serif text-center mt-4">
            Crafted with passion, worn with pride. Explore our signature exclusives.
          </p>
        </div> */}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 ">
<div className="col-span-1 xl:col-span-4">
  <div
    className="relative h-[400px] md:h-[600px] w-full bg-contain bg-no-repeat bg-center flex items-center justify-center text-center overflow-hidden"
    style={{ backgroundImage: "url('/Images/exclusive2.webp')" }}
  >
    <div className="relative z-10 px-4 sm:px-6 max-w-full sm:max-w-md w-full">
      <h3 className="text-xl sm:text-2xl md:text-3xl font-mosetta  font-medium text-[#B67032] mb-3 leading-snug">
        Discover Timeless Elegance with Saaj Riwaaj
      </h3>
      <p className="text-sm sm:text-base md:text-md text-[#5c3b22] mb-4 leading-normal">
        Unveil our handpicked exclusive jewellery pieces that blend tradition with royalty.
      </p>
      <Link href={`/category/saaj-riwaaj-exclusive/${earringsCategoryId}`} className="bg-[#7a4a26] text-white px-4 sm:px-5 py-2 rounded-xl hover:bg-[#5c3b22] transition duration-300 text-md">
        Explore Now
      </Link>
    </div>
  </div>
</div>







          <div
            className={`col-span-1 xl:col-span-8 flex flex-col justify-center `}
          >
                {/* <div>
          <h2 className="text-3xl md:text-4xl font-serif ">Saaj Riwaaj Exclusive</h2>
          <p className="text-md md:text-xl text-stone-500 font-serif  mt-4">
            Crafted with passion, worn with pride. Explore our signature exclusives.
          </p>
        </div> */}
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
            {loading
              ? skeletons.map((_, idx) => (
                  <div
                    key={idx}
                    className="shadow-lg rounded-lg bg-gray-200 animate-pulse "
                  ></div>
                ))
              : exclusiveProducts.slice(0, 3).map((product, index) => (
                  <Link href={`/product/${product.name}/${product._id}`} key={product._id} className="group">
                    {/* <div className="flex items-center justify-center gap-4"> */}
                    <div
  className="group relative aspect-square overflow-hidden shadow-lg rounded-lg"
  onMouseEnter={() => setHoveredIndex(index)}
  onMouseLeave={() => setHoveredIndex(null)}
>
  <Image
    src={`https://api.saajriwaaj.com/uploads/${
      hoveredIndex === index && product.images?.[1]
        ? product.images[1]
        : product.images?.[0]
    }`}
    alt={product.name}
    fill
    sizes="(max-width: 768px) 100vw, 400px"
    loading="lazy"
    className="object-cover object-center transition-all duration-300"
  />
</div>
                    {/* </div> */}
                    <h3 className="mt-4 font-serif font-medium text-lg text-stone-700 group-hover:text-[#B67032] transition-colors duration-300">
                      {product.name}
                    </h3>
                   {product.description?.paragraphs?.[0] && (
                      <h3 className="font-semibold text-md text-stone-700 group-hover:text-[#B67032] transition-colors duration-300">
                        {product.description.paragraphs[0].split(" ").slice(0, 10).join(" ")}...
                      </h3>
                    )}
                  </Link>
                ))}
                </div>
          </div>
        </div>
      </div>
    </section>
  );
}
