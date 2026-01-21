'use client';

import LeftFilterSidebar from '../../../../components/user/LeftFilterSidebar';
import Collection from '../../../../components/user/Collection';
import InnerBanner from '../../../../components/user/InnerBanner';
import { Suspense, useState } from 'react';
import { useParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';

export default function FilterLayout() {
 
  const [filters, setFilters] = useState({
    subCategories: [],
    tags: [],
    prices: [],
  
  });
  const { collection, id } = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  return (
    <div>
      <InnerBanner title={collection} image="/Images/banner.webp" />
     
     
      {/* Floating filter button (mobile only) */}
      <button
        onClick={() => setIsFilterOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-40 bg-[#88460c] text-white p-4 rounded-full shadow-lg"
      >
        <SlidersHorizontal size={20} />
      </button>


      <div className="relative flex gap-6 px-4 md:px-12 xl:px-24 py-12">
              <aside className="hidden lg:block w-64 sticky top-24 h-fit">
              <Suspense fallback={null}>

          <LeftFilterSidebar Pid={id} onFilterChange={setFilters} />
                </Suspense>
        </aside>
              
    {/* ================= MOBILE FILTER LAYER ================= */}
  <div
  className={`fixed inset-0 z-50 lg:hidden ${
    isFilterOpen ? 'visible' : 'invisible'
  }`}
>
  {/* Overlay */}
  <div
    className={`absolute inset-0 bg-black/40 transition-opacity ${
      isFilterOpen ? 'opacity-100' : 'opacity-0'
    }`}
    onClick={() => setIsFilterOpen(false)}
  />

  {/* Bottom Sheet */}
  <div
    className={`
      absolute bottom-0 left-0 right-0
      bg-white rounded-t-2xl shadow-xl
      h-[70vh]
      transform transition-transform duration-300
      ${isFilterOpen ? 'translate-y-0' : 'translate-y-full'}
    `}
  >
    {/* Drag handle */}
    <div className="flex justify-center py-2">
      <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
    </div>

    {/* Header */}
    <div className="flex items-center justify-between px-4 py-3 border-b">
      <h3 className="text-lg font-semibold">Filters</h3>
      <button onClick={() => setIsFilterOpen(false)}>
        <X size={22} />
      </button>
    </div>

    {/* Content */}
    <div className="overflow-y-auto h-[calc(70vh-56px)] px-2">
      <Suspense fallback={null}>

      <LeftFilterSidebar Pid={id} onFilterChange={setFilters} />
      </Suspense>
    </div>
  </div>
</div>

     <main className="flex-1 w-full">
          <Collection Pid={id} filters={filters} />
        </main>
      
      </div>
    </div>
  );
}
