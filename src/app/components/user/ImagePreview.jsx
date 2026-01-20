'use client';
import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { getOptimizedImage } from "../utils/cloudinary";

export default function ImagePreviewModal({ src, onClose }) {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} 
      >

        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-white text-black rounded-full p-1 shadow hover:bg-red-100"
        >
          <X className="w-5 h-5" />
        </button>
<div className="relative w-full h-[500px]">
  <Image
    src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${src}`}
    alt="Preview"
    fill
    sizes="(max-width: 768px) 100vw, 800px"
    loading="lazy"
    className="object-contain rounded-xl"
  />
</div>
      </div>
    </div>
  );
}
