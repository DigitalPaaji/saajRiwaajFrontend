"use client";

import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { UploadCloud, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PopupModal from "@/app/components/admin/ConfirmPopup";
import ImagePreviewModal from "@/app/components/user/ImagePreview";
import { useGlobalContext } from "../../components/context/GlobalContext";
import axios from "axios";
import { base_url } from "@/app/components/store/utile";

export default function OffersPage() {
  const { offers } = useGlobalContext();
  
  // Local state to manage UI updates instantly without reloading the page
  const [localOffers, setLocalOffers] = useState([]);

  // Form States
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [minquantity, setMinQuantity] = useState(1);
  const [price, setPrice] = useState("");
  
  // UI States
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteOfferId, setDeleteOfferId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Sync context offers with local state for instant UI updates
  useEffect(() => {
    if (offers) setLocalOffers(offers);
  }, [offers]);

  // Drag & Drop Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  // Add Offer
  const handleAddOffer = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.warn("Please enter an offer title.");
    if (!image) return toast.warn("Please upload an offer image.");
    if (!minquantity) return toast.warn("Please enter offer quantity.");
    if (!price) return toast.warn("Please enter offer price.");

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);
      formData.append("minquantity", minquantity);
      formData.append("price", price);

      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/offer`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Offer added successfully!");
        // Reset form
        setTitle("");
        setImage(null);
        setMinQuantity(1);
        setPrice("");
        
        // Slight delay before reload to let toast show, or ideally trigger a context refetch here
        setTimeout(() => window.location.reload(), 1500); 
      } else {
        toast.error("Failed to add offer.");
      }
    } catch {
      toast.error("Error adding offer. Check console or server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Offer
  const confirmDelete = async () => {
    if (!deleteOfferId) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/offer/${deleteOfferId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        toast.success("Offer deleted!");
        setLocalOffers((prev) => prev.filter((o) => o._id !== deleteOfferId));
      } else {
        toast.error("Failed to delete.");
      }
    } catch {
      toast.error("Error deleting offer.");
    } finally {
      setShowDeletePopup(false);
      setDeleteOfferId(null);
    }
  };

  // Toggle Status (Optimistic UI Update)
  const toggleStatus = async (id, currentStatus) => {
    // 1. Instantly update the UI so it feels fast
    setLocalOffers((prev) =>
      prev.map((offer) =>
        offer._id === id ? { ...offer, showonpage: !currentStatus } : offer
      )
    );

    try {
      // 2. Call the API
      const response = await axios.put(`${base_url}/offer/toggle/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      // 3. Revert the UI back if the API fails
      setLocalOffers((prev) =>
        prev.map((offer) =>
          offer._id === id ? { ...offer, showonpage: currentStatus } : offer
        )
      );
      toast.error(error.response?.data?.message || "Failed to toggle status");
    }
  };

  return (
    <div className="w-full">
      <ToastContainer className="z-[9999]" position="top-right" autoClose={3000} />

      <h2 className="text-2xl font-bold mb-6 text-[#4d4c4b] drop-shadow-sm">
        Manage Offers
      </h2>

      {/* Add Offer Form */}
      <form
        onSubmit={handleAddOffer}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8"
      >
        <div>
          <label className="text-sm font-semibold text-gray-700">Offer Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Buy 1 Get 1, Winter Sale, etc."
            className="border border-gray-300 px-4 py-2.5 w-full rounded-lg mt-1 focus:ring-2 focus:ring-[#99571d] focus:border-[#99571d] outline-none transition"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 my-5">
          <div>
            <label className="text-sm font-semibold text-gray-700">Offer Quantity</label>
            <input
              type="number"
              value={minquantity}
              onChange={(e) => setMinQuantity(e.target.value)}
              placeholder="Quantity of Product"
              min="1"
              className="border border-gray-300 px-4 py-2.5 w-full rounded-lg mt-1 focus:ring-2 focus:ring-[#99571d] outline-none transition"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Offer Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price of Offer"
              min="0"
              className="border border-gray-300 px-4 py-2.5 w-full rounded-lg mt-1 focus:ring-2 focus:ring-[#99571d] outline-none transition"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`mt-4 w-full p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
            dragActive ? "border-[#99571d] bg-orange-50" : "border-gray-300 bg-gray-50"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            id="offerUpload"
            onChange={(e) => setImage(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="offerUpload" className="cursor-pointer block w-full h-full">
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              <span className="text-[#99571d] font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF</p>
          </label>
        </div>

        {image && typeof image === "object" && (
          <div className="mt-4 relative w-32 h-24 border rounded-lg overflow-hidden shadow-sm">
            <Image
              src={URL.createObjectURL(image)}
              alt="Offer Preview"
              fill
              className="object-cover"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#4d4c4b] hover:bg-[#383736] mt-6 text-white px-6 py-2.5 rounded-lg shadow-md flex items-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <FaPlus className="mr-2" />
          )}
          {isSubmitting ? "Adding..." : "Add Offer"}
        </button>
      </form>

      {/* Offers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-[#4d4c4b] text-white">
              <tr>
                <th className="px-6 py-4 font-semibold text-sm">#</th>
                <th className="px-6 py-4 font-semibold text-sm">Title</th>
                <th className="px-6 py-4 font-semibold text-sm">Image</th>
                <th className="px-6 py-4 font-semibold text-sm">Show on Page</th>
                <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {localOffers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No offers found.
                  </td>
                </tr>
              ) : (
                localOffers.map((offer, index) => (
                  <tr key={offer._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-800 capitalize">
                      {offer.title}
                    </td>

                    <td className="px-6 py-4">
                      <div
                        className="w-12 h-12 rounded-md overflow-hidden cursor-pointer border shadow-sm hover:opacity-80 transition"
                        onClick={() => setPreviewImage(offer.image)}
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${offer.image}`}
                          alt="Offer"
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </td>

                    {/* Styled Toggle Switch */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(offer._id, offer.showonpage)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#99571d] ${
                          offer.showonpage ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            offer.showonpage ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setShowDeletePopup(true);
                          setDeleteOfferId(offer._id);
                        }}
                        className="text-red-500 hover:text-white border border-red-500 hover:bg-red-500 px-4 py-1.5 rounded-md transition-colors text-sm font-medium"
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
      </div>

      {/* Image Preview */}
      {previewImage && (
        <ImagePreviewModal
          src={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}

      {/* Delete Confirm Popup */}
      {showDeletePopup && (
        <PopupModal
          title="Delete offer?"
          onCancel={() => setShowDeletePopup(false)}
          onConfirm={confirmDelete}
          confirmText="Delete"
          cancelText="Cancel"
          type="delete"
          showCancel
        />
      )}
    </div>
  );
}