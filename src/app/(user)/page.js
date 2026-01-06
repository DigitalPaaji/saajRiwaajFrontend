"use client";
import React from "react";
import HeroBanner from "../components/user/HeroBanner";
import BestSellers from "../components/user/BestSellers";
import EditorialSection from "../components/user/EditorialSection";
import Exclusive from "../components/user/Exclusive";
// import EarringsMarquee from "../components/user/Earring";
import Neckwear from "../components/user/Neckwear";
import EaringNew from "../components/user/EaringNew";

export default function Home() {
  return (
    <div className="min-h-screen   text-stone-800 overflow-hidden ">
      {/* <AnnouncementBar /> */}
      {/* <Navbar/> */}
      
      <HeroBanner />
      <EditorialSection />
      <Neckwear />

      <Exclusive />
      <EaringNew />
      {/* <EarringsMarquee /> */}

      <BestSellers />
      {/* <Footer /> */}
    </div>
  );
}
