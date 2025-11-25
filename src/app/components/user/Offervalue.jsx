"use client";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { BiSolidOffer } from "react-icons/bi";
import { IoIosAddCircleOutline } from "react-icons/io";
import Link from "next/link";
import { FaDAndD } from "react-icons/fa";

const Offervalue = ({ cart ,setAppliedOffers}) => {
  const [cartItems, setCartItems] = useState({});
  const [alldata, setAlldata] = useState([]);

  useEffect(() => {
    if (!cart || !Array.isArray(cart)) {
      setCartItems({});
      setAlldata([]);
      setAppliedOffers([]);
      return;
    }

    const grouped = { };
    const offersMap = new Map(); 

 
cart.forEach((item) => {
  if (item.product?.offer) {
    const key = item.product.offer;

    if (!grouped[key]) {
      // quantitySum, priceSum, count
      grouped[key] = [0, 0, 0];
    }

    // Add quantity
    grouped[key][0] += item?.quantity;

    // Add price total (finalPrice * quantity)
    grouped[key][1] += item.product.finalPrice * item?.quantity;

    // Add count
    grouped[key][2] += item?.quantity;
  }
});

// Convert price sum to average
for (const key in grouped) {
  const quantitySum = grouped[key][0];
  const priceSum = grouped[key][1];
  const count = grouped[key][2];

  const avgPrice = priceSum / count;

  grouped[key] = [quantitySum, avgPrice];
}

    setCartItems(grouped);
    setAlldata(Object.entries(grouped));
  }, [cart]);

  const handleOfferUpdate = useCallback((offerData, index) => {
    setAppliedOffers(prev => {
      const newOffers = [...prev];
      newOffers[index] = offerData;
      return newOffers;
    });
  }, []);

  return (

    <div className="p-4">
      {alldata.length > 0 ? (
        alldata.map((entry, index) => (
          <GetAlloffer 
            key={entry[0]} 
            item={entry} 
            cartItems={cartItems} 
            index={index}
            onOfferUpdate={handleOfferUpdate}
          />
        ))
      ) : (
        <div className="text-gray-500">No offers available</div>
      )}
    </div>
  );
};

const GetAlloffer = ({ item, index, onOfferUpdate }) => {
  
  const [offer, setOffer] = useState(null);
  const [offerApplied, setOfferApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOffer = useCallback(async () => {
    if (!item || !item[0]) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/offer/byid/${item[0]}`
      );

      const data = response.data;
      setOffer(data);

      // Check if offer conditions are met
      const isApplied = data.minquantity <= item[1][0];
      setOfferApplied(isApplied);

      if (isApplied) {
        const offerData = {
          multiple: Math.floor(item[1][0] / data.minquantity),
          price: data.price,
          offerquentity: data.minquantity,
          applide: true,
          subprice:item[1][1] 
        };
        onOfferUpdate(offerData, index);
      } else {
        onOfferUpdate(null, index);
      }
    } catch (error) {
      console.error("Error fetching offer:", error);
      setOffer(null);
      onOfferUpdate(null, index);
    } finally {
      setLoading(false);
    }
  }, [item, index, onOfferUpdate]);

  useEffect(() => {
    fetchOffer();
  }, [fetchOffer]);

  useEffect(() => {
    if (offer && item) {
      const isApplied = offer.minquantity <= item[1][0];
      setOfferApplied(isApplied);

      if (isApplied) {
        const offerData = {
          multiple: Math.floor(item[1][0] / offer.minquantity),
          price: offer.price,
          offerquentity: offer.minquantity,
          applide: true,
          subprice: item[1][1]
        };
        onOfferUpdate(offerData, index);
      } else {
        onOfferUpdate(null, index);
      }
    }
  }, [item, offer, index, onOfferUpdate]);

  if (loading) {
    return (
      <div className="mb-2 text-gray-500">
        Loading offer...
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="mb-2 text-red-500">
        Offer not available
      </div>
    );
  }

  return (
  <div className="mb-2">
  {offerApplied ? (
    <div className="text-green-600 flex items-center gap-1">
      <BiSolidOffer /> Bucket filled! You unlocked the, {offer.title}  Offer
      {/* <span className="text-xs ml-2">
        (Buy {offer.minquantity} for {offer.price})
      </span> */}
    </div>
  ) : (
    <div className="flex items-center gap-1 ">
     <span><IoIosAddCircleOutline className="text-red-600" /></span> 

      {(() => {
        const remaining = offer.minquantity - item[1][0];
        const isSingle = remaining === 1;

        return (
          <>
            <Link
              href={`/offer/${offer.slug}/${offer._id}`}
              className=" ml-1"
            >
              Bucket is filling add <span className="text-red-600">{remaining}</span>{" "}
              {isSingle ? "more item" : "more items"}  to unlock the offer.
          

           
            </Link>
          </>
        );
      })()}
    </div>
  )}
</div>

  );
};

export default Offervalue;