


"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { base_url } from '../store/utile'

const Offervalue = ({cartItems,setDiscountPrice}) => {
const [alldata, setAlldata] = useState([]);

const [newData,setNewData]=useState([ ])


const fetchOffer= async()=>{
  try {
    const response = await axios.get(`${base_url}/offer/all`)
    const data = await response.data;
  
    setAlldata(data)
  } catch (error) {
    setAlldata([ ])
  }
}

useEffect(()=>{
  fetchOffer()
},[ ])







const makeLogic = () => {

  if (!alldata.length || !cartItems.length) return;


 const grouped = { };


   cartItems.forEach((item) => {
   if (item.product?.offer) {
    const key = item.product.offer;
     


    if (!grouped[key]) {
    
    grouped[key] = [0, 0, 0];
     }

  
     grouped[key][0] += item?.quantity;

    // // Add price total (finalPrice * quantity)
     grouped[key][1] += item.product.finalPrice * item?.quantity;

    //  // Add count
    grouped[key][2] += item?.quantity;
   }
 });
for (const key in grouped) {
  const quantitySum = grouped[key][0];
  const priceSum = grouped[key][1];
  const count = grouped[key][2];

  const avgPrice = priceSum / count;

  grouped[key] = [quantitySum, avgPrice];
}

  
    setNewData(Object.entries(grouped));

};

useEffect(()=>{

 makeLogic()

},[alldata,cartItems])





const secondLogic = () => {
  let totalDiscount = 0;

  newData.forEach((item) => {
    const offer = alldata.find((of) => of._id == item[0]);
    if (!offer) return;

    const totalQty = item[1][0];     // total quantity
    const avgPrice = item[1][1];     // avg price

    const groups = Math.floor(totalQty / offer.minquantity);

    if (groups <= 0) return;

  
    const actualPrice = groups * offer.minquantity * avgPrice;

    
    const offerPrice = groups * offer.price;

    
    const discount = actualPrice - offerPrice;

    totalDiscount += discount;
  });



  setDiscountPrice(totalDiscount);
};
useEffect(()=>{

newData.length > 0 && secondLogic ()


},[newData])
  return (
    <div>




    </div>
  )
}

export default Offervalue
