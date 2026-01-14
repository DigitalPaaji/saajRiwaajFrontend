"use client";
import { useGlobalContext } from "../context/GlobalContext";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getOptimizedImage } from "../utils/cloudinary";

export default function CartSidebar() {
  const { isOrderOpen, setIsOrderOpen, allProducts, user } = useGlobalContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const fetchOrders = useCallback(async () => {
      if (!user) {
      
      setOrders([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/order/my`, {
        credentials: "include",
      });
     if (res.status === 401 || res.status === 403) {
        
        setOrders([]);
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to load orders");
      }

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [user]);

  
const cancelOrder = useCallback(
    async (id) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_PORT}/order/cancel/${id}`,
          {
            method: "PUT",
            credentials: "include",
          }
        );

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to cancel order");
        }

        toast.success("Order cancelled");
        fetchOrders();
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Failed to cancel order");
      }
    },
    [fetchOrders]
  );
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
 if (!user) {
    return (
      <>
        {isOrderOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[998]"
            onClick={() => setIsOrderOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 right-0 min-h-screen 
          w-[90%] md:w-[40%] xl:w-[25%] bg-white shadow-lg z-[999] transition-transform duration-300 ${
            isOrderOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center px-4 py-6 border-b border-[#99571d]">
            <h2 className="text-xl font-mosetta font-medium text-[#99571d]">
              My Orders
            </h2>
            <button onClick={() => setIsOrderOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 text-gray-500">
            Please log in to view your orders.
          </div>
        </div>
      </>
    );
  }

 return (
  <>
      {isOrderOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[998]"
          onClick={() => setIsOrderOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 min-h-screen 
        w-[90%] md:w-[40%] xl:w-[25%] bg-white shadow-lg z-[999] transition-transform duration-300 ${
          isOrderOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-6 border-b border-[#99571d]">
          <h2 className="text-xl font-mosetta font-medium text-[#99571d]">
            My Orders
          </h2>
          <button onClick={() => setIsOrderOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mx-auto p-4">
          {loading ? (
            <p className="text-gray-500">Loading your orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">You have not placed any orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) =>
                order.items.map((item) => {
                  const product =
                    allProducts.find((p) => p._id === item.product) || {};

                  return (
                    <div
                      key={item._id}
                      className="space-y-4 bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition"
                    >
                      <div className="flex gap-4">
                        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                          <Link href={`/product/${product.name}/${product._id}`}>
                           <Image
  src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${
    product.images?.[0] || "/Images/1.webp"}`}
  alt={product.name || "Product image"}
  width={400}
  height={400}
  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px"
  loading="lazy"
  className="w-full h-full object-cover"
/>
                          </Link>
                        </div>

                        
                        <div className="flex-1 flex flex-col justify-between">
                        
                          <div>
                            <div className="flex justify-between items-start">
                              <p className="text-md font-serif text-gray-900">
                                {product.name || "Unknown Product"}
                              </p>
                              <span
                                className={`text-sm font-medium px-2 py-1 rounded-md ${
                                  order.orderStatus === "delivered"
                                    ? "bg-green-100 text-green-700"
                                    : order.orderStatus === "cancelled"
                                    ? "bg-red-100 text-red-600"
                                    : order.orderStatus === "shipped"
                                    ? "bg-blue-100 text-[#99571d]"
                                    : "bg-yellow-100 text-yellow-600"
                                }`}
                              >
                                {order.orderStatus === "delivered"
                                  ? "Delivered"
                                  : order.orderStatus === "cancelled"
                                  ? "Cancelled"
                                  : order.orderStatus === "shipped"
                                  ? "Shipped"
                                  : "Placed"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {order.orderStatus === "delivered"
                                ? `Delivered on ${new Date(
                                    order.updatedAt
                                  ).toLocaleDateString()}`
                                : order.orderStatus === "cancelled"
                                ? "Cancelled as per your request"
                                : `Estimated by ${new Date(
                                    order.createdAt
                                  ).toLocaleDateString()}`}
                            </p>
                          </div>

                      
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-gray-700">
                              Qty:{" "}
                              <span className="font-medium">{item?.quantity}</span>
                            </p>
                            <p className="text-base font-semibold text-[#99571d]">
                              ₹{item.price * item?.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex items-center justify-between gap-2">
                        {order.orderStatus === "placed" && (
                          <button
                            onClick={() => cancelOrder(order._id)}
                            className="w-full px-3 py-2 text-sm font-medium bg-[#c74444] hover:bg-[#da3838] text-white rounded-md"
                          >
                            Cancel Order
                          </button>
                        )}
                        {(order.orderStatus === "placed" ||
                          order.orderStatus === "shipped") && (
                          <button
                            onClick={() =>
                              toast.info("Tracking feature coming soon!")
                            }
                            className="w-full px-3 py-2 text-sm font-medium bg-[#3a67c9] hover:bg-[#3168dd] text-white rounded-md"
                          >
                            Track Order
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}