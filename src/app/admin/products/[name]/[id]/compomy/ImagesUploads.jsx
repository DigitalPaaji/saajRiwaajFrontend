"use client"
import { UploadCloud, X } from 'lucide-react';
import React, { useRef, useState } from 'react'



const inputClasses =
  "w-full px-3 py-2 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg  transition duration-200 shadow-sm appearance-none";
const labelClasses = "block mb-1 text-sm font-medium text-gray-700";
const buttonClasses = {
  primary:
    "px-4 py-2 bg-[#99571d] text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none  transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center",
  destructive:
    "h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-opacity",
};
const cardClasses = "bg-white p-6 rounded-xl shadow-sm border border-gray-200";




const ImagesUploads = ({
  onUpload,
  onRemove,
  images,
  onRemovenewImages,
 
 newImages,
 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          id={"img"}
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        <label htmlFor={"img"} className="cursor-pointer">
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold text-[#99571d]">Click to upload</span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
        </label>
    
      </div>

  
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          { images.length > 0 && images.map((url, index) => (
            <div key={index} className="relative aspect-square group">
              <img
                src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${url}`}
                alt={`Preview ${index + 1}`}
                width={300}
                height={300}
                className="w-full h-full object-cover rounded-lg shadow-sm"
                 
              />
              <button
                type="button"
                className={`cursor-pointer absolute top-1 right-1 opacity-0 group-hover:opacity-100 ${buttonClasses.destructive}`}
                onClick={() => onRemove(index)}
              >
                <X className="h-4 w-4 " />
              </button>
            </div>
          ))}

 {newImages?.length > 0 && newImages?.map((url, index) => (
            <div key={index} className="relative aspect-square group">
              <img
                src={URL.createObjectURL(url)}
                alt={`Preview ${index + 1}`}
                width={300}
                height={300}
                className="w-full h-full object-cover rounded-lg shadow-sm"
                 
              />
              <button
                type="button"
                className={`cursor-pointer absolute top-1 right-1 opacity-0 group-hover:opacity-100 ${buttonClasses.destructive}`}
                onClick={() => onRemovenewImages(index)}
              >
                <X className="h-4 w-4 " />
              </button>
            </div>
          ))}

        </div>

    </div>
  );
};

export default ImagesUploads