"use client";

import LeftFilterSidebar from "../../../../components/user/LeftFilterSidebar";
import Collection from "../../../../components/user/Collection";
import InnerBanner from "../../../../components/user/InnerBanner";
import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import Filter2 from "../../Filter2";

export default function FilterLayout() {
  const [product, setProducts] = useState([]);
  const [pages, setPages] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { collection, id } = useParams();
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;
  const minPrice = searchParams.get("minPrice") || 0;
  const maxPrice = searchParams.get("maxPrice") || 10000;
  const subcategory = searchParams.get("subcategory");
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

  const fetchProducts = async () => {
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


 useEffect(() => {
    fetchProducts();
  }, [ ]);


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
    <div className="">
      <InnerBanner title={collection} idc={id} image="/Images/banner.webp"  subcategory={subcategory} />

   
<div className="py-4 lg:py-12">
<div className="relative flex gap-6  py-6  px-4 md:px-12 lg:px-24 xl:px-40 2xl:px-52 ">

<aside className="w-full" >


  <Filter2  categoryid={id}  minPrice={minPrice}
              maxPrice={maxPrice} handleFilter={handleFilter} />
</aside>

</div>



      <div className="relative flex gap-6    px-4 md:px-12 lg:px-24 xl:px-40 2xl:px-52 ">
       



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
    
    </div>
  );
}
