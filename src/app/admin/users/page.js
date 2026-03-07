"use client";

import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalContext } from "@/app/components/context/GlobalContext";
export default function UsersList() {
  const { allUsers } = useGlobalContext()
  // const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(true);

  // // Fetch all users
  // const fetchUsers = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/user/all`, {
  //       method: "GET",
  //       credentials: "include", // send cookies if required
  //     });
  //     const data = await res.json();

  //     if (res.ok) {
  //       setUsers(data.users || []);
  //     } else {
  //       toast.error(data.message || "Failed to load users");
  //     }
  //   } catch (err) {
  //     console.error("Fetch users error:", err);
  //     toast.error("Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  return (
    <div className="w-full">
      <ToastContainer className={"z-[9999]"} />
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-[#4d4c4b] drop-shadow-sm">
          All Users
        </h2>
      </div>

      <div className="overflow-x-auto rounded-lg">
        {/* {userLoading ? (
          <Skeleton count={5} height={40} className="mb-2 rounded" />
        ) : ( */}
          <table className="min-w-full text-left">
            <thead className="bg-[#4d4c4b] text-white text-xl font-medium">
              <tr className="text-sm font-mosetta">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">NAME</th>
                <th className="px-4 py-3">EMAIL</th>
                <th className="px-4 py-3">CART ITEMS</th>
                <th className="px-4 py-3">WISHLIST ITEMS</th>
              </tr>
            </thead>

            <tbody className="text-sm font-medium">
              {allUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                allUsers.map((user, idx) => (
                  <tr
                    key={user._id}
                    className="hover:bg-[#f3f2f1] transition"
                  >
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.cart?.length || 0}</td>
                    <td className="px-4 py-3">{user.wishlist?.length || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        {/* )} */}
      </div>
    </div>
  );
}
