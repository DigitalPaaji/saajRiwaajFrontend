"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { UploadCloud, X, Loader2, Tag } from "lucide-react";
import Image from "next/image";
import { FaPlus, FaRupeeSign } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import ImagePreviewModal from "@/app/components/user/ImagePreview";
import { useGlobalContext } from "../../../../components/context/GlobalContext";
import { GrFormDown } from "react-icons/gr";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";

// IMPORTANT: Replace with your Cloudinary details
const CLOUDINARY_CLOUD_NAME = "dj0z0q0ut";
const CLOUDINARY_UPLOAD_PRESET = "saajRiwaajProducts";

// --- Reusable Tailwind Class Strings ---
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

// --- Image Uploader Logic (as a render function within the page) ---
const ImageUploader = ({
  onUpload,
  onRemove,
  images,
  uploaderId,
  maxFiles = 5,
  isUploading,
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
          id={uploaderId}
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        <label htmlFor={uploaderId} className="cursor-pointer">
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold text-[#99571d]">Click to upload</span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
        </label>
        {isUploading && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Uploading...</span>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative aspect-square group">
              <Image
                src={url}
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
        </div>
      )}
    </div>
  );
};

export default function AddProductPage() {
  const { offers } = useGlobalContext();
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);

  const [tags, setTags] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    category: "",
    subcategory: "",
    description: {
      paragraphs: [""],
      bulletPoints: [""],
    },
    offer: [],

    tags: [],
    isFeatured: false,
    isNewArrival: false,
    price: "",
    discount: "",
    images: [],
    colorVariants: [],
    barcode: null,
    hidethings:[]
  });
 console.log(product)

  const [finalPrice, setFinalPrice] = useState("0.00");
  const [tagInput, setTagInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showImg, setShowImg] = useState(false);
  // Variant-specific state
  const [variant, setVariant] = useState({
    colorName: "",
    quantity: 1,
    images: [],
  });

  // Upload-specific state
  const [isMainUploading, setIsMainUploading] = useState(false);
  const [isVariantUploading, setIsVariantUploading] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/category`);
      const data = await res.json();

      setCategories(data.cats || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  const fetchSubCategoriesByCategory = useCallback(async (categoryId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/subcategory/category/${categoryId}`
      );
      const data = await res.json();

      setSubCategories(data || []);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setSubCategories([]);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/tag/`);
      const data = await res.json();

      setTags(data.tags || []);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  }, []);

  useEffect(() => {
    fetchTags();
    fetchCategories();
  }, [fetchTags, fetchCategories]);

  const handleBarcodeUpload = useCallback(async (file) => {
    setIsMainUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (!data.secure_url) throw new Error("Upload failed");

      setProduct((prev) => ({
        ...prev,
        barcode: data.secure_url,
      }));
    } catch (err) {
      toast.error("Barcode upload failed");
    } finally {
      setIsMainUploading(false);
    }
  }, []);

  const { name, id } = useParams();
  const isViewMode = name === "view";
  const isEditMode = name === "edit";

  const fetchProducts = useCallback(async () => {
    try {
      // const res = await fetch(`${Apiurl}/products`);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/product/id/${id}`
      );
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }, [id]);
  useEffect(() => {
    if (id) {
      fetchProducts();
    }
  }, [id, fetchProducts]);

  const router = useRouter();
  useEffect(() => {
    const categoryId =
      typeof product?.category === "string"
        ? product?.category
        : product?.category?._id;

    if (categoryId) {
      fetchSubCategoriesByCategory(categoryId);
    }
  }, [product?.category, fetchSubCategoriesByCategory]);

  // --- Effects ---
  useEffect(() => {
    const price = parseFloat(product.price) || 0;
    const discount = parseFloat(product.discount) || 0;
    const final = price - (price * discount) / 100;
    setFinalPrice(final.toFixed(2));
  }, [product.price]);

useEffect(()=>{
  const price = parseFloat(product.price) || 0;
const discountPercent = ((price - finalPrice) / price) * 100;
setProduct({...product,discount:discountPercent.toFixed(2)})

},[finalPrice])

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    // Handle category change
    if (name === "category") {
      setProduct((prev) => ({
        ...prev,
        category: value,
        subcategory: "", // reset subcategory on category change
      }));

      fetchSubCategoriesByCategory(value).then((subs) => {
        if (!subs || subs.length === 0) {
          setProduct((prev) => ({
            ...prev,
            subcategory: null, 
          }));
        }
      });
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  const handleFileUpload = useCallback(async (files, type) => {
    const setIsLoading =
      type === "main" ? setIsMainUploading : setIsVariantUploading;
    const onComplete = (urls) => {
      if (type === "main") {
        setProduct((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      } else {
        setVariant((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      }
    };

    setIsLoading(true);
    const uploadPromises = Array.from(files).map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      return fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      ).then((res) => res.json());
    });

    try {
      const results = await Promise.all(uploadPromises);
      onComplete(results.map((r) => r.secure_url).filter(Boolean));
    } catch (error) {
      toast.error(
        "Image upload failed. Please check credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddVariant = () => {
    if (!variant.colorName) return toast.warning("Please enter a color name.");
    if (!variant.quantity)
      return toast.warning("Please enter a color quantity.");
    if (!variant.images || !variant.images.length)
      return toast.warning("Please select color Images.");

    setProduct((prev) => ({
      ...prev,
      colorVariants: [...prev.colorVariants, variant],
    }));
    setVariant({ colorName: "", quantity: 1, images: [] });
  };

  const removeVariant = (indexToRemove) => {
    setProduct((prev) => ({
      ...prev,
      colorVariants: prev.colorVariants.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/product/id/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...product,
            finalPrice: parseFloat(finalPrice),
          }),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      toast.success("Product updated successfully!");

      router.push(`/admin/products/view/${id}`);
    } catch (error) {
      toast.error("Failed to update product");
      console.error("Submission Error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

const handelhide = async(e)=>{
 setProduct({...product,hidethings:[...product.hidethings,e.target.value]})
}

const handelRemovehidden= async(val)=>{
  const newArray = [...product.hidethings]
  
 newArray.splice(newArray.indexOf(val),1)
 setProduct({...product,hidethings:newArray})
 
}


  return (
    <div className="">
      <ToastContainer className={"z-[999999]"} />
      <div className=" ">
        {/* {product.map((product, idx) => ( */}
        <form onSubmit={handleUpdate}>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h1 className="text-2xl font-bold font-mosetta  text-[#99571d] drop-shadow-sm">
              Product Information
            </h1>
            {isViewMode ? (
              <Link
                href={`/admin/products/edit/${id}`}
                className=" bg-[#4d4c4b] hover:bg-[#272625] text-white px-4 py-2 rounded-xl shadow transition duration-300 flex items-center"
              >
                Edit Product
              </Link>
            ) : (
              <button
                type="submit"
                disabled={isUpdating}
                className="cursor-pointer bg-[#4d4c4b] hover:bg-[#272625] text-white px-4 py-2 rounded-xl shadow transition duration-300 flex items-center"
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <div className={cardClasses}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className={labelClasses}>
                      Product Name
                    </label>
                    <input
                      disabled={isViewMode}
                      id="name"
                      name="name"
                      value={product.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Elegant Diamond Necklace"
                      required
                      className={inputClasses}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(categories.length > 0 || product?.category) && (
                      <div>
                        <label htmlFor="category" className={labelClasses}>
                          Category
                        </label>

                        <select
                          name="category"
                          value={
                            typeof product?.category === "string"
                              ? product?.category
                              : product?.category?._id || ""
                          }
                          onChange={handleInputChange}
                          disabled={isViewMode}
                          className={inputClasses}
                        >
                          <option value="" disabled>
                            Select a category
                          </option>

                          {/* Manually show selected if not in categories (edge case) */}
                          {!isViewMode &&
                            product?.category &&
                            !categories.find((c) =>
                              typeof product?.category === "string"
                                ? c._id === product?.category
                                : c._id === product?.category._id
                            ) && (
                              <option
                                value={
                                  typeof product?.category === "string"
                                    ? product?.category
                                    : product?.category._id
                                }
                              >
                                {typeof product?.category === "object"
                                  ? product?.category.name
                                  : "Selected Category"}
                              </option>
                            )}

                          {/* Actual category list */}
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {(subCategories.length > 0 || product.subcategory) && (
                      <div>
                        <label htmlFor="subcategory" className={labelClasses}>
                          Sub Category
                        </label>

                        <select
                          name="subcategory"
                          value={
                            typeof product.subcategory === "string"
                              ? product.subcategory
                              : product.subcategory?._id || ""
                          }
                          onChange={handleInputChange}
                          disabled={!product?.category || isViewMode}
                          className={inputClasses}
                        >
                          <option value="" disabled>
                            {product?.category
                              ? subCategories.length > 0
                                ? "Select a Sub Category"
                                : "No Sub Categories"
                              : "Select category first"}
                          </option>

                          {/* Manually show selected if not in subCategories (edge case) */}
                          {!isViewMode &&
                            product.subcategory &&
                            !subCategories.find((s) =>
                              typeof product.subcategory === "string"
                                ? s._id === product.subcategory
                                : s._id === product.subcategory._id
                            ) && (
                              <option
                                value={
                                  typeof product.subcategory === "string"
                                    ? product.subcategory
                                    : product.subcategory._id
                                }
                              >
                                {typeof product.subcategory === "object"
                                  ? product.subcategory.name
                                  : "Selected Subcategory"}
                              </option>
                            )}

                          {/* Actual subcategory list */}
                          {subCategories.map((sub) => (
                            <option key={sub._id} value={sub._id}>
                              {sub.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  {/* Paragraphs Input Section */}
                  <div className="mb-6">
                    <label className={labelClasses}>
                      Description Paragraphs
                    </label>
                    {product.description.paragraphs.map((para, index) => (
                      <div key={index} className="flex items-start gap-2 mb-2">
                        <textarea
                          disabled={isViewMode}
                          value={para}
                          onChange={(e) => {
                            const updated = [...product.description.paragraphs];
                            updated[index] = e.target.value;
                            setProduct((prev) => ({
                              ...prev,
                              description: {
                                ...prev.description,
                                paragraphs: updated,
                              },
                            }));
                          }}
                          placeholder="Enter paragraph text..."
                          className={inputClasses}
                          rows="2"
                        />
                        {!isViewMode && (
                          <button
                            type="button"
                            className="text-red-500 font-bold"
                            onClick={() => {
                              const updated =
                                product.description.paragraphs.filter(
                                  (_, i) => i !== index
                                );
                              setProduct((prev) => ({
                                ...prev,
                                description: {
                                  ...prev.description,
                                  paragraphs: updated,
                                },
                              }));
                            }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    {!isViewMode && (
                      <button
                        type="button"
                        className="text-sm text-[#99571d] mt-1"
                        onClick={() =>
                          setProduct((prev) => ({
                            ...prev,
                            description: {
                              ...prev.description,
                              paragraphs: [...prev.description.paragraphs, ""],
                            },
                          }))
                        }
                      >
                        + Add Paragraph
                      </button>
                    )}
                  </div>

                  {/* Bullet Points Input Section */}
                  <div>
                    <label className={labelClasses}>Bullet Points</label>
                    {product.description.bulletPoints.map((point, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          disabled={isViewMode}
                          type="text"
                          value={point}
                          onChange={(e) => {
                            const updated = [
                              ...product.description.bulletPoints,
                            ];
                            updated[index] = e.target.value;
                            setProduct((prev) => ({
                              ...prev,
                              description: {
                                ...prev.description,
                                bulletPoints: updated,
                              },
                            }));
                          }}
                          placeholder="Enter a bullet point..."
                          className={inputClasses}
                        />
                        {!isViewMode && (
                          <button
                            type="button"
                            className="text-red-500 font-bold"
                            onClick={() => {
                              const updated =
                                product.description.bulletPoints.filter(
                                  (_, i) => i !== index
                                );
                              setProduct((prev) => ({
                                ...prev,
                                description: {
                                  ...prev.description,
                                  bulletPoints: updated,
                                },
                              }));
                            }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    {!isViewMode && (
                      <button
                        type="button"
                        className="text-sm text-[#99571d]"
                        onClick={() =>
                          setProduct((prev) => ({
                            ...prev,
                            description: {
                              ...prev.description,
                              bulletPoints: [
                                ...prev.description.bulletPoints,
                                "",
                              ],
                            },
                          }))
                        }
                      >
                        + Add Bullet Point
                      </button>
                    )}
                  </div>

                  {/* <div>
                    <label htmlFor="description" className={labelClasses}>
                      Description
                    </label>
                    <textarea
                      id="description"
                      disabled={isViewMode}
                      name="description"
                      value={product.description}
                      onChange={handleInputChange}
                      placeholder="Detailed product description..."
                      className={inputClasses}
                      rows="4"
                    ></textarea>
                  </div> */}
                </div>
              </div>
              <div className={cardClasses}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Product Images
                </h3>

                {!isViewMode && (
                  <div className="flex gap-2 items-start flex-wrap">
                    <ImageUploader
                      onUpload={(files) => handleFileUpload(files, "main")}
                      onRemove={(idx) =>
                        setProduct((p) => ({
                          ...p,
                          images: p.images.filter((_, i) => i !== idx),
                        }))
                      }
                      images={product.images}
                      onClick={() => onImageClick?.(img)}
                      uploaderId="main-uploader"
                      isUploading={isMainUploading}
                    />
                  </div>
                )}
                {isViewMode && (
                  <div className="flex gap-2 items-start flex-wrap mt-6">
                    {product.images.map((img, idx) => (
                      <Image
                      
                        key={idx}
                        alt={`Product image ${idx + 1}`}
                        src={img}
                        width={300}
                        height={300}
                        onClick={() => setPreviewImage(img)}
                        className="w-40 h-40 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className={cardClasses}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Product Barcode
                </h3>

                {/* EDIT MODE */}
                {!isViewMode && (
                  <ImageUploader
                    onUpload={(files) => handleBarcodeUpload(files[0])}
                    onRemove={() =>
                      setProduct((p) => ({ ...p, barcode: null }))
                    }
                    images={product.barcode ? [product.barcode] : []}
                    uploaderId="barcode-uploader"
                    isUploading={isMainUploading}
                  />
                )}

                {/* VIEW MODE */}
                {isViewMode && product.barcode && (
                  <div className="mt-4">
                    <Image
                    
                      src={product.barcode}
                      alt="Product Barcode"
                      width={200}
                      height={200}
                      onClick={() => setPreviewImage(product.barcode)}
                      className="w-40 h-40 object-contain border rounded cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <div className={cardClasses}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Color Variants
                </h3>
                {!isViewMode && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="colorName" className={labelClasses}>
                          Color Name
                        </label>
                        <input
                          id="colorName"
                          placeholder="e.g., Rose Gold"
                          value={variant.colorName}
                          onChange={(e) =>
                            setVariant((v) => ({
                              ...v,
                              colorName: e.target.value,
                            }))
                          }
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label htmlFor="quantity" className={labelClasses}>
                          Quantity
                        </label>
                        <input
                          id="quantity"
                          type="number"
                          placeholder="1"
                          value={variant?.quantity}
                          onChange={(e) =>
                            setVariant((v) => ({
                              ...v,
                              quantity: parseInt(e.target.value, 10) || 1,
                            }))
                          }
                          min="1"
                          className={inputClasses}
                        />
                      </div>
                    </div>
                    {/* <select> */}
                    <div className="relative">
                      <div
                        className={`${inputClasses} cursor-pointer flex items-center justify-between`}
                        onClick={() => setShowImg(!showImg)}
                      >
                        {" "}
                        <p>Select Images</p>{" "}
                        <GrFormDown
                          className={` ${
                            showImg ? "rotate-180" : "rotate-0"
                          } duration-500`}
                        />{" "}
                      </div>
{showImg && (
  <>
    {/* BACKDROP */}
    <div
      className="fixed inset-0 bg-black/50 z-40"
      onClick={() => setShowImg(false)}
    />

    {/* POPUP CONTAINER */}
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-6">
      <div className="
        bg-white rounded-xl shadow-2xl relative
        w-full max-w-5xl
        max-h-[85vh] overflow-y-auto
        p-4 sm:p-6
      ">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setShowImg(false)}
          className="
            absolute top-1 right-1 
            bg-white shadow-md rounded-full
            w-8 h-8 flex items-center justify-center
            text-red-700 text-lg
            hover:bg-red-50 transition
          "
        >
          ✕
        </button>

        {/* TITLE (optional but helps UX) */}
        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center sm:text-left">
          Select Images
        </h3>

        {/* IMAGE GRID */}
        <div className="
          grid gap-3
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
        ">
          {product.images.map((img, idx) => (
            <div key={img || idx} className="relative">
              
              {/* SELECTED CHECK */}
              {variant.images.includes(img) && (
                <FaCheckCircle className="
                  absolute top-2 right-2
                  text-red-600 text-xl
                  bg-white rounded-full
                " />
              )}

              <img
                src={img}
                loading="lazy"
                alt={`Product image ${idx + 1}`}
                onClick={() => {
                  variant.images.includes(img)
                    ? setVariant({
                        ...variant,
                        images: variant.images.filter(
                          (item) => item !== img
                        ),
                      })
                    : setVariant({
                        ...variant,
                        images: [...variant.images, img],
                      });
                }}
                className="
                  w-full
                  aspect-square
                  object-cover
                  rounded-lg
                  cursor-pointer
                  border
                  hover:border-red-500
                  transition
                  active:scale-95
                "
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
)}


                    </div>
                    {/* </select> */}

                    <div className="grid grid-cols-1 md:grid-cols-3  lg:grid-cols-5 gap-3">
                      {variant.images.map((item, index) => {
                        return (
                          <div key={index} className="relative">
                            <X
                              onClick={() =>
                                setVariant({
                                  ...variant,
                                  images: variant.images.filter(
                                    (item2) => item2 !== item
                                  ),
                                })
                              }
                              className="absolute top-3 right-3 text-red-600 font-bold text-xl shadow bg-white p-0 rounded-full cursor-pointer"
                            />
                            <img
                              src={item}
                              loading="lazy"
                              alt={`Product image ${index + 1}`}
                              width={300}
                              height={300}
                              className="w-40 h-40 object-cover rounded cursor-pointer"
                            />
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className={buttonClasses.primary + " w-full"}
                    >
                      Add Variant
                    </button>
                  </div>
                )}
                {product.colorVariants.length > 0 && (
                  <div className="space-y-2 pt-4">
                    {!isViewMode && (
                      <label className={labelClasses}>Added Variants</label>
                    )}
                    <div className="flex flex-wrap gap-2 ">
                      {product.colorVariants.map((v, i) => (
                        <div
                          key={i}
                         className="bg-gray-100 rounded-lg p-2  text-sm w-full" 
                        >
<div className="bg-gray-100 rounded-lg p-2 flex items-center justify-between text-sm w-full">
                       
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{v.colorName}</span>
                            <span className="text-gray-500">
                              (Qty: {v?.quantity})
                            </span>
                          </div>
                            

                          {!isViewMode && (
                            <button
                              type="button"
                              onClick={() => removeVariant(i)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
</div>
                           <div className="grid grid-cols-5 gap-6">
                          
                            {
                             v.images?.map((sor,index) => {
                              return(
                               <img src={sor} key={index} alt={index}   width={300} loading="lazy"
                              height={300}
                              className="w-40 h-40 object-cover rounded cursor-pointer" />
                              )
                              })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className={cardClasses + " space-y-4"}>
                <h3 className="text-lg font-semibold text-gray-800">Pricing</h3>
                <div>
                  <label
                    htmlFor="price"
                    className={"labelClasses flex items-center"}
                  >
                    Price (<FaRupeeSign className="w-3 h-3 " />)
                  </label>
                  <input
                    disabled={isViewMode}
                    id="price"
                    name="price"
                    type="number"
                    value={product.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="discount" className={labelClasses}>
                    Discount (%)
                  </label>
                  <input
                    disabled={isViewMode}
                    id="discount"
                    name="discount"
                    type="number"
                    value={product.discount ?? 0}
                    onChange={handleInputChange}
                    placeholder="0"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={"labelClasses flex items-center"}>
                    Final Price (<FaRupeeSign className="w-3 h-3 " />)
                  </label>
                  <div className="p-2 mt-1 rounded-md bg-gray-100 font-semibold text-gray-700 flex items-center">
               
                <input
                    disabled={isViewMode}
                    id="finalPrice"
                    name="finalPrice"
                    type="number"
                    value={Math.floor(finalPrice) ?? 0}
                    onChange={(e)=>setFinalPrice(e.target.value)}
                    placeholder="0"
                    className={inputClasses}
                  />
                  
                  </div>
                </div>
              </div>

              <div className={cardClasses + " space-y-3"}>
                <h3 className="text-lg font-semibold text-gray-800">
                  Visibility
                </h3>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    disabled={isViewMode}
                    type="checkbox"
                    name="isFeatured"
                    checked={product.isFeatured}
                    onChange={handleInputChange}
                    className="h-5 w-5 rounded border-gray-300 text-[#99571d] focus:ring-blue-500"
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    disabled={isViewMode}
                    type="checkbox"
                    name="isNewArrival"
                    checked={product.isNewArrival}
                    onChange={handleInputChange}
                    className="h-5 w-5 rounded border-gray-300 text-[#99571d] focus:ring-blue-500"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              {offers.length > 0 && (
                <div>
                  <label htmlFor="offers" className={labelClasses}>
                    Offers
                  </label>

                  <div className={cardClasses + " space-y-3"}>
                    {offers.map((offer) => {
                      const offerId = String(offer._id);

                      // selected offers (handle both object & string)
                      const selectedOffers = Array.isArray(product.offer)
                        ? product.offer.map((o) =>
                            typeof o === "object" ? o._id : o
                          )
                        : [];

                      return (
                        <label
                          key={offerId}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="Offers"
                            value={offerId}
                            disabled={isViewMode}
                            checked={product.offer == offer._id}
                            onChange={(e) => {
                              const checked = e.target.checked;

                              setProduct((prev) => ({
                                ...prev,
                                offer: checked ? offer._id : "",
                              }));
                            }}
                            className="h-5 w-5 rounded border-gray-300 text-[#99571d] focus:ring-blue-500"
                          />
                          <span>{offer.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {tags.length > 0 && (
                <div>
                  <label htmlFor="tags" className={labelClasses}>
                    Tags
                  </label>

                  <div className={cardClasses + " space-y-3"}>
                    {tags.map((tag) => {
                      const tagId = String(tag._id);
                      const selectedTags = Array.isArray(product.tags)
                        ? product.tags.map((t) =>
                            typeof t === "object" ? t._id : t
                          )
                        : [];

                      return (
                        <label
                          key={tagId}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={tagId}
                            disabled={isViewMode}
                            checked={selectedTags.includes(tagId)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setProduct((prev) => {
                                const currentTags = Array.isArray(prev.tags)
                                  ? prev.tags.map((t) =>
                                      typeof t === "object" ? t._id : t
                                    )
                                  : [];

                                return {
                                  ...prev,
                                  tags: checked
                                    ? [...currentTags, tagId]
                                    : currentTags.filter((id) => id !== tagId),
                                };
                              });
                            }}
                            className="h-5 w-5 rounded border-gray-300 text-[#99571d] focus:ring-blue-500"
                          />
                          <span>{tag.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}


                
                <div>
                  <label htmlFor="tags" className={labelClasses}>
                    Hide Content
                  </label>

                  <div className={cardClasses + " space-y-3"}>
                   

<select         disabled={isViewMode} onChange={(e)=>handelhide(e)}  className="p-2 w-full mb-5  rounded border-gray-300 text-[#99571d] focus:ring-blue-500">
{Object.keys(product).map((itm,ind)=>{return(
  
<option value={itm} className="capitalize" key={ind} disabled={itm==="hidethings" || product.hidethings?.includes(itm) }>{itm}</option>
)
})}

</select>

<div className="flex flex-wrap gap-3">

{product.hidethings?.map((ite,ind)=>{return(
  <p key={ind} className="rounded-xl text-black   border border-[#d89962a2] px-3 py-1  flex gap-2 items-center justify-between"> <span className="capitalize">{ite}</span> <X onClick={()=>{!isViewMode && handelRemovehidden(ite)}} disabled={isViewMode}  className="text-red-700 cursor-pointer" size={17} /> </p>
)})}
</div>








                  </div>




                </div>
              
            </div>
          </div>
        </form>
        {/* ))} */}
      </div>
      <ImagePreviewModal
        src={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}
