'use client';

import Link from 'next/link';

export default function Banner({ title = '', image = '' }) {
  return (
    <div
      className="bgBanner relative w-full h-[250px] md:h-[400px] flex items-center justify-center  text-[#B67032]  bg-[#b6703234]"
      // style={{
      //   backgroundImage: `url(${image})`,
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      //   backgroundRepeat: 'no-repeat',
      // }}
    >
      {/* Text Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-2xl md:text-4xl font-mosetta font-medium text-[#99571d]  capitalize">  {title.split('-').join(' ')}</h1>
        <div className="mt-2 text-sm md:text-base text-gray-800 space-x-1">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span className="capitalize">{title}</span>
        </div>
      </div>
    </div>
  );
}
