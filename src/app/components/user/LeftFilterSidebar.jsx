'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGlobalContext } from '../context/GlobalContext';

const priceRanges = ['Under ₹1000', '₹1000 - ₹2500', '₹2500 - ₹5000', 'Above ₹5000'];

export default function LeftFilterSidebar({ Pid, onFilterChange }) {
  const { subCategoriesMap, tags } = useGlobalContext();
  const subCategories = subCategoriesMap[Pid] || [];

  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedpage, setSelectedpage] = useState(1);

  useEffect(() => {
    const sub = searchParams.getAll('subcategory');
    const tag = searchParams.getAll('tag');
    const price = searchParams.getAll('price');

    setSelectedSubCategories(sub);
    setSelectedTags(tag);
    setSelectedPrices(price);
setSelectedpage(page)
    onFilterChange({
      subCategories: sub,
      tags: tag,
      prices: price,
    });
  }, [Pid, searchParams.toString()]);

  const updateUrl = (subs, tags, prices) => {
    const params = new URLSearchParams();

    subs.forEach(s => params.append('subcategory', s));
    tags.forEach(t => params.append('tag', t));
    prices.forEach(p => params.append('price', p));

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // 🔥 FIXED LOGIC HERE
  const handleChange = (type, value) => {
    let subs = [...selectedSubCategories];
    let tagList = [...selectedTags];
    let prices = [...selectedPrices];

    // ✅ Subcategory stays RADIO (NO CHANGE)
    if (type === 'subcategory') {
      subs = subs.includes(value) ? [] : [value];
      setSelectedSubCategories(subs);
    }

    // ✅ TAGS → MULTI SELECT
    if (type === 'tag') {
      tagList = tagList.includes(value)
        ? tagList.filter(v => v !== value)
        : [...tagList, value];
      setSelectedTags(tagList);
    }

    // ✅ PRICE → MULTI SELECT
    if (type === 'price') {
      prices = prices.includes(value)
        ? prices.filter(v => v !== value)
        : [...prices, value];
      setSelectedPrices(prices);
    }

    updateUrl(subs, tagList, prices);
    onFilterChange({ subCategories: subs, tags: tagList, prices });
  };

  const handleClear = () => {
    setSelectedSubCategories([]);
    setSelectedTags([]);
    setSelectedPrices([]);
    router.push(`?`, { scroll: false });
    onFilterChange({ subCategories: [], tags: [], prices: [] });
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
        <FilterGroup
          title="Price"
          items={priceRanges}
          selectedItems={selectedPrices}
          type="price"
          onChange={handleChange}
        />

        {subCategories.length > 0 && (
          <FilterGroup
            title="Subcategories"
            items={subCategories.map(sub => ({
              label: sub.name,
              value: sub.name.toLowerCase().replace(/\s+/g, '-'),
            }))}
            selectedItems={selectedSubCategories}
            type="subcategory"
            onChange={handleChange}
          />
        )}

        <FilterGroup
          title="Tags"
          items={tags.map(tag => ({ label: tag.name, value: tag._id }))}
          selectedItems={selectedTags}
          type="tag"
          onChange={handleChange}
        />
      </div>
    </aside>
  );
}

function FilterGroup({ title, items, selectedItems, type, onChange }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.value || item}>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.value || item)}
                onChange={() => onChange(type, item.value || item)}
              />
              {item.label || item}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}



// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useGlobalContext } from '../context/GlobalContext';

// const priceRanges = ['Under ₹1000', '₹1000 - ₹2500', '₹2500 - ₹5000', 'Above ₹5000'];

// export default function LeftFilterSidebar({ Pid, onFilterChange }) {
//   const { subCategoriesMap, tags } = useGlobalContext();
//   const subCategories = subCategoriesMap[Pid] || [];

//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const [selectedSubCategories, setSelectedSubCategories] = useState([]);
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [selectedPrices, setSelectedPrices] = useState([]);

//   // 🔥 WATCH QUERY CHANGES
//   useEffect(() => {
//     const sub = searchParams.getAll('subcategory');
//     const tag = searchParams.getAll('tag');
//     const price = searchParams.getAll('price');

//     setSelectedSubCategories(sub);
//     setSelectedTags(tag);
//     setSelectedPrices(price);

//     onFilterChange({
//       subCategories: sub,
//       tags: tag,
//       prices: price,
//     });
//   }, [Pid, searchParams.toString()]); // ✅ Added searchParams.toString()

//   // 🔥 UPDATE URL + STATE
//   const updateUrl = (subs, tags, prices) => {
//     const params = new URLSearchParams();

//     subs.forEach(s => params.append('subcategory', s));
//     tags.forEach(t => params.append('tag', t));
//     prices.forEach(p => params.append('price', p));

//     router.push(`?${params.toString()}`, { scroll: false });
//   };

//   const handleChange = (type, value) => {
//     let subs = [...selectedSubCategories];
//     let tagList = [...selectedTags];
//     let prices = [...selectedPrices];

//     if (type === 'subcategory') {
//       subs = subs.includes(value) ? subs.filter(v => v !== value) : [value]; 
//       // ✅ Only allow 1 subcategory at a time (uncheck current, check new)
//       setSelectedSubCategories(subs);
//     }

//     if (type === 'tag') {
//       tagList = tagList.includes(value) ? tagList.filter(v => v !== value) : [...tagList];
//       setSelectedTags(tagList);
//     }

//     if (type === 'price') {
//       prices = prices.includes(value) ? prices.filter(v => v !== value) : [...prices];
//       setSelectedPrices(prices);
//     }

//     updateUrl(subs, tagList, prices);
//     onFilterChange({ subCategories: subs, tags: tagList, prices });
//   };

//   const handleClear = () => {
//     setSelectedSubCategories([]);
//     setSelectedTags([]);
//     setSelectedPrices([]);
//     router.push(`?`, { scroll: false });
//     onFilterChange({ subCategories: [], tags: [], prices: [] });
//   };

//   return (
//     <aside className="px-2 py-4">
//       <div className="flex items-center justify-end lg:justify-between lg:mb-6">
//         <h2 className="hidden lg:block text-lg font-semibold text-gray-700">Filters</h2>
//         <button onClick={handleClear} className="text-red-500 underline text-sm">
//           Clear Filters
//         </button>
//       </div>

//       <div className="space-y-6">
//         <FilterGroup
//           title="Price"
//           items={priceRanges}
//           selectedItems={selectedPrices}
//           type="price"
//           onChange={handleChange}
//         />

//         {subCategories.length > 0 && (
//           <FilterGroup
//             title="Subcategories"
//             items={subCategories.map(sub => ({
//               label: sub.name,
//               value: sub.name.toLowerCase().replace(/\s+/g, '-'),
//             }))}
//             selectedItems={selectedSubCategories}
//             type="subcategory"
//             onChange={handleChange}
//           />
//         )}

//         <FilterGroup
//           title="Tags"
//           items={tags.map(tag => ({ label: tag.name, value: tag._id }))}
//           selectedItems={selectedTags}
//           type="tag"
//           onChange={handleChange}
//         />
//       </div>
//     </aside>
//   );
// }

// function FilterGroup({ title, items, selectedItems, type, onChange }) {
//   return (
//     <div>
//       <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
//       <ul className="space-y-2">
//         {items.map(item => (
//           <li key={item.value || item}>
//             <label className="flex items-center gap-2 text-sm cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={selectedItems.includes(item.value || item)}
//                 onChange={() => onChange(type, item.value || item)}
//               />
//               {item.label || item}
//             </label>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }




// 'use client';

// import { useState } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { useGlobalContext } from '../context/GlobalContext';

// const priceRanges = ['Under ₹1000', '₹1000 - ₹2500', '₹2500 - ₹5000', 'Above ₹5000'];

// export default function LeftFilterSidebar({ Pid, onFilterChange }) {
//   const { subCategoriesMap, tags } = useGlobalContext();
//   const subCategories = subCategoriesMap[Pid] || [];

//   const [selectedSubCategories, setSelectedSubCategories] = useState([]);
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [selectedPrices, setSelectedPrices] = useState([]);

//   const updateFilters = (updatedSub, updatedTag, updatedPrice) => {
//     onFilterChange({
//       subCategories: updatedSub,
//       tags: updatedTag,
//       prices: updatedPrice,
//     });
//   };

//   const handleChange = (type, value) => {
//     let updatedList;

//     if (type === 'subcategory') {
//       updatedList = selectedSubCategories.includes(value)
//         ? selectedSubCategories.filter(item => item !== value)
//         : [...selectedSubCategories, value];
//       setSelectedSubCategories(updatedList);
//       updateFilters(updatedList, selectedTags, selectedPrices);
//     }

//     if (type === 'tag') {
//       updatedList = selectedTags.includes(value)
//         ? selectedTags.filter(item => item !== value)
//         : [...selectedTags, value];
//       setSelectedTags(updatedList);
//       updateFilters(selectedSubCategories, updatedList, selectedPrices);
//     }

//     if (type === 'price') {
//       updatedList = selectedPrices.includes(value)
//         ? selectedPrices.filter(item => item !== value)
//         : [...selectedPrices, value];
//       setSelectedPrices(updatedList);
//       updateFilters(selectedSubCategories, selectedTags, updatedList);
//     }
//   };

//   const handleClear = () => {
//     setSelectedSubCategories([]);
//     setSelectedTags([]);
//     setSelectedPrices([]);
//     updateFilters([], [], []);
//   };

//   return (
//   <aside
//   className={`
//     px-2 py-4
//   `}
// >
//   <div className="flex items-center justify-end lg:justify-between lg:mb-6">
   
//       <h2 className="hidden lg:block text-lg font-semibold text-gray-700">Filters</h2>
 

//     <button
//       onClick={handleClear}
//       className="text-red-500 underline cursor-pointer transition text-sm"
//     >
//       Clear Filters
//     </button>
//   </div>


//     <div className="space-y-6">
//            <FilterGroup
//         title="Price"
//         items={priceRanges}
//         selectedItems={selectedPrices}
//         type="price"
//         onChange={handleChange}
//       />
//       {subCategories.length > 0 && (
//         <FilterGroup
//           title="Subcategories"
//           items={subCategories.map(sub => sub.name.toUpperCase())}
//           selectedItems={selectedSubCategories}
//           type="subcategory"
//           onChange={handleChange}
//         />
//       )}

//       <FilterGroup
//         title="Tags"
//         items={tags.map(tag => ({ label: tag.name, value: tag._id }))}
//         selectedItems={selectedTags}
//         type="tag"
//         onChange={handleChange}
//       />

 
//     </div>

// </aside>

//   );
// }

// function FilterGroup({ title, items, selectedItems = [], type, onChange }) {
//   return (
//     <div>
//       <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
//  <ul className="space-y-2">
//         {items.map((item) => {
//           const label = typeof item === 'object' ? item.label : item;
//           const value = typeof item === 'object' ? item.value : item;
//           return (
//             <li key={value}>
//               <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   className="accent-black"
//                   checked={selectedItems.includes(value)}
//                   onChange={() => onChange(type, value)}
//                 />
//                 {label}
//               </label>
//             </li>
//           );
//         })}
//       </ul>
//             {/* <ul className="space-y-2">
//         {items.map((item) => (
//           <li key={item}>
//             <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
//               <input
//                 type="checkbox"
//                 className="accent-black"
//                 checked={selectedItems.includes(item)}
//                 onChange={() => onChange(type, item)}
//               />
//               {item}
//             </label>
//           </li>
//         ))}
//       </ul> */}
//     </div>
//   );
// }
