"use client"
import React, { useState } from 'react'
import AddressCompo from './AddressCompo'
import ProductCompo from './ProductCompo'
import { useDispatch, useSelector } from 'react-redux'
import { addSlide } from '@/app/components/store/sliderSlice'
import { base_url } from '@/app/components/store/utile'
import axios from 'axios'

const page = () => {
  const { user } = useSelector(state=>state.user)
  const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.cart.items);
  
  const [addressData, setAddressData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      pincode: "",
      city: "",
      state: "",
      country: "India",
      addressLine: ""
    }
  });



const handelCheckout= async(finalAmount)=>{

if(!user){
  dispatch(addSlide("login"))
  return

}


      const { name, email, phone,address } = addressData;
      


handlePayOnline(finalAmount)

 
}

const handlePayOnline = async (finalAmount) => {
  // if(addressData.phone.length <10 || addressData.phone.length >12){
  //   return 
  // }



  const orderRes = await fetch(`${base_url}/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      amount:finalAmount,
      type: "ONLINE",
      items: cartItems.map((c) => ({
        product: c?.product?._id,
        quantity: c?.quantity,
        price: c.price,
        color:c?.color
      })),
      shippingAddress: addressData,
      paymentMethod: "ONLINE",
    }),
  });

  const order = await orderRes.json();

  
 console.log(order,"firsttt")
  const ppRes = await fetch(`${base_url}/order/phonepe/pay`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    orderId: order?.productOrder?._id,
    amount:finalAmount,
    userId: order.userId,
  }),
});

const data = await ppRes.json();
 console.log(data,"seconddqqqqq")


if (data.tokenUrl) {
   openPhonePePayPage(data.tokenUrl,order.productOrder._id)

}else {
    alert("Failed to start payment!");
  }
};










async function openPhonePePayPage(tokenUrl, orderId) {
  try {
    await loadPhonePeScript(); 
   console.log(tokenUrl,"firdstal")
  
    window.PhonePeCheckout.transact({
      tokenUrl,
      type: "IFRAME",
      callback: async function (response) {
      
        if (response === "USER_CANCEL") {
          alert("Payment cancelled by user");
        } else if (response === "CONCLUDED") {
          const statusRes = await axios.post(
            `${base_url}/order/phonepe/status/${orderId}`,{
              buytype:  "cart"
            }
          );

          const newResponse = await statusRes.data;
   
          if (newResponse.success) {
if (typeof window !== "undefined" && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: finalAmount,
      currency: 'INR',
      content_type: 'product'
    });
  }
setshowPopUp(true)

          } else {
              Swal.fire({
                 title: "Oops...",
  text: data.message,
  icon: "error",
  draggable: true                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
});
location.reload()
          }
        }
      },
    });
  } catch (err) {
    console.error("Error opening PhonePe PayPage:", err);
  }
}
function loadPhonePeScript() {
  return new Promise((resolve, reject) => {
    if (window.PhonePeCheckout) return resolve();
    const script = document.createElement("script");
    script.src = "https://mercury.phonepe.com/web/bundle/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject("Failed to load PhonePe script");
    document.body.appendChild(script);
  });
}




  return (
    <div className='flex min-h-screen  container mx-auto gap-3'>
        <div className='w-4/6 '>
<AddressCompo  setAddressData={setAddressData} addressData={addressData} />

        </div>


 <div className='w-2/6 '>
<ProductCompo  handelCheckout={handelCheckout} />
</div>
    </div>
  )
}

export default page