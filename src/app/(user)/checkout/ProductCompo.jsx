"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2, X } from "lucide-react";

import { base_url } from "@/app/components/store/utile";
import Offervalue from "@/app/components/user/Offervalue";

const ProductCompo = ({ handelCheckout }) => {
  const router = useRouter();
  const { user } = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.items);
  
  const [products, setProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  
  // Separate states for different types of discounts
  const [offerDiscount, setOfferDiscount] = useState(0); 
  const [couponDiscount, setCouponDiscount] = useState(0);
  
  // Coupon input and tracking states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Fetch Cart Details
  const fetchWishlist = async (items) => {
    try {
      const response = await axios.post(`${base_url}/cart/get_no_user_cart`, {
        productArry: items,
      });
      const data = response.data;

      if (data.success) {
        setProducts(data.items);
      }
    } catch (error) {
      console.error("Failed to fetch cart details:", error);
      toast.error("Failed to load cart details.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    if (!user) {
      if (cartItems && cartItems.length > 0) {
        fetchWishlist(cartItems);
      } else {
        // router.back();
      }
    } else {
      setProducts(cartItems);
      setIsLoading(false);
    }
  }, [cartItems, router, user]);

  // Calculate Subtotal whenever products change
  useEffect(() => {
    const total = products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(total);
  }, [products]);

  // Handle Coupon Logic
  const handleCouponCode = async () => {
    if (!couponCode || couponCode.length < 3) {
      toast.error("Please enter a valid coupon code.");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const response = await axios.get(`${base_url}/coupon/${couponCode.toUpperCase()}`);
      const data = response.data;

      if (data.valid) {
        const discountAmount = (subtotal * data.discountPercent) / 100;
        setCouponDiscount(discountAmount);
        setAppliedCoupon(couponCode.toUpperCase());
        setCouponCode("");
        toast.success("Coupon code applied successfully! Store offer removed.");
      } else {
        toast.error(data.message || "Invalid coupon code.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponDiscount(0);
    setAppliedCoupon(null);
    toast.info("Coupon removed. Store offer reapplied.");
  };

  // NEW LOGIC: If a coupon is applied, activeOfferDiscount becomes 0
  const activeOfferDiscount = appliedCoupon ? 0 : offerDiscount;
  
  // Ensure total never goes below 0
  const finalTotal = Math.max(0, subtotal - activeOfferDiscount - couponDiscount);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 bg-gray-50 rounded-2xl border border-gray-100 min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#B67032] animate-spin mb-4" />
        <p className="text-gray-500 animate-pulse ml-3">Loading order summary...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full p-4 md:p-8 sticky top-6">
      <div className="p-6 md:p-8 bg-gray-50 rounded-2xl border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Order Summary
        </h2>

        {products?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <Image
              src="/Images/cart.gif"
              alt="Empty Cart"
              width={120}
              height={120}
              className="w-32 h-32 mb-4 opacity-80"
            />
            <p className="text-lg font-medium text-gray-700">
              Your Cart Is Empty
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Products List */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {products.map((item) => {
                const colorVariant = item.product?.colorVariants?.find(
                  (itm2) => `${itm2._id}` === item.color
                )?.colorName;

                return (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
                  >
                    <div className="relative shrink-0">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item?.product?.images?.[0]}`}
                        alt={item?.product?.name || "Product image"}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-md object-cover border border-gray-100"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item?.product?.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 border border-gray-200 bg-gray-50 px-2 py-0.5 rounded-md">
                          {colorVariant || "Standard"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          ₹{item.price} each
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <hr className="border-gray-200 my-6" />

            {/* Price Breakdown */}
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              {/* Hide Offervalue component visually if a coupon is applied */}
              <div className={appliedCoupon ? "hidden" : "block"}>
                <Offervalue
                  cartItems={products}
                  setDiscountPrice={setOfferDiscount}
                />
              </div>

              {/* Only show Store Offer if NO coupon is applied */}
              {!appliedCoupon && offerDiscount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Store Offer Applied</span>
                  <span>- ₹{offerDiscount.toFixed(2)}</span>
                </div>
              )}

              {/* Show Coupon Discount if applied */}
              {couponDiscount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Coupon ({appliedCoupon})</span>
                  <span>- ₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Shipping</span>
                <span className="text-gray-500">Calculated next</span>
              </div>
            </div>

            {/* Coupon Input Area */}
            <div className="mt-6">
              {!appliedCoupon ? (
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleCouponCode()}
                    className="border-b w-full border-gray-400 focus:border-[#B67032] bg-transparent outline-none px-2 uppercase transition-colors"
                    placeholder="ENTER COUPON CODE"
                    disabled={isApplyingCoupon}
                  />
                  <button
                    onClick={handleCouponCode}
                    disabled={isApplyingCoupon || !couponCode}
                    className="px-4 bg-[#B67032] hover:bg-[#99571d] disabled:opacity-50 disabled:hover:bg-[#B67032] text-white rounded-lg py-2 transition-colors flex items-center min-w-[80px] justify-center"
                  >
                    {isApplyingCoupon ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 px-4 py-2 rounded-lg">
                  <span className="text-green-700 font-medium text-sm">
                    {appliedCoupon} Applied!
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <hr className="border-gray-200 my-4" />

            {/* Final Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-[#B67032]">
                ₹{finalTotal.toFixed(2)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                className="w-full bg-[#B67032] hover:bg-[#99571d] text-white py-3.5 rounded-lg font-medium transition-colors duration-200 shadow-sm flex items-center justify-center gap-2"
                onClick={()=>handelCheckout(finalTotal,)}
              >
                Proceed to Payment
              </button>
              <button
                onClick={() => router.push("/shop")}
                className="w-full text-sm text-gray-600 hover:text-[#B67032] font-medium py-2 transition-colors"
              >
                Return to Shop
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCompo;