"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Collection from "@/app/components/user/Collection";
import InnerBanner from "@/app/components/user/OtherBanner";


// --- SAMPLE DATA FOR LAYOUT PART ---
const SAMPLE_PRODUCTS = [
  {
    _id: "s1",
    name: "Classic Gold Necklace",
    price: 5000,
    finalPrice: 4500,
    rating: 4.5,
    reviewCount: 12,
    images: ["sample1.webp"],
    outofstock: false,
    colorVariants: [{ _id: "c1" }]
  },
  {
    _id: "s2",
    name: "Diamond Stud Earrings",
    price: 3000,
    finalPrice: 2800,
    rating: 5,
    reviewCount: 8,
    images: ["sample2.webp"],
    outofstock: false,
    colorVariants: [{ _id: "c2" }]
  },
  {
    _id: "s3",
    name: "Royal Polki Bangle",
    price: 8000,
    finalPrice: 7200,
    rating: 4,
    reviewCount: 15,
    images: ["sample3.webp"],
    outofstock: true,
    colorVariants: [{ _id: "c3" }]
  },
  {
    _id: "s4",
    name: "Silver Anklet Set",
    price: 1500,
    finalPrice: 1200,
    rating: 3.5,
    reviewCount: 22,
    images: ["sample4.webp"],
    outofstock: false,
    colorVariants: [{ _id: "c4" }]
  }
];

export default function FilterLayout() {
  const [product, setProducts] = useState([ ] );
  const [pages, setPages] = useState({ page: 1, pages: 1 });
  const {  id } = useParams();
  const [loading, setLoading] = useState(false);
  
  const route = useRouter();
  const searchParams = useSearchParams();
  
  const page = searchParams.get("page") || 1;
  const minPrice = searchParams.get("minPrice") || 0;
  const maxPrice = searchParams.get("maxPrice") || 10000;
//   const subcategory = searchParams.get("subcategory");

  const fetchProducts = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/tag/product/${id}?${searchParams.toString()}`
      );
      const data = await res.json();
      if (data.products?.length > 0) {
        setProducts(data.products);
        setPages(data.pagination);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams.toString(), id]);

  const handleFilter = (filterData = {}, options = { resetPage: true }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (options.resetPage) params.set("page", "1");

    Object.entries(filterData).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else if (Array.isArray(value)) {
        params.delete(key);
        value.forEach((v) => params.append(key, v));
      } else params.set(key, value);
    });

    route.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white min-h-screen">
      <InnerBanner title={'Shop By Occassion'} />


      {/* Product Grid Section */}
      <div className="py-8 px-4 md:px-12 lg:px-24 xl:px-40 2xl:px-52">
        <main className="w-full">
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
