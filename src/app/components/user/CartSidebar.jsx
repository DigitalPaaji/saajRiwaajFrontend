"use client";
import { useGlobalContext } from "../context/GlobalContext";
import { ChartColumnBig, X } from "lucide-react";
import Image from "next/image";
import { React, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import CheckoutSidebar from "./CheckoutSidebar";
import Link from "next/link";
import Offervalue from "./Offervalue";
import axios from "axios";
axios.defaults.withCredentials=true

export default function CartSidebar() {
  const { isCartOpen, setIsCartOpen, updateQty,setAllCart } =
    useGlobalContext();
    const [cart,setCart]=useState()
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
const [removeamount,setAppliedOffers]=useState([])
const [showoffer,setShowOffer]= useState(true)


  const handleApplyCoupon = async () => {
    const code = coupon.trim();
    if (!code) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/${process.env.NEXT_PUBLIC_LOCAL_PORT}/coupon/${code}`
      );
      const data = await res.json();

      if (res.ok && data.valid) {
        setAppliedCoupon(code);
        setDiscountPercent(data.discountPercent);
      } else {
        setAppliedCoupon("");
        setDiscountPercent(0);
        toast.error(data.message || "Invalid coupon code");
      }
    } catch (err) {
      toast.error("Failed to validate coupon");
    }
  };
 

   let subAmount=   removeamount.filter((item)=>item)?.reduce((acc,dec)=>acc+ (dec.multiple*dec.price) - (dec.multiple*dec.offerquentity * dec.subprice),0)



  const total = Math.round( cart?.reduce((acc, item) => acc + item.price * item?.quantity, 0)+subAmount || 0  )

const fetchCart= async()=>{
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/cart/get`,{
      withCredentials:true
    });
    const data = await response.data;
    setCart(data)
    setAllCart(data)
  } catch (error) {
    
  }
}


useEffect(()=>{
  fetchCart()
},[isCartOpen])



const removeFromCart= async(id)=>{
try {
  setShowOffer(false)
  const response = await axios.delete(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/cart/destroy/${id}`);
  const data = await response.data;
  if(data.success){
    toast.success(data.message)
    // fetchCart()
    location.reload()
  }
else{
  toast.error(data.message)
}
} catch (error) {
    toast.error(error.message)

}
  setShowOffer(true)

}

const handelcartQuantity= async(id,type)=>{
try {
  const response = await axios.put(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/cart/update/${id}`,{type})
  const data = await response.data;
 if(data.success){
  fetchCart()
 }



} catch (error) {
  
}
}





  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[998]"
          onClick={() => setIsCartOpen(false)} // close on overlay click
        />
      )}

      <div
        className={`fixed top-0 right-0 min-h-screen 
         w-[90%] md:w-[40%] xl:w-[25%] bg-white shadow-lg z-[999] transition-transform duration-300 ${
           isCartOpen ? "translate-x-0" : "translate-x-full"
         }`}
      >
        <div className="absolute z-10 bottom-0 right-0 opacity-20">
          <Image
          
            alt=""
            src={"/Images/bg1.png"}
            width={360}
            height={360}
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="relative z-[999] flex justify-between items-center px-4 py-6 border-b-[1px] border-[#99571d]">
          <h2 className="text-xl font-mosetta font-medium text-[#99571d]">
            Cart
          </h2>
          <button
            className="cursor-pointer"
            onClick={() => setIsCartOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {cart?.length === 0 ? (
          <div className="relative z-[999] flex items-center justify-center h-full w-full text-center text-gray-500 px-6">
            <div className="flex flex-col my-24 items-center justify-center">
              <img
                src="/Images/cart.gif"
                loading="lazy"
                alt="Empty Cart"
                className="w-40 h-40 mb-4 "
              />
              <p className="text-md">Your Cart Is Empty</p>
            </div>
          </div>
        ) : (
          <div className="relative z-[999] flex flex-col justify-between h-full">


   {showoffer &&  <Offervalue  cart={cart} setAppliedOffers={setAppliedOffers}  />}














            <div className="p-4 space-y-4 overflow-y-auto flex-1">
             {cart?.map((item) => (
                <div key={item._id} className="flex items-start gap-4 text-md">
                  <Link href={`/product/${item?.product?.name}/${item?.product?._id}`} 
                   onClick={() => setIsCartOpen(false)}
                  >
                    <Image
                    
                      src={item?.product?.images[0]}
                      alt={item?.product?.name}
                      width={400}
                      height={400}
                      className="w-24 h-24 rounded-md object-cover"
                    />
                  </Link>
                  <div className="flex-1 space-y-2">
                    <p className="">{item?.product?.name}</p>
                    <p className="">₹{item?.price}</p>
                   <p className=" border w-fit border-gray-200 rounded-full px-2  text-gray-600 text-sm font-semibold">{item.product.colorVariants.find((itm2)=>`${itm2._id}`==item.color)?.colorName}</p>







                    <div className="flex items-center gap-2 ">
                      <button
                        className={` px-2 text-md bg-gray-100 ${item?.quantity == 1? "cursor-not-allowed text-gray-300":"cursor-pointer" }`}
                        onClick={() =>
                          handelcartQuantity(item._id,"sub")
                        }
                        disabled={item?.quantity <= 1}
                      >
                        -
                      </button>

                      <span>{item?.quantity}</span>

                      <button
                       


className={` px-2 bg-gray-100 hover:bg-gray-200 ${item.product.colorVariants.find((itm2)=>`${itm2._id}`==item.color)?.quantity <=item?.quantity? "cursor-not-allowed text-gray-300" :"cursor-pointer"}
                         }`}


                        onClick={() => {
                         handelcartQuantity(item._id,"add") 
                        }}

                        disabled={item.product.colorVariants.find((itm2)=>`${itm2._id}`==item.color)?.quantity <=item?.quantity}
                      >
                        +
                      </button>

                    </div>
                  </div>


                  <button
                    onClick={() =>
                     removeFromCart(item?._id)
                    }
                    className="cursor-pointer"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))} 
            </div>

            <div className="p-4   space-y-4">
              {/* Coupon Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  className="flex-1 border-b-[1px] border-[#99571d]   text-md  outline-none"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-[#B67032] text-white px-4 py-2 rounded-md text-md"
                >
                  Apply
                </button>
              </div>

              {/* Discount Summary */}
              <div className="text-md space-y-1">
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-gray-500">Calculated at checkout</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon})</span>
                    <span>
                      - ₹{Math.floor((total * discountPercent) / 100)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-base">
                  <span>Subtotal</span>
                  <span>
                    ₹
                    {discountPercent > 0
                      ? Math.floor(total * (1 - discountPercent / 100))
                      : total}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                     setIsCartOpen(false);
                  setShowCheckout(true);
               
                }}
                className="w-full bg-[#B67032] text-white py-2 mt-4 rounded-md"
              >
                Place Order
              </button>

              <button
                onClick={() => setIsCartOpen(false)}
                className="text-center text-md text-[#B67032] underline mt-3 w-full"
              >
                Or Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>

      <CheckoutSidebar
        isOpen={showCheckout}
        setIsOpen={setShowCheckout}
        cart={cart}
        total={total}
        discountPercent={discountPercent}
      />
    </>
  );
}
