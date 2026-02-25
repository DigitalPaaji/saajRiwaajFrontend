// EarringsMarquee.tsx  (NO "use client")

import EarringsSlider from "./EarringsSlider";

async function getProducts(categoryId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_PORT}/product/category/${categoryId}?page=1`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function EarringsMarquee() {
  const earringsCategoryId = "693bbd83430ea8120089b2c1";
  const data = await getProducts(earringsCategoryId);

  if (!data?.products?.length) return null;

  return (
    <EarringsSlider
      products={data.products}
      categoryId={earringsCategoryId}
    />
  );
}