// app/admin/page.jsx
"use client";

import { useEffect } from "react";
import { useGlobalContext } from "../components/context/GlobalContext";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ⭐ Recharts imports
import {
  BarChart,
  Bar,PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
   Legend,
} from "recharts";

export default function AdminDashboard() {
  const {
    orders,
    fetchOrders,
    loadingOrders,
    allProducts,
    alluser,
    categories
  } = useGlobalContext();

  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Summary values
  const totalProducts = allProducts?.length || 0;
  const totalUsers = alluser?.length || 0;
  const totalOrders = orders?.length || 0;
  const totalSales =
    orders?.reduce((sum, o) => sum + (o.amount || 0), 0) || 0;

  // ⭐ Product Category Chart Data
  const categoryChartData = Object.values(
    allProducts?.reduce((acc, product) => {
      const cat = product?.category?.name || "Unknown";
      if (!acc[cat]) acc[cat] = { category: cat, count: 0 };
      acc[cat].count += 1;
      return acc;
    }, {}) || {}
  );

const COLORS = ["#99571d", "#d88c51", "#f3c29b", "#c97a40", "#7a4b23"];
  const monthlyOrders = (() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const result = Array(12).fill(0);

    orders?.forEach((order) => {
      const monthIndex = new Date(order.createdAt).getMonth();
      result[monthIndex] += 1;
    });

    return months.map((m, i) => ({
      month: m,
      orders: result[i],
    }));
  })();


let productitem = {};

orders?.forEach(order => {
  order.items?.forEach(item => {
    const category = categories.find(cat => cat._id === item.product?.category);
    const categoryName = category ? category?.name : null;
    productitem[categoryName] = productitem[categoryName] ? productitem[categoryName] + 1 : 1;
  });
});


const chartData = Object.entries(productitem)
.map((item)=>({
category:item[0],
Order:item[1]
}))


console.log(categoryChartData,"fsdfsd[pf")

  return ( 
    <div className="flex min-h-screen font-mosetta">
      {/* Main Content */}
      <main className="flex-1 md:p-3 xl:p-6">
        <h1 className="text-2xl font-bold text-[#99571d] mb-6">
          Dashboard Overview
        </h1>

        {/* Summary Cards */}
        <div className="flex items-center gap-6 justify-start flex-wrap lg:flex-nowrap mb-8">
          <SummaryCard
            icon={<Package className="w-6 h-6 text-[#99571d]" />}
            title="Total Products"
            value={totalProducts}
          />
          <SummaryCard
            icon={<Users className="w-6 h-6 text-[#99571d]" />}
            title="Total Users"
            value={totalUsers}
          />
          <SummaryCard
            icon={<ShoppingCart className="w-6 h-6 text-[#99571d]" />}
            title="Total Orders"
            value={totalOrders}
          />
          <SummaryCard
            icon={<DollarSign className="w-6 h-6 text-[#99571d]" />}
            title="Total Sales"
            value={`₹${totalSales}`}
          />
        </div>

        {/* ⭐ Product Category Chart */}

 <div className="grid md:grid-cols-2  gap-4">
        <div className="bg-white shadow-md rounded-lg p-3 xl:p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Products Per Category
          </h2>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
             <PieChart>
  <Tooltip />
  <Pie
    data={categoryChartData}
    dataKey="count"
    nameKey="category"
    cx="50%"
    cy="50%"
    outerRadius={100}
    label
  >
    {categoryChartData.map((entry, index) => (
      <Cell
        key={`cell-${index}`}
        fill={COLORS[index % COLORS.length]}
      />
    ))}
  </Pie>
</PieChart>

            </ResponsiveContainer>
          </div>
        </div>

       
        <div className="bg-white shadow-md rounded-lg p-3 xl:p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Orders Per Month</h2>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#99571d"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>




          <div className="bg-white shadow-md rounded-lg p-3 xl:p-6 mb-8 col-span-full">
          <h2 className="text-lg font-semibold mb-4">
            Order by categories
          </h2>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              {productitem && 
             <BarChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="category" />
    <YAxis  />
    <Tooltip itemStyle={{ color: 'blue' }}    labelStyle={{ fontWeight: 'bold', color: 'green' }}
    
    
    />
    <Legend />
 
    <Bar dataKey="Order" fill="#99571d"  />
  </BarChart>}

            </ResponsiveContainer>
          </div>
        </div>

        </div> 

        {/* Orders Table */}
        <div className="bg-white  shadow-md rounded-lg p-3 xl:p-6  w-[70vw] md:w-full">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto w-full">
            <table className="   w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm">
                  <th className="p-3 border-b">Order ID</th>
                  <th className="p-3 border-b">Customer</th>
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Total</th>
                  <th className="p-3 border-b">Payment Status</th>

                  <th className="p-3 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingOrders ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-4 text-gray-500"
                    >
                      Loading orders...
                    </td>
                  </tr>
                ) : orders?.length > 0 ? (
                  orders.slice(0, 5).map((order) => (
                    <tr
                      key={order._id}
                      onClick={() =>
                        router.push(`/admin/orders/${order._id}`)
                      }
                      className="text-sm hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="p-3 border-b">{order._id}</td>
                      <td className="p-3 border-b">
                        {order.shippingAddress?.name || "N/A"}
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
                        {order.paymentStatus}
                      </span>
                    </td>




                      <td className="p-3 border-b">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.orderStatus === "placed"
                              ? "bg-yellow-100 text-yellow-600"
                              : order.orderStatus === "completed"
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-4 text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// Summary Card Component
function SummaryCard({ icon, title, value }) {
  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-md flex items-center gap-4">
      <div className="p-3 bg-[#f3e7dc] rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
}
