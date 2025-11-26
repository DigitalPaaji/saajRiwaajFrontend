"use client";
import React, { useEffect, useState } from "react";
import {
  X,
  Pencil,
  User,
  Mail,
  Phone,
  Loader2,
  LogOut,
  MapPin, Building2, Map, Globe, Hash,
  Package, Heart, ShoppingCart
} from "lucide-react";
import { toast } from "react-toastify";
import { useGlobalContext } from "../context/GlobalContext";
import PopupModal from "../admin/ConfirmPopup";
import Link from "next/link";

const Apiurl = process.env.NEXT_PUBLIC_LOCAL_PORT;

function Account() {
  const { user, setIsAuthOpen, logoutUser, refetchUser, setIsWishlistOpen, setIsOrderOpen, setIsCartOpen, logoutAdmin } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  // Load user
  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  // Sync form data
  useEffect(() => {
    if (user) {
      setFormData({
        phone: user.phone || "",
        addressLine: user.address?.addressLine || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        country: user.address?.country || "",
        pincode: user.address?.pincode || "",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));


const handleSave = async () => {
  try {
    setIsSaving(true);
    const clean = (val) => (val === "" ? null : val); 
    const payload = {
      phone: clean(formData.phone),
      address: {
        addressLine: formData.addressLine,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
      },
    };

    const res = await fetch(`${Apiurl}/user/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    // Try to parse JSON only when present
    const ct = res.headers.get("content-type") || "";
    const data = ct.includes("application/json") ? await res.json() : { message: await res.text() };

    if (!res.ok) {
      throw new Error(data?.message || `HTTP ${res.status}`);
    }

    toast.success("Profile updated!");
    setIsEditing(false);
    refetchUser();
  } catch (err) {
    toast.error(err?.message || "Update failed!");
  } finally {
    setIsSaving(false);
  }
};

  return (
    <div
     className="bg-white h-full w-full  flex flex-col"

    >
      

      {/* Header */}
           <div className="flex justify-between items-center px-4 py-6 border-b-[1px] border-[#99571d]">
        <h2 className="text-xl font-mosetta font-medium text-[#99571d]">My Profile</h2>
        <button onClick={() => setIsAuthOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="space-y-3">
          {/* Always read-only */}
          <InfoRow icon={<User className="text-[#99571db7]"/>} label="Full Name" value={user?.name} />
          <InfoRow icon={<Mail className="text-[#99571db7]"/>} label="Email" value={user?.email} />

          {/* Editable rows */}
          {!isEditing ? (
            <>
              <InfoRow icon={<Phone className="text-[#99571db7]"/>} label="Phone" value={user?.phone} />
              <InfoRow
                icon={<MapPin className="text-[#99571db7]"/>}
                label="Address"
                value={
                  user?.address
                    ? `${user.address.addressLine || ""} ${user.address.city || ""} ${user.address.state || ""} ${user.address.country || ""} - ${user.address.pincode || ""}`
                    : "-"
                }
              />





              <button
                className="flex items-center gap-1 px-3 py-1 bg-[#B67032] text-white text-sm rounded mt-2"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>


                <div className="mt-6 space-y-3 border-t border-stone-200 pt-4">
          <Link href={'/orders'} onClick={()=>{
           setIsAuthOpen(false)
          //  setIsOrderOpen(true)
           }} className="flex items-center gap-3 text-stone-700 hover:text-[#B67032] transition-colors">
            <Package className="w-5 h-5 text-[#99571db7]" />
            <span className="text-md font-medium">My Orders</span>
          </Link>
          <button onClick={()=>setIsWishlistOpen(true)} className="flex items-center gap-3 text-stone-700 hover:text-[#B67032] transition-colors">
            <Heart className="w-5 h-5 text-[#99571db7]" />
            <span className="text-md font-medium">Wishlist</span>
          </button>
          <button onClick={()=>{
           setIsAuthOpen(false)
           setIsCartOpen(true)
          }} className="flex items-center gap-3 text-stone-700 hover:text-[#B67032] transition-colors">
            <ShoppingCart className="w-5 h-5 text-[#99571db7]" />
            <span className="text-md font-medium">Cart</span>
          </button>
        </div>
            </>
          ) : (
            <>
              <EditableRow
                icon={<Phone className="text-[#99571db7]"/>}
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <EditableRow
                icon={<MapPin className="text-[#99571db7]"/>}
                label="Address Line"
                name="addressLine"
                value={formData.addressLine}
                onChange={handleChange}
              />
              <EditableRow
                icon={<Building2  className="text-[#99571db7]"/>}
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
              <EditableRow
                icon={<Map  className="text-[#99571db7]"/>}
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
              <EditableRow
                icon={<Globe  className="text-[#99571db7]"/>}
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
              <EditableRow
                icon={<Hash  className="text-[#99571db7]"/>}
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
              />

              <div className="flex gap-2 pt-2">
                <button
                  className="flex-1 bg-gray-300 text-sm py-2 rounded"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-[#B67032] text-white text-sm py-2 rounded flex items-center justify-center gap-1"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer with logout */}
      <div className="border-t px-4 py-3">
        <button
          className="flex items-center gap-2 w-full justify-center bg-red-500 text-white py-2 rounded text-sm"
           onClick={() => setShowLogoutPopup(true)}
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

        {showLogoutPopup && (
        <PopupModal
          title="Are you sure you want to logout?"
          onCancel={() => setShowLogoutPopup(false)}
          onConfirm={async () => {
            setShowLogoutPopup(false);
            await logoutUser();
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

/* 🔹 Sub-components */
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-2 text-md lg:text-lg">
    <div className="text-gray-500 mt-1">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-serif font-medium text-gray-700 text-[17px]">{value || "-"}</p>
    </div>
  </div>
);

const EditableRow = ({ icon, label, name, value, onChange }) => (
  <div className="flex items-start gap-2 text-md">
    <div className="text-gray-500 mt-2">{icon}</div>
    <div className="flex-1">
      <label className="text-sm text-gray-500">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="border-b border-gray-500 focus:outline-none  px-2 py-1 w-full text-md"
      />
    </div>
  </div>
);

export default Account;
