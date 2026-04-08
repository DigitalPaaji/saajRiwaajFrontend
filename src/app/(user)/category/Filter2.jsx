"use client";
import { IndianRupee, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PriceRangeSlider from "./PriceRangeSlider";
import { base_url } from "@/app/components/store/utile";

const Filter2 = ({ categoryid, maxPrice, minPrice, handleFilter }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get active filters from URL to handle toggling on/off
  const currentTags = searchParams.get("tags");
  const currentSub = searchParams.get("subcategory");

  const { data } = useSelector((state) => state.category.info);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [tags, setTags] = useState([]);

  const sub = data?.find((item) => item.category._id === categoryid);

  const fetchTags = async () => {
    try {
      const res = await fetch(`${base_url}/tag/`);
      const responseData = await res.json();
      setTags(responseData.tags || []);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Tag Handler
  const handleTags = (tagId) => {
    if (tagId === currentTags) {
      handleFilter({ tags: null }, { resetPage: true }); // Deselect
    } else {
      handleFilter({ tags: tagId }, { resetPage: true }); // Select
    }
     setIsDrawerOpen(false);
    setShowPriceDropdown(false);
  };

  // Subcategory Handler
  const handleSubCategory = (subId) => {
    // console.log(subId)
    if (subId === currentSub) {
      handleFilter({ subcategory: null }, { resetPage: true }); 
    } else {
      handleFilter({ subcategory: subId }, { resetPage: true }); 
    }

     setIsDrawerOpen(false);
    setShowPriceDropdown(false);
  };


  
  const handleClear = () => {
    // Navigates to the current path without any query parameters
    router.push(window.location.pathname);
    setIsDrawerOpen(false);
    setShowPriceDropdown(false);



  };

// console.log(sub)

  return (
    <div className="w-full relative">
      {/* =========================================
          HORIZONTAL BAR (VISIBLE ON ALL SCREENS)
          ========================================= */}
      <div className="px-4 py-3 flex items-center w-full gap-4 md:gap-8 border-b border-gray-200">
        
        {/* Toggle Drawer Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 roundedd text-[#292927] font-medium transition-colors"
        >
          <SlidersHorizontal size={20} />
          <span className="hidden sm:block">Filters</span>
        </button>

    

     
        <div className="flex overflow-x-auto gap-4 items-center no-scrollbar pb-1">
          {sub?.subCategories?.length > 0 &&
            sub.subCategories.map((item) => (
              <button
                key={item._id}
                onClick={() => handleSubCategory(item._id)}
                className={`text-nowrap text-[12px] md:text-[15px] capitalize  px-3 py-1.5 rounded- border transition-all ${
                  currentSub === item._id
                    ? "bg-[#292927] text-white border-[#292927]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                }`}
              >

               
                {item.name.toLowerCase()}
              </button>
            ))}
        </div>

      </div>

    
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[9998] transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed  top-0 left-0 h-full w-[85%] sm:w-[350px] bg-white z-[9999] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl montserrat ">Filters</h2>
          <div className="flex items-center gap-4">
            <button onClick={handleClear} className="text-sm text-red-500 flex items-center gap-1 hover:underline">
              <RotateCcw size={14} /> Clear
            </button>
            <button onClick={() => setIsDrawerOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-8 no-scrollbar">
          
          {/* Price Filter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Price Range</h3>
            <PriceRangeSlider maxPrice={maxPrice} minPrice={minPrice} handleFilter={handleFilter} />
          </div>

          {/* Subcategory Filter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Categories</h3>
            <div className="flex flex-col gap-3  md:gap-4">
              {sub?.subCategories?.length > 0 ? (
                sub.subCategories.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => handleSubCategory(item._id)}
                    className={`text-left capitalize px-3  rounded-md transition-colors ${
                      currentSub === item.id ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
                    }`}
                  >
                    {item.name.toLowerCase()}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-400">No subcategories available.</p>
              )}
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags?.length > 0 ? (
                tags.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => handleTags(item._id)}
                    className={`px-3 py-1.5 text-sm capitalize rounded-md border transition-all ${
                      currentTags === item._id
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                    }`}
                  >
                    {item.name.toLowerCase()}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-400">No tags available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter2;