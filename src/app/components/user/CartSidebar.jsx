"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {  X } from "lucide-react";

import { useGlobalContext } from "../context/GlobalContext";
import { addTocart, decreaseQuantity, removeFormuserCart, removeFromcart, updatQunentityinCart } from "../store/cartSlice";
import { base_url } from "../store/utile";
import Offervalue from "./Offervalue";


export default function CartSidebar({ setIsCartOpen, isCartOpen }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state=>state.user)
  // Redux state
  const cartitem = useSelector((state) => state.cart.items);
  


  const [products, setProducts] = useState([]);

  const [discountPrice ,setDiscountPrice] = useState(0)


const [total,setTotal]=useState(0)
 




  const fetchWishlist = async (newwishlist) => {
    try {
      const response = await axios.post(`${base_url}/cart/get_no_user_cart`, {
        productArry: newwishlist,
      });
      const data = response.data;

      if (data.success) {
        setProducts(data.items);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      setProducts([]);
    }
  };

  
  useEffect(() => {
if(user){

setProducts(cartitem)


}else{



    if (cartitem && cartitem.length > 0) {
      if (isCartOpen){ fetchWishlist(cartitem);
    
}
    } else {
      setProducts([]);
    }

  }
  }, [cartitem, isCartOpen])
  
  
  
  
  ;

useEffect(()=>{


  const totalPrice = Math.round(
    products?.reduce((acc, item) => acc + (item.price * (item?.quantity || 1)), 0) - discountPrice || 0
  )
   setTotal(totalPrice);
},[ products ,discountPrice ])
  const handleClose = () => {
    if (typeof setIsCartOpen === "function") {
      setIsCartOpen(false);
    }
  };



const updateCart= async(type,id)=>{

console.log(id)

try {
const response = await axios.put(`${base_url}/cart/update/${id}`,{type});
const data = await response.data;
if(data.success){
  dispatch(updatQunentityinCart({id,type}))
}
} catch (error) {
  toast.error(error.response.data.message)
}
}


const removeFromCartuser = async(id)=>{
  try {
    const response = await axios.delete(`${base_url}/cart/destroy/${id}`);
    const data = await response.data;
    if(data.success){
      toast.success(data.message)
      dispatch(removeFormuserCart(id))
      
    }
  } catch (error) {
    toast.error(error.response.data.message)
  }
}


  return (
    <>
     
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998] transition-opacity duration-300"
          onClick={handleClose}
        />
      )}

  
      <div
        className={`fixed top-0 right-0 h-full w-[90%] md:w-[40%] xl:w-[25%]  bg-white shadow-2xl z-[999] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
      
        <div className="absolute z-0 bottom-0 right-0 opacity-10 pointer-events-none">
          <Image
            alt="Background Decoration"
            src="/Images/bg1.png"
            width={360}
            height={360}
            className="w-full h-auto object-cover"
          />
        </div>

     
        <div className="relative z-10 flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-white">
          <h2 className="text-xl font-medium text-[#99571d]">Your Cart</h2>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={handleClose}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Cart Content */}
        {products?.length === 0 ? (
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-gray-500 px-6">
            <Image
              src="/Images/cart.gif"
              alt="Empty Cart"
              width={160}
              height={160}
              className="w-40 h-40 mb-4 opacity-80"
              loading="lazy"
            />
            <p className="text-lg font-medium text-gray-700">Your Cart Is Empty</p>
            <button 
              onClick={handleClose}
              className="mt-4 text-[#B67032] underline hover:text-[#99571d]"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col justify-between flex-1 overflow-hidden bg-white/95">
            
            {/* Scrollable Product List */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              {products.map((item) => {
                const variantQty = item.product.colorVariants.find(
                  (itm2) => `${itm2._id}` === item.color
                )?.quantity || 0;
                const isMaxQtyReached = variantQty <= item?.quantity;

                return (
                  <div key={item._id} className="flex items-start gap-4 group">
                    {/* Product Image */}
                    <Link
                      href={`/product/${item?.product?.name}/${item?.product?._id}`}
                      onClick={handleClose}
                      className="shrink-0"
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item?.product?.images?.[0]}`}
                        alt={item?.product?.name || "Product image"}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-lg object-cover border border-gray-100 group-hover:border-[#B67032] transition-colors"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/product/${item?.product?.name}/${item?.product?._id}`}
                        onClick={handleClose}
                      >
                        <h3 className="text-sm font-medium text-gray-900 truncate hover:text-[#B67032]">
                          {item?.product?.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">₹{item?.price}</p>
                      
            
                      <span className="inline-block mt-2 border border-gray-200 rounded-md px-2 py-0.5 text-xs text-gray-600 bg-gray-50">
                        {item.product.colorVariants.find((itm2) => `${itm2._id}` === item.color)?.colorName}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-gray-200 rounded-md">
                          <button
                            className={`px-3 py-1 text-lg leading-none ${
                              item?.quantity <= 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-50"
                            }`}
                            onClick={() => user ?  updateCart("sub",item._id) : dispatch(decreaseQuantity({ product: item.product._id, color: item.color }))}
                            disabled={item?.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-2 text-sm font-medium w-8 text-center">{item?.quantity}</span>
                          <button
                            className={`px-3 py-1 text-lg leading-none ${
                              isMaxQtyReached ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-50"
                            }`}
                            onClick={() => user ?  updateCart("add",item._id) :  dispatch(addTocart({ quantity: 1, product: item.product._id, color: item.color }))}
                            disabled={isMaxQtyReached}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => user?  removeFromCartuser(item._id) : dispatch(removeFromcart({ color: item?.color, product: item?.product?._id }))}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer / Summary Area */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
              
              {/* Table Integration */}
              <div className="w-full overflow-hidden rounded-lg shadow-sm border border-gray-200 bg-white">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] font-semibold tracking-wider">
                    <tr>
                      <th className="py-2 px-3 border-b border-gray-200">Item</th>
                      <th className="py-2 px-3 border-b border-gray-200 text-center">Qty</th>
                      <th className="py-2 px-3 border-b border-gray-200 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-2 px-3 text-xs text-gray-600 truncate max-w-[100px]">
                          {item?.product?.name}
                        </td>
                        <td className="py-2 px-3 text-xs font-medium text-gray-900 text-center">
                          {item.quantity}
                        </td>
                        <td className="py-2 px-3 text-xs font-semibold text-gray-900 text-right">
                          ₹{(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
 <Offervalue  cartItems={products} setDiscountPrice={setDiscountPrice}   />
              {discountPrice > 0 && <div className="flex justify-between w-full text-green-700">
                
              <p>  Offer Aplied</p>

              <p>-  ₹{discountPrice.toFixed(2)}</p>
                </div>}
              <div className="flex justify-between items-center text-lg font-medium text-gray-900 pt-2">
                <span>Subtotal</span>
                <span>
                  ₹{total.toFixed(2)}
                  {/* ₹{discountPercent > 0 ? Math.floor(total * (1 - discountPercent / 100)) : total} */}
                </span>
              </div>
              <p className="text-xs text-gray-500 text-center">Taxes and shipping calculated at checkout</p>

        
              <div className="space-y-3 pt-2">
                <Link
                 href="/checkout"
                onClick={()=>setIsCartOpen()}
                >
                  <button   className="w-full bg-[#B67032] hover:bg-[#99571d] text-white py-3.5 rounded-lg font-medium transition-colors duration-200 shadow-sm">

                  Checkout
                  </button>
                </Link>
                <button
                  onClick={handleClose}
                  className="w-full text-sm text-gray-600 hover:text-[#B67032] font-medium py-2 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}