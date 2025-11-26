"use client";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../components/context/GlobalContext";
import { toast } from "react-toastify";
import PopupModal from "@/app/components/admin/ConfirmPopup";

function Account() {
  const { admin, logoutAdmin, refetchAdmin } = useGlobalContext();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    refetchAdmin();
  }, [refetchAdmin]);

  return (
    <div className="flex flex-col h-full">

      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-xl font-mosetta text-[#99571d] font-semibold">
          Welcome, {admin?.name || "Admin"} 
        </h2>
      </div>


      <div className="flex flex-col gap-3 text-gray-700 mb-6">
        <div>
          <p className="text-sm font-medium text-gray-500">Name</p>
          <p className="text-lg font-semibold capitalize">{admin?.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-md">{admin?.email}</p>
        </div>
      </div>


      <div className="mt-auto flex justify-end">
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition"
          onClick={() => setShowLogoutPopup(true)}
        >
          Logout
        </button>
      </div>

    
      {showLogoutPopup && (
        <PopupModal
          title="Are you sure you want to logout?"
          onCancel={() => setShowLogoutPopup(false)}
          onConfirm={async () => {
            setShowLogoutPopup(false);
            await logoutAdmin();
            toast.success("Logged out!");
          }}
          confirmText="Logout"
          cancelText="Cancel"
          type="delete"
          showCancel
        />
      )}
    </div>
  );
}

export default Account;
