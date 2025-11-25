"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGlobalContext } from "../../../components/context/GlobalContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { FiHash, FiTruck, FiCreditCard } from "react-icons/fi";

const OrderDetails = () => {
  const { id } = useParams();
  const { fetchOrderById } = useGlobalContext();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const loadOrder = async () => {
    setLoading(true);
    const fetchedOrder = await fetchOrderById(id);
    setOrder(fetchedOrder);
    setLoading(false);
  };

  useEffect(() => {
    if (id) loadOrder();
  }, [id, fetchOrderById]);

  const handleTrackingNumber = async () => {
    if (!order?.trackingnumber) {
      console.warn("No tracking number to update");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/order/tracking/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            info: order.trackingnumber,
            type: "tracking",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update tracking number"
        );
      }

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        loadOrder();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating tracking number:", error.message);
    }
  };

  const handelotherStatus = async (info, type) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/order/tracking/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ info, type }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update");
      }

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        loadOrder();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating:", error.message);
    }
  };

  if (loading)
    return <Skeleton count={10} height={30} className="mb-2 rounded" />;
  if (!order)
    return <p className="text-center py-6 text-gray-500">Order not found.</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 ">
      <h2 className="text-lg font-semibold mb-4 text-[#99571d] font-mosetta">
        Order Details
      </h2>

      {/* Order Summary */}
      <div className="mb-6 space-y-1">
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Customer:</strong> {order.shippingAddress?.name || "N/A"}
        </p>
        <p>
          <strong>Phone:</strong> {order.shippingAddress?.phone || "N/A"}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Total:</strong> ₹{order.amount}
        </p>
        <p>
          <strong>Payment:</strong> {order.paymentMethod}
        </p>
        <p>
          <strong>Status:</strong> {order.orderStatus}
        </p>
        <p>
          <strong>Payment Status:</strong>{" "}
          <span
            className={` ${
              order.paymentStatus == "paid" ? "text-green-600" : "text-red-600"
            }`}
          >
            {order.paymentStatus}
          </span>{" "}
        </p>
        {order?.trackingnumber && (
          <p>
            <strong>Tracking Number:</strong> {order?.trackingnumber}
          </p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-md mb-2">Shipping Address</h3>
        <p>
          {order.shippingAddress?.addressLine}, {order.shippingAddress?.city},{" "}
          {order.shippingAddress?.state}, {order.shippingAddress?.country} -{" "}
          {order.shippingAddress?.pincode}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-white shadow rounded-2xl border">
          <div className="flex items-center gap-2 mb-2">
            <FiHash className="text-blue-700 text-xl" />
            <b className="text-lg">Tracking Number</b>
          </div>

          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={order?.trackingnumber}
              onChange={(e) => {
                setOrder({ ...order, trackingnumber: e.target.value });
              }}
              placeholder="Enter tracking number"
              className="flex-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleTrackingNumber}
              className="bg-blue-700 px-4 py-2 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Order Status */}
        <div className="p-4 bg-white shadow rounded-2xl border flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <FiTruck className="text-green-600 text-xl" />
            <b className="text-lg">Order Status</b>
          </div>

          <select
            value={order.orderStatus}
            onChange={(e) => handelotherStatus(e.target.value, "order")}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="placed">Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Payment Status */}
        <div className="p-4 bg-white shadow rounded-2xl border flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <FiCreditCard className="text-purple-600 text-xl" />
            <b className="text-lg">Payment Status</b>
          </div>

          <select
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            value={order.paymentStatus}
            onChange={(e) => handelotherStatus(e.target.value, "payment")}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Items */}
      <h3 className="font-semibold text-md mb-2">Items</h3>     
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm text-gray-700">
            <th className="p-3 border-b">Image</th>
            <th className="p-3 border-b">Product</th>
            <th className="p-3 border-b">Quantity</th>
            <th className="p-3 border-b">Price</th>
            <th className="p-3 border-b">Subtotal</th>
            <th className="p-3 border-b">Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i} className="text-sm hover:bg-gray-50">
              <td className="p-3 border-b">
                <Link href={`/admin/products/view/${item.product._id}`}>
                  <Image
                    alt={item.product?.name || "Product"}
                    width={220}
                    height={220}
                    src={item.product.images?.[0]}
                    className="w-16 h-16 object-cover"
                  />
                </Link>
              </td>
              <td className="p-3 border-b">
                {item.product?.name || "Unknown"}
              </td>
              <td className="p-3 border-b">{item.quantity}</td>
              <td className="p-3 border-b">₹{item.price}</td>
              <td className="p-3 border-b">₹{item.quantity * item.price}</td>
              <td className="p-3 border-b">
                <span
                  className={`px-2 py-1 rounded-lg  ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetails;
