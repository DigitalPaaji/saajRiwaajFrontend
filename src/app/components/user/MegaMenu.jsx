import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import { getOptimizedImage } from '../utils/cloudinary';
import Image from 'next/image';

export default function MegaMenu({ onClose, category, subcategories }) {
    if (!category || !subcategories?.length) return null;
  
      const { productsByCategory, refetchProductsByCategory } = useGlobalContext();
    useEffect(()=>{
  refetchProductsByCategory(category._id)
},[])




function formatCategoryLabel(name) {
  return name
  .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '); // e.g., saaj riwaaj → Saaj Riwaaj
}

  return (
    <div className="absolute top- left-0 z-[99] pt-[28px] w-full">
      <div className=' w-full bg-[#faf8ea] shadow-lg border-t animate-[fadeIn_0.3s_ease-out]'>
      <div className="max-w-screen-2xl mx-auto px-8 py-10 grid grid-cols-4 gap-8">
        {/* Categories */}
        <div className="col-span-1">
          <h3 className="text-sm font-semibold uppercase text-stone-500 mb-4"> Shop By Category</h3>
          <ul className="space-y-3">
            {subcategories.map((sub) => {
              // const categoryPath = `/${formatCategoryPath(category.name)}/${formatCategoryPath(sub.name)}`;
    const categoryLabel = formatCategoryLabel(sub.name);
            return(
              <li key={sub._id} >
                <Link
         href={{
    pathname: `/category/${category.name.toLowerCase().replace(/\s+/g, '-')}/${category._id}`,
    query: {
      subcategory: sub.name.toLowerCase().replace(/\s+/g, '-'),
    },
  }}
         //  href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}/${category._id}`}
                  onClick={onClose}
                  className="hover:text-[#B67032] hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  {categoryLabel}
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
        <div className="col-span-3">
          <h3 className="text-sm font-semibold uppercase text-stone-500 mb-4">Featured</h3>
          <div className="grid grid-cols-5 gap-8">
          {productsByCategory.slice(0, 5).map((item, idx) => {
  // const categoryPath = item?.category?.name?.toLowerCase().replace(/\s+/g, '-') || 'category';
  // const subcategoryPath = item.subcategory?.name?.toLowerCase().replace(/\s+/g, '-') || 'subcategory';
  // const productPath = `${categoryPath}/${subcategoryPath}`;

  return (
    <Link
      key={idx}
      href={`/product/${item.name?.toLowerCase().replace(/\s+/g, '-')}/${item._id}`}
      onClick={onClose}
      className="group flex flex-col items-center bg-stone-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
   <div className="relative w-full h-60 overflow-hidden group">
  <Image
    src={`https://api.saajriwaaj.com/uploads/${item.images?.[0]}`}
    alt={item.name || "Product image"}
    fill
    sizes="(max-width: 768px) 100vw, 33vw"
    loading="lazy"
    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
  />
</div>
      <div className="p-4 flex-1">
        <h4 className="font-semibold text-stone-800 group-hover:text-[#B67032] transition-colors">
          {item.name}
        </h4>
        {item.description?.paragraphs?.[0] && (
                      <p className="text-sm text-stone-600">
                        {item.description.paragraphs[0].split(" ").slice(0, 10).join(" ")}...
                      </p>
                    )}
    
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
