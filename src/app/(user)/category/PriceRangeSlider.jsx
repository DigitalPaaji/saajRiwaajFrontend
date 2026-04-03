"use client";
import { useState, useRef, useEffect } from "react";

export default function PriceRangeSlider({minPrice,maxPrice,handleFilter}) {
  const minGap = 10;
//   const maxPrice = 10000;
const pricelimit = 10000



  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);

  const rangeTrackRef = useRef(null);

  const updateTrack = () => {
    const minPercent = (min / pricelimit) * 100;
    const maxPercent = (max / pricelimit) * 100;

    if (rangeTrackRef.current) {
      rangeTrackRef.current.style.left = `${minPercent}%`;
      rangeTrackRef.current.style.right = `${100 - maxPercent}%`;
    }
  };

  useEffect(() => {
    updateTrack();
handleFilter( { minPrice: min, maxPrice: max },
    { resetPage: true } )

  }, [min, max]);

  const handleMinChange = (e) => {
    const value = parseInt(e.target.value);
    if (max - value >= minGap) {
      setMin(value);
    } else {
      setMin(max - minGap);
    }
  };

  const handleMaxChange = (e) => {
    const value = parseInt(e.target.value);
    if (value - min >= minGap) {
      setMax(value);
    } else {
      setMax(min + minGap);
    }
  };

  return (
    <div className="w-[300px] ">
      {/* <h2 className="text-lg font-bold ">PRICE RANGE</h2> */}

      <div className="relative mt-6 h-[18px]">
        {/* Range Inputs */}
        <input
          type="range"
          min="0"
          max={pricelimit}
          value={min}
          onChange={handleMinChange}
          className="absolute w-full appearance-none bg-transparent pointer-events-none z-20
          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-[18px]
          [&::-webkit-slider-thumb]:w-[18px]
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:border-[3px]
          [&::-webkit-slider-thumb]:border-[#bc861a]
          [&::-webkit-slider-thumb]:cursor-pointer"
        />

        <input
          type="range"
          min="0"
          max={pricelimit}
          value={max}
          onChange={handleMaxChange}
          className="absolute w-full appearance-none bg-transparent pointer-events-none z-20
          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-[18px]
          [&::-webkit-slider-thumb]:w-[18px]
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:border-[3px]
          [&::-webkit-slider-thumb]:border-[#bc861a]
          [&::-webkit-slider-thumb]:cursor-pointer"
        />

        {/* Track */}
        <div className="absolute w-full h-2 bg-gray-200 rounded-md top-1/2 -translate-y-1/2">
          <div
            ref={rangeTrackRef}
            className="absolute h-2 bg-gradient-to-r from-[#bc861a] via-[#f1d981] to-[#bc861a]   text-[#292927] rounded-md"
          />
        </div>
      </div>

      {/* Values */}
      <div className="flex justify-between mt-4 text-gray-600">
        <span>Min: ₹{min}</span>
        <span>Max: ₹{max}</span>
      </div>
    </div>
  );
}