'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Banner({ title = '', image = '/Images/innerbanner.webp' }) {
  const [bgImage, setBgImage] = useState('/Images/innerBanner3.webp');
  const searchParams = useSearchParams();

  // ✅ get subcategory from URL
  const subcategory = searchParams.get('subcategory');

  useEffect(() => {
    const updateImage = () => {
      if (window.innerWidth < 768) {
        setBgImage('/Images/image.png');
      } else {
        setBgImage('/Images/innerBanner3.webp');
      }
    };

    updateImage();
    window.addEventListener('resize', updateImage);
    return () => window.removeEventListener('resize', updateImage);
  }, []);

  // helpers
  const formatText = (str = '') =>
    str.split('-').join(' ');

  return (
    <div
      className="relative w-full h-[250px] md:h-[400px] flex items-center justify-center text-[#B67032]"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Text Content */}
      <div className="relative z-10 text-center px-4">
        {/* ✅ Title */}
        <h1 className="text-2xl md:text-4xl font-mosetta font-semibold text-[#461412] capitalize">
         {formatText(title)}
        </h1>

        {/* ✅ Breadcrumb */}
        <div className="mt-2 text-sm md:text-base text-gray-800 space-x-1">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="capitalize">{formatText(title)}</span>

          {/* 👉 show subcategory only if exists */}
          {subcategory && (
            <>
              <span>/</span>
              <span className="capitalize">{formatText(subcategory)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
