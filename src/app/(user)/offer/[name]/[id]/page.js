'use client';

import Collection from '../../../../components/user/OfferProducts';
import Suggestion from '../../../../components/user/AllSuggestion'
import InnerBanner from '../../../../components/user/InnerBanner';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function FilterLayout() {
  const { name, slug, id } = useParams();

  return (
    <div>
      <InnerBanner title={name} image="/Images/banner.webp" />

      <div className="relative px-4 md:px-12 xl:px-24 py-12">
        <main className="flex-1 w-full">
  <Collection offerId={id} />

      <Suggestion />
        </main>
      </div>
    </div>
  );
}
