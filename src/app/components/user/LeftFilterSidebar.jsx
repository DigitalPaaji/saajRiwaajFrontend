'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGlobalContext } from '../context/GlobalContext';
import { FaDotCircle ,FaRegCheckSquare } from "react-icons/fa";
import { FaRegSquare } from "react-icons/fa6";
import { FaTag } from "react-icons/fa";

const priceRanges = [
  { label: "Under ₹1000", min: 0, max: 1000 },
  { label: "₹1000 - ₹2500", min: 1000, max: 2500 },
  { label: "₹2500 - ₹5000", min: 2500, max: 5000 },
  { label: "Above ₹5000", min: 5000, max: null }
];

export default function LeftFilterSidebar({minPrice,maxPrice,Pid,subcategory,handleFilter,currentTags}) {
  const { subCategoriesMap, tags } = useGlobalContext();
  const subCategories = subCategoriesMap[Pid] || [];
  const router = useRouter();




const handelChangePrice = (min, max) => {
  handleFilter(
    { minPrice: min, maxPrice: max },
    { resetPage: true } 
  );
};


const   handelSubcatge=(subcategory)=>{
  handleFilter(
    { subcategory: subcategory },
    { resetPage: true }
  );

}
const handelTages=(tag)=>{
 if(tag==currentTags){
 handleFilter(
    { tags: null },
    { resetPage: true }
  );
 }else{
   handleFilter(
    { tags: tag },
    { resetPage: true }
  );
 }
 


}

  const handleClear = () => {
 router.push("?")

  };

  return (
    <aside className="px-2 py-4">
      <div className="flex items-center justify-end lg:justify-between lg:mb-6">
        <h2 className="hidden lg:block text-lg font-semibold text-gray-700">Filters</h2>
        <button onClick={handleClear} className="text-red-500 underline text-sm">
          Clear Filters
        </button>
      </div>

      <div className="space-y-6">

<div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">Price</h3>
      <ul className="space-y-2">
        {priceRanges.map(item => (
          <li key={item.label}>
            <label className="flex items-center gap-2 text-sm cursor-pointer"  onClick={() => handelChangePrice(item.min,item.max)}>
              {/* <input
                type="radio"
              name ={"price"}
              checked={item.min==minPrice && item.max==maxPrice}
                onChange={() => handelChangePrice(item.min,item.max)}
              /> */}

{item.min==minPrice && item.max==maxPrice ? <div className='flex items-center gap-2 text-[#88460c]'>
   <FaRegCheckSquare />  {item.label }
</div>:<> <FaRegSquare />  {item.label }</>}
           
            </label>
          </li>
        ))}
      </ul>
    </div>


      

        {subCategories.length > 0 && (


 <div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">Subcategories</h3>
      <ul className="space-y-2">
        {subCategories?.map(item => (
          <li key={item._id} >
            <div className="flex items-center  gap-2 text-sm cursor-pointer" onClick={() => handelSubcatge(item._id)}>
              {/* <input
                type="radio"
              name ={"subcate"}
                checked={item._id===subcat}
                onChange={() =>{setSubcat(item._id), handelSubcatge(item._id)}}
              /> */}

              {subcategory==item._id ? <div className='flex items-center gap-2  text-[#88460c]'>
                <div className='opacity-0 w-2'></div>
              <FaDotCircle className='text-[10px]' />
          <p>   {item.name} </p> </div> :
              <>
              <FaDotCircle className='text-[10px]' />
          <p>   {item.name} </p> 
              </>
              }

            </div>
          </li>
        ))}
      </ul>
    </div>

       
        )}



 <div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">Tags</h3>
      <ul className="space-y-2">
        {tags.map(item => (
          <li key={item._id}>
            <label className="flex items-center gap-2 text-sm cursor-pointer" onClick={() => handelTages(item._id)}>
              {/* <input
                type="radio"
              name ={"tags"}
              value={item._id}
              checked={item._id==currentTags}
                onChange={() => handelTages(item._id)}
              /> */}
{item._id==currentTags[0] ? <div className='flex items-center gap-2 text-[#88460c]  ' >
    <div className='opacity-0 w-2'></div>
             <FaTag className='text-[10px] ' /> {item.name }


</div> :<><FaTag className='text-[10px] ' /> {item.name }
</> }
            </label>
          </li>
        ))}
      </ul>
    </div>
      
      </div>
    </aside>
  );
}


