import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import Image from 'next/image';
import { FaRupeeSign } from 'react-icons/fa';

export default function MegaMenu({ onClose, category, subcategories }) {
    if (!category || !subcategories?.length) return null;
  
      // const { productsByCategory2, refetchProductsByCategory2 } = useGlobalContext();
const { productsByCategory2, refetchProductsByCategory2 } = useGlobalContext();

const products = productsByCategory2[category._id] || [];

      
//     useEffect(()=>{
//   refetchProductsByCategory2(category._id)
// },[])

useEffect(() => {
  if (!products.length) {
    refetchProductsByCategory2(category._id);
  }
}, [category._id, products.length]);





function formatCategoryLabel(name) {
  return name
  .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '); // e.g., saaj riwaaj → Saaj Riwaaj
}

  return (
    <div className="absolute left-0 pt-[27px]  z-[99] w-full ">
      <div className='  bg-white shadow-lg border-t border-black/20'>
      <div 
      className="px-4 md:px-12 xl:px-24 mx-auto px-8 py-10 grid grid-cols-6 gap-8"
      >
        {/* Categories */}
        <div className="col-span-1 border-r border-black/20">
          <h3 className="uppercase text-[#8b5424] font-semibold text-base mb-2"> Shop By Category</h3>
          <ul className="space-y-2">
            {subcategories.map((sub) => {
              // const categoryPath = `/${formatCategoryPath(category.name)}/${formatCategoryPath(sub.name)}`;
    const categoryLabel = formatCategoryLabel(sub.name);
            return(
              <li key={sub._id} >
                <Link
         href={{
    pathname: `/category/${category.name.toLowerCase().replace(/\s+/g, '-')}/${category._id}`,
    query: {
      subcategory: sub._id,
    },
  }}
         //  href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}/${category._id}`}
                  onClick={onClose}
                  className="text-[15px] hover:text-[#8b5424] hover:translate-x-1 capitalize  transition-all duration-200 inline-block"
                >
                  {categoryLabel.toLowerCase()}
                </Link>
              </li>
            )})}
            <li>
              <Link
                href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}/${category._id}`}
                onClick={onClose}
                className="flex items-center text-[#B67032] font-semibold mt-4 hover:underline"
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Featured Collections */}
         <div className="col-span-5">
          <h3 className="text-sm font-semibold uppercase text-stone-500 mb-4">Featured</h3>
          <div className="grid grid-cols-5 gap-8">
    
          {products.slice(0, 5).map((item, idx) => {

  return (
    <Link
      key={idx}
      href={`/product/${item.name?.toLowerCase().replace(/\s+/g, '-')}/${item._id}`}
      onClick={onClose}
      className="group flex flex-col items-center  overflow-hidden hover:shadow-md transition-shadow"
    >
   <div className="relative w-full h-60 overflow-hidden group">
  <Image
        src={'/Images/category/earrings.webp'}
    // src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.images?.[0]}`}
    alt={item.name || "Product image"}
    fill
    sizes="(max-width: 768px) 100vw, 33vw"
    loading="lazy"
    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
  />
</div>

         <div className="flex items-start justify-start py-4 ">
      <h3 className="montserrat  font-medium text-stone-700 group-hover:text-[#B67032] transition-colors duration-300 capitalize">
  {item.name
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())}
</h3>
                 
               </div> 
    </Link>
  );
})}

          </div>
        </div> 


      </div>
      </div>
    </div>
  );
}
