"use client"
import React, { Suspense, useState } from 'react'
import AddressCompo from '../checkout/AddressCompo'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation'; // <-- ADDED useRouter
import ProductCompo from './ProductCompo';
import { addSlide } from '@/app/components/store/sliderSlice';
import { base_url } from '@/app/components/store/utile';
import Swal from 'sweetalert2';
import axios from 'axios'; // <-- ADDED to prevent reference error
import Image from 'next/image'; // <-- ADDED to prevent reference error

const Page = () => { // Changed 'page' to 'Page' for standard React component naming
  const { user } = useSelector((state) => state.user);
  const [showPopup, setShowPopUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  
  const params = useSearchParams();
  const router = useRouter(); // <-- INITIALIZED router
  
  const [fullPrice, setFullPrice] = useState(0);
  const color = params.get("color");
  const product = params.get("product");
  const quantity = Number(params.get("quantity")) || 1;

  const [addressData, setAddressData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      pincode: "",
      city: "",
      state: "",
      country: "India",
      addressLine: "",
    },
  });

  const handelCheckout = async (finalAmount) => {
    if (!user) {
      dispatch(addSlide("login"));
      return;
    }

    const { name, email, phone, address } = addressData;
    if (!name || !email || !phone || !address.pincode || !address.addressLine) {
      Swal.fire({
        title: "Missing Info",
        text: "Please fill in all the required address details.",
        icon: "warning",
      });
      return;
    }

    setIsLoading(true);
    try {
      await handlePayOnline(finalAmount);
    } catch (error) {
      Swal.fire("Error", "Something went wrong during checkout.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayOnline = async (finalAmount) => {
    try {
      // 1. Create Order
      const orderRes = await fetch(`${base_url}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount: finalAmount,
          type: "ONLINE",
          items: [{
            product: product,
            quantity: quantity,
            price: fullPrice,
            color: color,
          }],
          shippingAddress: addressData,
          paymentMethod: "ONLINE",
        }),
      });

      const order = await orderRes.json();
      if (!order?.productOrder?._id) throw new Error("Failed to create order");

      // 2. Init PhonePe
      const ppRes = await fetch(`${base_url}/order/phonepe/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          orderId: order.productOrder._id,
          amount: finalAmount,
          userId: order.userId,
        }),
      });

      const data = await ppRes.json();

      if (data.tokenUrl) {
        await openPhonePePayPage(data.tokenUrl, order.productOrder._id, finalAmount);
      } else {
        Swal.fire("Error", "Failed to start payment process!", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Network or server error occurred.", "error");
    }
  };
 
  const openPhonePePayPage = async (tokenUrl, orderId, finalAmount) => {
    try {
      await loadPhonePeScript();

      window.PhonePeCheckout.transact({
        tokenUrl,
        type: "IFRAME",
        callback: async function (response) {
          if (response === "USER_CANCEL") {
            Swal.fire("Cancelled", "Payment cancelled by user", "info");
          } else if (response === "CONCLUDED") {
            
            // Verify payment status with backend
            const statusRes = await axios.post(
              `${base_url}/order/phonepe/status/${orderId}?buytype="buy`);

            if (statusRes.data.success) {
              // Trigger FB Pixel
              if (typeof window !== "undefined" && window.fbq) {
                window.fbq("track", "Purchase", {
                  value: finalAmount, 
                  currency: "INR",
                  content_type: "product",
                });
              }
              
              // Show success popup
              setShowPopUp(true);
              
              // <-- ADDED REDIRECT LOGIC -->
              // Wait 2.5 seconds so the user can see the success popup, then redirect to "/"
              setTimeout(() => {
                router.push('/');
              }, 2500); 

            } else {
              Swal.fire("Payment Failed", statusRes.data.message || "Payment verification failed.", "error");
            }
          }
        },
      });
    } catch (err) {
      console.error("Error opening PhonePe PayPage:", err);
      Swal.fire("Error", "Could not load payment gateway.", "error");
    }
  };

  const loadPhonePeScript = () => {
    return new Promise((resolve, reject) => {
      if (window.PhonePeCheckout) return resolve();
      const script = document.createElement("script");
      script.src = "https://mercury.phonepe.com/web/bundle/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject("Failed to load PhonePe script");
      document.body.appendChild(script);
    });
  };

  if (showPopup) {
    return (
      <div className="z-[999] bg-black/60 fixed top-0 left-0 w-full h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-4 text-center bg-[#faf8ea] p-8 rounded-lg shadow-xl max-w-sm w-full mx-4">
          <Image
            src="/Images/success.gif"
            alt="Success"
            width={200}
            height={200}
            className="w-40 h-40 object-contain"
          />
          <h3 className="text-green-600 text-2xl font-mosetta font-medium">
            Order placed successfully! 🎉
          </h3>
          <p className="text-sm text-gray-500">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen container mx-auto gap-6 p-4">
      <div className="md:w-4/6">
        <AddressCompo setAddressData={setAddressData} addressData={addressData} />
      </div>

      <div className="md:w-2/6">
        <Suspense fallback={""}>
          <ProductCompo 
            productid={product}  
            quantity={quantity} 
            colorid={color}  
            handelCheckout={handelCheckout} 
            isLoading={isLoading} 
            setFullPrice={setFullPrice}  
          />
        </Suspense>
      </div>
    </div>
  )
}

export default Page