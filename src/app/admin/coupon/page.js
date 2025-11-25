"use client";

import { useEffect, useState, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PopupModal from "../../components/admin/ConfirmPopup";

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  // fetch all coupons
  const fetchCoupon = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/coupon`,{
        credentials:'include'
      });
      const data = await res.json();
      console.log(data)
      setCoupons(data.coupons || []);
    } catch (err) {
      console.error("Error fetching coupons:", err);
    }
  }, []);

  useEffect(() => {
    fetchCoupon();
  }, [fetchCoupon]);

  // add coupon
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!code.trim() || !discountPercent.trim()) {
      return toast.warn("Enter coupon code and discount percent");
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code, discountPercent: Number(discountPercent) }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Coupon added!");
        setCode("");
        setDiscountPercent("");
        fetchCoupon();
      } else {
        toast.error(data.message || "Failed to add coupon");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding coupon.");
    }
  };

  // delete coupon
  const confirmDeleteCoupon = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/coupon/${couponToDelete._id}`, {
        method: "DELETE",
        credentials:'include'
      });
      if (res.ok) {
        toast.success("Coupon deleted!");
        fetchCoupon();
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setShowDeletePopup(false);
    }
  };

  return (
    <div className="w-full">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 font-mosetta  text-[#99571d] drop-shadow-sm">
        Manage Coupons
      </h2>

      {/* Add form */}
      <form onSubmit={handleAddCoupon} className="flex gap-2 flex-wrap mb-8">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Coupon Code (e.g. SUMMER25)"
        className="border px-3 py-2 rounded-xl flex-1"
        />

      <input
        type="number"
        min="0"
        value={discountPercent}
        onChange={(e) => setDiscountPercent(e.target.value)}
        placeholder="Discount %"
        className="border px-3 py-2 rounded-xl w-[150px]"
        />

        <button
          type="submit"
          className="bg-[#4d4c4b] hover:bg-[#272625] text-white px-4 py-2 rounded-xl flex items-center"
        >
          <FaPlus className="mr-2" /> Add
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-left">
          <thead className="bg-[#4d4c4b] text-white text-xl font-medium">
            <tr className="text-sm font-mosetta">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No coupon found.
                </td>
              </tr>
            ) : (
              coupons.map((c, index) => (
                <tr key={c._id} className="hover:bg-[#f3f2f1] transition border-b">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 uppercase">{c.code}</td>
                  <td className="px-4 py-3">{c.discountPercent}%</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setShowDeletePopup(true);
                        setCouponToDelete(c);
                      }}
                      className="bg-[#dd4747e7] text-white px-3 py-1 rounded hover:bg-[#ec4242e7] transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* delete confirmation popup */}
      {showDeletePopup && (
        <PopupModal
          title={`Delete coupon '${couponToDelete?.code}'?`}
          message=""
          onCancel={() => setShowDeletePopup(false)}
          onConfirm={confirmDeleteCoupon}
          confirmText="Delete"
          cancelText="Cancel"
          type="delete"
          showCancel
        />
      )}
    </div>
  );
};

export default CouponPage;
