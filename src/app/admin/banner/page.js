"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import { X, Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PopupModal from "@/app/components/admin/ConfirmPopup";
import ImagePreviewModal from "@/app/components/user/ImagePreview";

const CLOUDINARY_CLOUD_NAME = "dj0z0q0ut";
const CLOUDINARY_UPLOAD_PRESET = "saajRiwaajProducts";

const inputClasses =
  "w-full px-3 py-2 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg transition";
const cardClasses =
  "bg-white p-6 rounded-xl shadow-md border border-gray-200";

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteBannerId, setDeleteBannerId] = useState(null);
  const [desktopImage, setDesktopImage] = useState("");
  const [mobileImage, setMobileImage] = useState("");
  const [dragActiveDesktop, setDragActiveDesktop] = useState(false);
  const [dragActiveMobile, setDragActiveMobile] = useState(false);
  

  const fetchBanners = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/banner`);
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error("Error fetching banners:", err);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      type === "desktop"
        ? setDragActiveDesktop(true)
        : setDragActiveMobile(true);
    } else {
      type === "desktop"
        ? setDragActiveDesktop(false)
        : setDragActiveMobile(false);
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    type === "desktop"
      ? setDragActiveDesktop(false)
      : setDragActiveMobile(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0], type);
    }
  };

  const handleImageUpload = async (file, target = "desktop") => {
    if (!file) return;
    setIsUploading(true);
    if(target=="desktop"){

      setDesktopImage(file)
    }else if(target == "mobile"){
      setMobileImage(file)
    }



  
  };

  const handleAddBanner = async () => {
    if (!desktopImage || !mobileImage) {
      return toast.warning("Upload both desktop and mobile images.");
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
formData.append("desktopImage",desktopImage)
formData.append("mobileImage",mobileImage)
      

      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/banner/`, {
      
       method: "POST",
    body: formData,
      });

      if (res.ok) {
        toast.success("Banner added!");
        setDesktopImage("");
        setMobileImage("");
        fetchBanners();
      } else {
        toast.error("Failed to add banner.");
      }
    } catch {
      toast.error("Error adding banner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteBannerId(id);
    setShowDeletePopup(true);
  };

  const confirmDeleteTag = async () => {
    if (!deleteBannerId) return toast.error("No banner ID to delete.");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/banner/${deleteBannerId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        toast.success("Banner Image deleted!");
        fetchBanners();
      } else {
        toast.error("Failed to delete banner image.");
      }
    } catch (err) {
      toast.error("Error deleting banner image.");
    } finally {
      setShowDeletePopup(false);
      setDeleteBannerId(null);
      fetchBanners();
    }
  };

  return (
    <div className="px-4">
      <ToastContainer position="top-right" autoClose={2000} />
      <h1 className="text-2xl font-mosetta text-[#99571d] font-bold mb-6">
        Homepage Banner Images
      </h1>

      <div className={`${cardClasses}`}>
        <div className="flex items-start justify-center gap-8 flex-wrap lg:flex-nowrap">
          <div className="w-full lg:w-1/2">
            <h2 className="text-lg font-semibold mb-2">Upload Desktop Banner</h2>
            <div
              onDragEnter={(e) => handleDrag(e, "desktop")}
              onDragOver={(e) => handleDrag(e, "desktop")}
              onDragLeave={(e) => handleDrag(e, "desktop")}
              onDrop={(e) => handleDrop(e, "desktop")}
              className={`my-4 w-full p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition ${
                dragActiveDesktop
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                id="desktop-upload"
                onChange={(e) => handleImageUpload(e.target.files[0], "desktop")}
                className="hidden"
              />
              <label htmlFor="desktop-upload" className="cursor-pointer">
                <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-2 text-sm">
                  <span className="text-[#99571d] font-medium">
                    Click to upload
                  </span>{" "}
                  or drag image here
                </p>
              </label>
            </div>

            {desktopImage && (
              <div className="mt-3 relative w-52 h-32 border rounded-lg overflow-hidden shadow-sm">
                <Image
                  src={URL.createObjectURL(desktopImage)}
                  alt="Desktop"
                  fill
                  className="object-cover"
                  
                />
              </div>
            )}
          </div>

          {/* Mobile Upload */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-lg font-semibold mb-2">Upload Mobile Banner</h2>
            <div
              onDragEnter={(e) => handleDrag(e, "mobile")}
              onDragOver={(e) => handleDrag(e, "mobile")}
              onDragLeave={(e) => handleDrag(e, "mobile")}
              onDrop={(e) => handleDrop(e, "mobile")}
              className={`my-4 w-full p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition ${
                dragActiveMobile
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                id="mobile-upload"
                onChange={(e) => handleImageUpload(e.target.files[0], "mobile")}
                className="hidden"
              />
              <label htmlFor="mobile-upload" className="cursor-pointer">
                <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-2 text-sm">
                  <span className="text-[#99571d] font-medium">
                    Click to upload
                  </span>{" "}
                  or drag image here
                </p>
              </label>
            </div>

            {mobileImage && (
              <div className="mt-3 relative w-52 h-32 border rounded-lg overflow-hidden shadow-sm">
                <Image
                  src={URL.createObjectURL(mobileImage)}
                  alt="Mobile"
                  fill
                  className="object-cover"
                  
                />
              </div>
            )}
          </div>
        </div>

        {/* Add Banner Button */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleAddBanner}
          className="cursor-pointer bg-[#4d4c4b] hover:bg-[#272625] text-white px-5 py-2.5 mt-6 rounded-lg shadow flex items-center text-sm font-medium transition"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          <FaPlus className="mr-2" />
          {isSubmitting ? "Adding..." : "Add Banner"}
        </button>
      </div>

      {/* Banner Grid */}
      <div className={`${cardClasses} mt-8`}>
        <h2 className="text-lg font-semibold mb-4">Current Banners</h2>

        {banners.length === 0 ? (
          <p className="text-gray-500">No banners uploaded yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((b) => (
              <div
                key={b._id}
                className="relative bg-gray-50 rounded-xl overflow-hidden shadow border hover:shadow-md transition"
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(b._id)}
                  className="absolute top-2 right-2 z-10 text-red-600 hover:text-red-800 bg-white rounded-full p-1 shadow"
                >
                  <X size={18} />
                </button>

                <div className="flex flex-col gap-3 p-4">
                  {/* Desktop Image */}
                  {b.desktopImage && (
                    <div
                      onClick={() => setPreviewImage(b.desktopImage)}
                      className="cursor-pointer rounded-lg overflow-hidden"
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${b.desktopImage}`}
                        alt="Desktop"
                        width={600}
                        height={250}
                        className="object-cover w-full h-auto"
                        
                      />
                      <p className="text-xs text-center mt-2 text-gray-500">
                        Desktop View
                      </p>
                    </div>
                  )}

                  {/* Mobile Image */}
                  {b.mobileImage && (
                    <div
                      onClick={() => setPreviewImage(b.mobileImage)}
                      className="cursor-pointer rounded-lg overflow-hidden"
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${b.mobileImage}`}
                        alt="Mobile"
                        width={600}
                        height={250}
                        className="object-cover w-full h-auto"
                        
                      />
                      <p className="text-xs text-center mt-2 text-gray-500">
                        Mobile View
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Image Preview Modal */}
      <ImagePreviewModal
        src={previewImage}
        onClose={() => setPreviewImage(null)}
      />

      {showDeletePopup && (
        <PopupModal
          title={`Delete Image?`}
          message=""
          onCancel={() => setShowDeletePopup(false)}
          onConfirm={confirmDeleteTag}
          confirmText="Delete"
          cancelText="Cancel"
          type="delete"
          showCancel
        />
      )}
    </div>
  );
}
