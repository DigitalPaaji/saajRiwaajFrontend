// NO "use client"

import HeroSlider from "./HeroSlider";

async function getBanners() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_PORT}/banner`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function HeroBanner() {
  const banners = await getBanners();

  if (!banners?.length) return null;

  return <HeroSlider banners={banners} />;
}