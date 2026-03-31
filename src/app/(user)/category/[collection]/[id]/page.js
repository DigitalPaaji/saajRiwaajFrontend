"use client";

import LeftFilterSidebar from "../../../../components/user/LeftFilterSidebar";
import Collection from "../../../../components/user/Collection";
import InnerBanner from "../../../../components/user/InnerBanner";
import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

export default function FilterLayout() {
  const [product, setProducts] = useState([]);
  const [pages, setPages] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { collection, id } = useParams();
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;
  const minPrice = searchParams.getAll("minPrice");
  const maxPrice = searchParams.getAll("maxPrice");
  const subcategory = searchParams.getAll("subcategory");
  const tags = searchParams.getAll("tags");

  const route = useRouter();

  const buildQuery = () => {
    const params = new URLSearchParams();

    params.set("page", page);

    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (subcategory) params.set("subcategory", subcategory);

    if (tags.length > 0) {
      tags.forEach((tag) => params.append("tags", tag));
    }

    return params.toString();
  };

  const fetchProducts = async (filters) => {
    try {
      setLoading(true);
      const queryString = buildQuery();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/product/category/${id}?${queryString}`,
      );
      const data = await res.json();

      setProducts(data.products);
      setPages(data.pagination);
    } catch (err) {
      console.error("Error fetching products by category:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [searchParams.toString(), id]);

  const handleFilter = (filterData = {}, options = { resetPage: true }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (options.resetPage) {
      params.set("page", "1");
    }

    Object.entries(filterData).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        // remove filter
        params.delete(key);
      } else if (Array.isArray(value)) {
        // replace multi filters (tags)
        params.delete(key);
        value.forEach((v) => params.append(key, v));
      } else {
        // replace single filter
        params.set(key, value);
      }
    });

    route.push(`?${params.toString()}`);
    setIsFilterOpen(false);
  };

  return (
    <div>
      <InnerBanner title={collection} idc={id} image="/Images/banner.webp" />

      {/* Floating filter button (mobile only) */}
<button
  onClick={() => setIsFilterOpen(true)}
  className="fixed  bottom-6 left-1/2 rounded-md -translate-x-1/2 z-40 flex items-center text-white hover:text-[#292927] border bg-[#292927] hover:bg-white vborder-white hover:border-[#292927] px-4 py-2 gap-3 shadow-lg"
>
 Filter <SlidersHorizontal size={20} />
</button>

      <div className="relative flex gap-6  py-12 px-4 md:px-12 lg:px-24 xl:px-40 2xl:px-52 ">
        <aside className="hidden  w-64 sticky top-24 h-fit">
          <Suspense fallback={null}>
            <LeftFilterSidebar
              subcategory={subcategory}
              Pid={id}
              currentTags={tags}
              minPrice={minPrice}
              maxPrice={maxPrice}
              handleFilter={handleFilter}
            />
          </Suspense>
        </aside> 

        {/* ================= MOBILE FILTER LAYER ================= */}
        <div
          className={`fixed inset-0 z-50  ${
            isFilterOpen ? "visible" : "invisible"
          }`}
        >
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity ${
              isFilterOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setIsFilterOpen(false)}
          />

      <div
  className={`
    fixed top-0 left-0 
    h-full w-72 
    bg-white shadow-xl 
    transform transition-transform duration-300 z-50
    ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
  `}
>
  {/* Drag Handle (optional) */}
  <div className="flex justify-center py-3">
    <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
  </div>

  {/* Header */}
  <div className="flex items-center justify-between px-4 py-3">
    <h3 className="text-lg font-semibold">Filters</h3>
    <button onClick={() => setIsFilterOpen(false)}>
      <X size={22} />
    </button>
  </div>

  {/* Content */}
  <div className="overflow-y-auto h-[calc(100vh-80px)] px-2">
    <Suspense fallback={null}>
      <LeftFilterSidebar
        subcategory={subcategory}
        Pid={id}
        currentTags={tags}
        minPrice={minPrice}
        maxPrice={maxPrice}
        handleFilter={handleFilter}
      />
    </Suspense>
  </div>
</div>
          {/* <div
            className={`
      absolute bottom-0 left-0 right-0
      bg-white rounded-t-2xl shadow-xl
      h-[70vh]
      transform transition-transform duration-300
      ${isFilterOpen ? "translate-x-0" : "translate-x-full"}
    `}
          >
            <div className="flex justify-center py-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={() => setIsFilterOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <div className="overflow-y-auto h-[calc(70vh-56px)] px-2">
              <Suspense fallback={null}>
                <LeftFilterSidebar
                  subcategory={subcategory}
                  Pid={id}
                  currentTags={tags}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  handleFilter={handleFilter}
                />
              </Suspense>
            </div>
          </div> */}
        </div>

        <main className="flex-1 w-full">
          <Collection
            product={product}
            pages={pages}
            loading={loading}
            fetchProducts={handleFilter}
          />
        </main>
      </div>
    </div>
  );
}
