"use client";

import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalContext } from "../../components/context/GlobalContext";
import { useRouter } from "next/navigation";

const OrdersList = () => {
  const { orders, loadingOrders, fetchOrders } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="w-full">
      <ToastContainer className="z-[9999]" />

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#99571d] font-mosetta">
          All Orders
        </h2>

        <div className="overflow-x-auto font-sans capitalize">
          {loadingOrders ? (
            <Skeleton count={5} height={40} className="mb-2 rounded" />
          ) : orders.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No orders found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left font-mosetta text-sm text-gray-700">
                  <th className="p-3 border-b">Order ID</th>
                  <th className="p-3 border-b">Customer</th>
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Total</th>
                  <th className="p-3 border-b">Payment Mode</th>
                  <th className="p-3 border-b">Payment Status</th>
                  <th className="p-3 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => router.push(`/admin/orders/${order._id}`)}
                    className="text-sm hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="p-3 border-b">{order._id}</td>
                    <td className="p-3 border-b">
                      {order.userId?.name || "N/A"}
                    </td>
                    <td className="p-3 border-b">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 border-b">₹{order.amount}</td>
                    <td className="p-3 border-b">
                      <span
                        className={`px-2 py-1 rounded-lg  ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {order.paymentMethod}
                      </span>
                    </td>

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

                    <td className="p-3 border-b">
                      <span
                        className={`px-2 py-1 rounded-lg   capitalize
                          ${
                            order.orderStatus === "completed"
                              ? "bg-green-100 text-green-600"
                              : order.orderStatus === "pending"
                              ? "bg-yellow-100 text-yellow-600"
                              : order.orderStatus === "placed"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
