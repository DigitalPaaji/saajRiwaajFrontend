'use client';

import LeftFilterSidebar from '../../../../components/user/LeftFilterSidebar';
import Collection from '../../../../components/user/Collection';
import InnerBanner from '../../../../components/user/InnerBanner';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function FilterLayout() {
 
  const [filters, setFilters] = useState({
    subCategories: [],
    tags: [],
    prices: [],
  });
  const { collection, id } = useParams();

  return (
    <div>
      <InnerBanner title={collection} image="/Images/banner.webp" />
      <div className="relative flex flex-wrap-reverse lg:flex-nowrap gap-6 px-4 md:px-12 xl:px-24 py-12">
                  <div className='w-full md:w-64'>
          <LeftFilterSidebar
       
            Pid={id}
            onFilterChange={setFilters}
          />
        </div>
   
     <main className="flex-1 w-full">
          <Collection Pid={id} filters={filters} />
        </main>
      
      </div>
    </div>
  );
}
