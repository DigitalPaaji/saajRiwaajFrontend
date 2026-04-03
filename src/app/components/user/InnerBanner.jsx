"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useGlobalContext } from "../context/GlobalContext";

export default function HeroBanner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { subCategoriesMap } = useGlobalContext();

  const [subName, setSubName] = useState(null);

  const subcategory = searchParams.get("subcategory");

  // Map category → banner
  const bannerMap = {
    neckwear: "/Images/neckwear.webp",
    exclusive: "/Images/chains.webp",
    bangles: "/Images/bangles.webp",
    earrings: "/Images/earringsbanner.webp",
  };

  // Extract category from URL
  const currentCategory = Object.keys(bannerMap).find((cat) =>
    pathname.includes(cat)
  );

  // Final banner image
  const bannerImage = bannerMap[currentCategory] || "/Images/default.webp";

  // helper to format title
  const formatText = (str = "") => str?.split("-").join(" ");

  // Create title (from URL)
  const title = currentCategory ? formatText(currentCategory) : "";

  // Get subcategory name
  useEffect(() => {
    if (!subCategoriesMap || !subcategory || !currentCategory) return;

    const list = subCategoriesMap[currentCategory];
    const found = list?.find((i) => i._id === subcategory);

    setSubName(found || null);
  }, [subCategoriesMap, subcategory, currentCategory]);

  return (
    <section className="relative w-full">

      {/* Banner Image */}
      <div className="relative w-full h-auto">
        <Image
          src={bannerImage}
          alt="Category Banner"
          width={1920}
          height={700}
          priority
          className="w-full h-auto object-cover"
        />
      </div>

      {/* TEXT BOX BELOW IMAGE */}
      <div className="relative z-10 py-6 border-y border-gray-600/50 mt-4 text-center px-4 md:px-0">
        <h1 className="text-2xl md:text-xl font-mosetta font-semibold text-[#292927] capitalize">
          {title}
        </h1>

        <div className="mt-2 text-sm md:text-base text-gray-800 space-x-1">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="capitalize">{title}</span>

          {/* Show Subcategory */}
          {subcategory && subName && (
            <>
              <span>/</span>
              <span className="capitalize">{cat?.subCategories?.find(item=>item._id==subcategory).name}</span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}