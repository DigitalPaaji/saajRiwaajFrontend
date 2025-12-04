"use client";
import { useEffect, useState, useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { useGlobalContext } from "../../components/context/GlobalContext";
import Banner from "../../components/user/InnerBanner";

export default function OrdersPage() {
  const { allProducts, setIsAuthOpen } = useGlobalContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
const [cancelingOrder,setCancellingOrder]=useState()
const [cancelReason, setCancelReason] = useState("");
const [customReason, setCustomReason] = useState("");


console.log(orders,"assss")

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/order/my`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        setOrders([]); 
        return;
      }

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);


  const cancelOrder = useCallback(
    async (id,finalReason) => {



      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_PORT}/order/cancel/${id}`,
          {
            method: "PUT",
            credentials: "include",
             headers: {
            "Content-Type": "application/json",
          },
             body: JSON.stringify({
    finalReason
 }),

          }
     

        );

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to cancel order");
        }

        toast.success("Order cancelled");
        fetchOrders(); // refresh orders after cancel
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


const loadRazorpay = () => {
 return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
};



const payNowOrder=async(id,amount)=>{
      const ok = await loadRazorpay();

     if (!ok) return alert("Failed to load Razorpay");

try {
   const orderRes = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/order`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    amount,
    type:"paynow"
 }),
});
    const order = await orderRes.json();


    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Sajriwaaj",
      description: "Order Payment",
      // image: `${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/logo.jpeg`,
      order_id: order.id,
      handler: async function (response) {
      
        const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/order/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({...response,productId:id}),
        });

        const verifyData = await verifyRes.json();
     
        if (verifyData.success) {

        
                location.reload()
        } else {
          alert("Payment Verification Failed!");
        }
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9876543210",
      },
      theme: {color: "#FAF8EA",
      hide_topbar: false },
    };

     const paymentObject = new window.Razorpay(options);
    paymentObject.open();
} catch (error) {
  
}




}

const handleSubmitCancel = () => {
  const finalReason = cancelReason === "Other" ? customReason : cancelReason;


  cancelOrder(cancelingOrder._id,finalReason)
  setCancellingOrder(false);
};



const cancelReasonOptions = [
  "Changed my mind",
  "Order placed by mistake",
  "Found a cheaper alternative",
  "Delivery time is too long",
  "Need to update the order",
  "Product/service no longer needed",
  "Incorrect details entered",
  "Other"
];




  return (
  <div>
    <Banner title="My Orders" />

    <div className="px-4 sm:px-8 lg:px-24 xl:px-60 mx-auto my-16">
      {loading ? (
        <Skeleton count={5} height={40} className="mb-2 rounded" />
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <h3 className="text-2xl font-semibold mb-4 text-center text-[#B67032]">
            No Orders Found
          </h3>
          <p className="text-gray-700 text-lg text-center">
            Please login to view your orders or place a new one.
          </p>

          <button
            onClick={() => setIsAuthOpen(true)}
            className="w-fit px-4 bg-[#B67032] text-white py-2 rounded mt-6"
          >
            Login / Signup
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition p-5"
              >
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold text-lg text-gray-800">
                    Order ID: {order._id}
                  </h3>

                  <span
                    className={`text-xs sm:text-sm font-medium px-3 py-1 rounded-lg ${
                      order.orderStatus === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus === "confirmed"
                        ? "bg-amber-100 text-amber-600"
                        : order.orderStatus === "cancelled"
                        ? "bg-red-100 text-red-600"
                        : order.orderStatus === "shipped"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {order.orderStatus.charAt(0).toUpperCase() +
                      order.orderStatus.slice(1)}
                  </span>
                </div>

                <div className="space-y-4 border-t pt-4">
                  {order.items.map((item) => {
                    const product =
                      allProducts.find((p) => p._id === item.product) || {};

                    return (
                      <div
                        key={item._id}
                        className="flex gap-4 items-center border-b pb-3"
                      >
                        <div className="w-20 h-20 rounded-lg bg-gray-50 overflow-hidden">
                          <Link
                            href={`/product/${product?.name}/${product?._id}`}
                          >
                            <Image
                              src={product.images?.[0] || "/Images/img.webp"}
                              width={400}
                              height={400}
                              alt="Product"
                              className="w-full h-full object-cover"
                            />
                          </Link>
                        </div>

                        <div className="flex-1">
                          <p className="text-lg font-medium text-gray-700">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <div className="text-lg font-semibold text-[#99571d]">
                          ₹{item.price}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between mt-4">
                  <p className="text-lg font-bold text-[#99571d]">
                    Total: ₹{order.amount}
                  </p>

                  {order.paymentStatus === "paid" ? (
                    <>
                      {order.orderStatus === "placed" && (
                        <button
                          onClick={() => setCancellingOrder(order)}
                          className="px-4 py-2 text-sm font-medium border border-[#c74444] text-[#da3838] rounded-md shadow-sm"
                        >
                          Cancel Order
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => payNowOrder(order._id, order.amount)}
                      className="px-4 py-2 text-sm font-medium border border-green-600 text-green-600 rounded-md shadow-sm"
                    >
                      Pay Now
                    </button>
                  )}
                </div>

                {order.trackingnumber && (
                  <div className="mt-3 text-sm text-gray-700">
                    Tracking: <b>{order.trackingnumber}</b>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>

    {cancelingOrder && (
      <div className="h-screen w-screen bg-black/60 fixed top-0 left-0 z-[100] flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Cancel Order
          </h2>

          <p className="text-sm text-gray-600 mb-3">Select a reason:</p>

          <div className="space-y-2">
            {cancelReasonOptions.map((reason, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="cancelReason"
                  value={reason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>

          {cancelReason === "Other" && (
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 mt-3"
              rows="3"
              placeholder="Enter custom reason"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setCancellingOrder(false)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>

            <button
              onClick={handleSubmitCancel}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

}
