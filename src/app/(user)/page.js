"use client";
import React from "react";
import Neckwear2 from "../components/newHome/Neckwear";
import Exclusive2 from "../components/newHome/Exclusive";
import Banner from "../components/newHome/Banner";
import Navbar from "../components/newHome/Navbar";
import Offer from '../components/newHome/Offer';
import Category from '../components/newHome/Category';
import BestSeller from '../components/newHome/BestSeller';
import Trust from '../components/newHome/Trust';

import HeroBanner from "../components/user/HeroBanner";
import BestSellers from "../components/user/BestSellers";
import EditorialSection from "../components/user/EditorialSection";
import Exclusive from "../components/user/Exclusive";
import Neckwear from "../components/user/Neckwear";
import EaringNew from "../components/user/EaringNew";
import TrustSection from "../components/user/TrustSection";

export default function Home() {
  return (
    <div className="min-h-screen   text-stone-800 overflow-hidden ">
       {/* <Offer/> */}
      <Navbar/>
      <Banner/> 
      {/* <HeroBanner /> */}
      <Trust/>

      <Category/>
      <Neckwear2 />
      <Exclusive2 />
      <BestSeller/>
      {/* <HeroBanner />
      <EditorialSection />
      <EaringNew />
      <Exclusive />
      <Neckwear /> 
      <BestSellers />
      <TrustSection />*/}
    </div>
  );
}
