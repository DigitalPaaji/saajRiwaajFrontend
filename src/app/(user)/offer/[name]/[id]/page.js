'use client';

import Collection from '../../../../components/user/OfferProducts';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import Banner from '../../../../components/user/OtherBanner';

export default function FilterLayout() {
  const { name, slug, id } = useParams();

  return (
    <div>
       <Suspense fallback={null}>
      
            <Banner title={`${name.split("-").join(" ")}`} />
           </Suspense>

      <div className="relative px-4 md:px-12 xl:px-24 py-12">
        <main className="flex-1 w-full">
  <Collection offerId={id} />

      {/* <Suggestion /> */}
        </main>
      </div>
    </div>
  );
}
