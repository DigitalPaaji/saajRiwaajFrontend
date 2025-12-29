"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import { UploadCloud, Loader2, X } from "lucide-react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PopupModal from "@/app/components/admin/ConfirmPopup";
import ImagePreviewModal from "@/app/components/user/ImagePreview";
import { useGlobalContext } from "../../components/context/GlobalContext";

const CLOUDINARY_CLOUD_NAME = "dj0z0q0ut";
const CLOUDINARY_UPLOAD_PRESET = "saajRiwaajProducts";

export default function OffersPage() {
      const {  offers } = useGlobalContext();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
    const [minquantity, setMinQuantity] = useState(1);
  const [price, setPrice] = useState();
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteOfferId, setDeleteOfferId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);


  // Drag/drop handlers
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
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  // Upload image to Cloudinary
  const handleImageUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (data.secure_url) {
        setImage(data.secure_url);
      } else {
        toast.error("Upload failed.");
      }
    } catch {
      toast.error("Upload error.");
    } finally {
      setIsUploading(false);
    }
  };

  // Add Offer
  const handleAddOffer = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.warn("Please enter offer title.");
    if (!image) return toast.warn("Please upload offer image.");
     if (!minquantity.trim()) return toast.warn("Please enter offer quantity.");
      if (!price.trim()) return toast.warn("Please enter offer price.");

    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/offer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, image ,minquantity,price}),
      });

      if (res.ok) {
        toast.success("Offer added!");
        setTitle("");
        setImage("");
        fetchOffers();
      } else {
        toast.error("Failed to add offer.");
      }
    } catch {
      toast.error("Error adding offer.");
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
        fetchOffers();
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

  return (
    <div className="w-full">
      <ToastContainer className="z-[9999]" />

      <h2 className="text-2xl font-bold mb-6 text-[#4d4c4b] drop-shadow-sm">
        Manage Offers
      </h2>

      {/* Add Offer Form */}
      <form
        onSubmit={handleAddOffer}
        className="bg-white p-6 rounded-xl shadow-md border mb-6"
      >
        <label className="font-medium">Offer Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Buy 1 Get 1, Winter Sale, etc."
          className="border px-3 py-2 w-full rounded-xl mt-1"
        />


<div className="grid md:grid-cols-2 gap-6 my-6">
  <div>
       
<label className="font-medium">Offer Quantity</label>
         <input
          type="number"
          value={minquantity}
          onChange={(e) => setMinQuantity(e.target.value)}
          placeholder="Quantity of Product"
          className="border px-3 py-2 w-full rounded-xl mt-1"
        />
</div>
<div>
<label className="font-medium">Offer Price</label>
          <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price of Offer "
          className="border px-3 py-2 w-full rounded-xl mt-1"
          required
        />
        </div>
</div>
        

        {/* Image Upload */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`mt-4 w-full p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            id="offerUpload"
            onChange={(e) => handleImageUpload(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="offerUpload" className="cursor-pointer">
            <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm">
              <span className="text-[#99571d] font-medium">Click to upload</span>{" "}
              or drag image here
            </p>
          </label>
        </div>

        {image && (
          <div className="mt-3 relative w-40 h-28 border rounded-lg overflow-hidden shadow-sm">
            <Image  src={image} alt="Offer" fill className="object-cover" />
          </div>
        )}

        <button
          type="submit"
          className="bg-[#4d4c4b] mt-4 text-white px-4 py-2 rounded-xl shadow flex items-center"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          <FaPlus className="mr-2" /> Add Offer
        </button>
      </form>

      {/* Offers Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-left">
          <thead className="bg-[#4d4c4b] text-white text-xl font-medium">
            <tr className="text-sm">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm font-medium">
            {offers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No offers found.
                </td>
              </tr>
            ) : (
              offers.map((offer, index) => (
                <tr key={offer._id} className="hover:bg-[#f3f2f1] border-b">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 capitalize">{offer.title}</td>

                  <td className="px-4 py-3">
                    <Image
                    
                      src={offer.image}
                      alt="Offer"
                      width={70}
                      height={70}
                      className="rounded cursor-pointer"
                      onClick={() => setPreviewImage(offer.image)}
                    />
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setShowDeletePopup(true);
                        setDeleteOfferId(offer._id);
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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

      {/* Image Preview */}
      <ImagePreviewModal
        src={previewImage}
        onClose={() => setPreviewImage(null)}
      />

      {/* Delete Confirm Popup */}
      {showDeletePopup && (
        <PopupModal
          title={`Delete offer?`}
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
