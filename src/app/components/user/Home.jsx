"use client";
import React from "react";
import HeroBanner from "./HeroBanner";
import BestSellers from "./BestSellers";
import EditorialSection from "./EditorialSection";
import Exclusive from "./Exclusive";
import EarringsMarquee from "./Earring";
import Neckwear from "./Neckwear";
import Image from "next/image";
export default function Home() {
  return (
    <div className="min-h-screen   text-stone-800 overflow-hidden ">
      {/* <AnnouncementBar /> */}
      {/* <Navbar/> */}
      
      <HeroBanner />
      <EditorialSection />
      <EarringsMarquee />
      <Exclusive />
      <Neckwear />
      <BestSellers />
      {/* <Footer /> */}
    </div>
  );
}
