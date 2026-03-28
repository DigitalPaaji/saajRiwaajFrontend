'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useGlobalContext } from '../context/GlobalContext';

export default function Banner({ title = '', image = '/Images/innerbanner.webp',idc="" }) {
  const [bgImage, setBgImage] = useState('/Images/innerBanner3.webp');
  const searchParams = useSearchParams();
const {subCategoriesMap} = useGlobalContext()
const [subName,setSubname]=useState()

  const subcategory = searchParams.get('subcategory');

  useEffect(() => {
    const updateImage = () => {
      if (window.innerWidth < 768) {
        setBgImage('/banner/desktop/chain.webp');
      } else {
        setBgImage('/banner/desktop/chains.webp');
      }
    };

    updateImage();
    window.addEventListener('resize', updateImage);
    return () => window.removeEventListener('resize', updateImage);
  }, []);
useEffect(()=>{
  if (!subCategoriesMap || !idc || !subcategory) {
    setSubname(null);
    return;
  }

 const cat = subCategoriesMap[idc]?.find(
    (item) => item._id === subcategory
  );

  setSubname(cat || null);
},[subCategoriesMap, idc, subcategory])
  // helpers
  const formatText = (str = '') =>
    str.split('-').join(' ');

  return (
    <div
      className="relative bg-[#292927] text-gray-200 w-full pt-[90px] px-4 md:px-6 lg:px-12 xl:px-24 "
      // style={{
      //   backgroundImage: `url(${bgImage})`,
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      //   backgroundRepeat: 'no-repeat',
      // }}
    >
      {/* Text Content */}
      <div className="relative z-10 py-6">
        {/* <h1 className="text-2xl md:text-xl font-mosetta font-semibold text-[#ffffff] capitalize">
         {formatText(title)}
        </h1> */}

        <div className="text-sm md:text-base  space-x-1">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="capitalize">{formatText(title)}</span>

          {/* 👉 show subcategory only if exists */}
          {subcategory && (
            <>
              <span>/</span>
              <span className="capitalize">{subName?.name}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
