"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { UploadCloud, X, Loader2, Tag } from "lucide-react";
import Image from "next/image";
import { FaCheckCircle, FaPlus, FaRupeeSign } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useGlobalContext } from "../../../components/context/GlobalContext";
import { GrFormDown } from "react-icons/gr";

// IMPORTANT: Replace with your Cloudinary details
const CLOUDINARY_CLOUD_NAME = "dj0z0q0ut";
const CLOUDINARY_UPLOAD_PRESET = "saajRiwaajProducts";

// --- Reusable Tailwind Class Strings ---
const inputClasses =
  "w-full px-3 py-2 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg  transition duration-200 shadow-sm appearance-none";
const labelClasses = "block mb-1 text-sm font-medium text-gray-700";
const buttonClasses = {
  primary:
    "px-4 py-2 bg-[#4d4c4b] hover:bg-[#272625] text-white font-semibold rounded-lg shadow-sm focus:outline-none  transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center",
  destructive:
    "h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center transition-opacity",
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
  multiple,
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
      multiple
        ? onUpload(e.dataTransfer.files)
        : onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      multiple ? onUpload(e.target.files) : onUpload(e.target.files[0]);
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
          multiple={multiple}
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

      {images?.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative aspect-square group">
              <Image
                src={url}
                alt={`Preview ${index + 1}`}
                width={300}
                height={300}
                className="w-full h-full object-cover rounded-lg shadow-sm"
                unoptimized
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
  const [categories, setCategories] = useState([]);

  const [tags, setTags] = useState([]);

  const [subCategories, setSubCategories] = useState([]);
  const [errors, setErrors] = useState({
    images: "",
    variants: "",
    price: "",
    name: "",
    discount: "",
  });

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

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/category`);
      const data = await res.json();

      setCategories(data.cats || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/tag`);
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

  const [product, setProduct] = useState({
    name: "",
    category: "",
    subcategory: "",
    description: {
      paragraphs: [""],
      bulletPoints: [""],
    },
    offer: null,
    tags: [],
    isFeatured: false,
    isNewArrival: false,
    price: "",
    discount: "",
    images: [],
    colorVariants: [],
    barcode: null,
  });

  const [finalPrice, setFinalPrice] = useState("0.00");
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    setProduct((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === "category" ? { subcategory: "" } : {}),
    }));

    if (name === "category") {
      fetchSubCategoriesByCategory(value);
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

  const handleFileUploadBarcode = useCallback(async (file, type) => {
    const setIsLoading =
      type === "main" ? setIsMainUploading : setIsVariantUploading;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!data.secure_url) {
        throw new Error("Upload failed");
      }

      if (type === "main") {
        setProduct((prev) => ({
          ...prev,
          barcode: data.secure_url, // single image URL
        }));
      } else {
        // setVariant((prev) => ({ ...prev, barcode: data.secure_url }));
      }
    } catch (error) {
      toast.error(
        "Image upload failed. Please check credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddVariant = () => {
    if (!variant?.colorName) return toast.warning("Please enter a color name.");
    setProduct((prev) => ({
      ...prev,
      colorVariants: [...prev.colorVariants, variant],
    }));
    setVariant({ colorName: "", quantity: 1, images: [] }); // Reset for next variant
  };

  const removeVariant = (indexToRemove) => {
    setProduct((prev) => ({
      ...prev,
      colorVariants: prev.colorVariants.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {
      images: "",
      variants: "",
      price: "",
      name: "",
      discount: "",
    };
    let hasError = false;

    if (!product.name.trim()) {
      formErrors.name = "Product name is required.";
      hasError = true;
    }

    if (product.images.length === 0) {
      formErrors.images = "Please upload at least one product image.";
      hasError = true;
    }

    if (product.colorVariants.length === 0) {
      formErrors.variants = "Please add at least one color variant.";
      hasError = true;
    }

    if (!product.price || parseFloat(product.price) <= 0) {
      formErrors.price = "Please enter a valid price greater than 0.";
      hasError = true;
    }

    if (product.discount && (product.discount < 0 || product.discount > 90)) {
      formErrors.discount = "Discount must be between 0 and 90%.";
      hasError = true;
    }

    setErrors(formErrors);

    if (hasError) return; // stop submit if errors exist

    // --- Submit API ---
    const productToSubmit = {
      ...product,
      subcategory: subCategories.length > 0 ? product.subcategory : null,
      finalPrice: parseFloat(finalPrice),
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/product/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productToSubmit),
        }
      );

      const result = await response.json();

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      toast.success("Product added successfully!");

      // reset product
      setProduct({
        name: "",
        category: "",
        subcategory: "",
        description: { paragraphs: [""], bulletPoints: [""] },
        tags: [],
        offer: [],
        isFeatured: false,
        isNewArrival: false,
        price: "",
        discount: "",
        images: [],
        colorVariants: [],
      });
    } catch (error) {
      toast.error("Failed to add product. Check console for details.");
      console.error("Submission Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className=" ">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4 ">
            <h1 className="text-2xl font-bold font-mosetta  text-[#99571d] drop-shadow-sm">
              Add New Product
            </h1>
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer bg-[#4d4c4b] hover:bg-[#272625] text-white px-4 py-2 rounded-xl shadow transition duration-300 flex items-center"
            >
              <FaPlus className="mr-2" />{" "}
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Submitting..." : "Add Product"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <div className={cardClasses}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Product Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className={labelClasses}>
                      Product Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={product.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Elegant Diamond Necklace"
                      required
                      className={inputClasses}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className={labelClasses}>
                        Category
                      </label>
                      <select
                        name="category"
                        value={product?.category}
                        onChange={handleInputChange}
                        required
                        className={inputClasses}
                      >
                        <option value="" disabled>
                          Select a category
                        </option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div>
                        <label htmlFor="subcategory" className={labelClasses}>
                          Sub Category
                        </label>
                        <select
                          name="subcategory"
                          value={product.subcategory}
                          onChange={handleInputChange}
                          required={subCategories.length > 0}
                          disabled={
                            !product?.category || subCategories.length === 0
                          }
                          className={inputClasses}
                        >
                          <option value="">
                            {subCategories.length > 0
                              ? "Select a Sub Category"
                              : "No subcategory available"}
                          </option>
                          {subCategories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}>Paragraphs</label>

                    {product.description.paragraphs.map((para, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <textarea
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
                          className={inputClasses}
                          rows={2}
                          placeholder="Write a paragraph..."
                        />
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
                      </div>
                    ))}

                    <button
                      type="button"
                      className={buttonClasses.primary}
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
                  </div>

                  <div className="mt-6">
                    <label className={labelClasses}>Bullet Points</label>
                    {product.description.bulletPoints.map((point, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
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
                          className={inputClasses}
                          placeholder="Enter a feature or care tip..."
                        />
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
                      </div>
                    ))}
                    <button
                      type="button"
                      className={buttonClasses.primary}
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
                  </div>
                </div>
              </div>

              <div className={cardClasses}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Product Images
                </h3>
                <ImageUploader
                  onUpload={(files) => handleFileUpload(files, "main")}
                  onRemove={(idx) =>
                    setProduct((p) => ({
                      ...p,
                      images: p.images.filter((_, i) => i !== idx),
                    }))
                  }
                  images={product.images}
                  uploaderId="main-uploader"
                  isUploading={isMainUploading}
                  multiple={true}
                />
                {errors.images && (
                  <p className="text-red-500 text-sm mt-2">{errors.images}</p>
                )}
              </div>

              <div className={cardClasses}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Product Barcode
                </h3>

                <ImageUploader
                  onUpload={(file) => handleFileUploadBarcode(file, "main")}
                  onRemove={() =>
                    setProduct((p) => ({
                      ...p,
                      barcode: null,
                    }))
                  }
                  images={product.barcode ? [product.barcode] : []}
                  uploaderId="barcode-uploader"
                  isUploading={isMainUploading}
                  multiple={false}
                />

                {product.barcode && (
                  <div className="mt-4 relative w-40">
                    <Image
                      src={product.barcode}
                      alt="Barcode Preview"
                      width={200}
                      height={200}
                      className="rounded-lg border"
                      unoptimized
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                      onClick={() =>
                        setProduct((p) => ({ ...p, barcode: null }))
                      }
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className={cardClasses}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Color Variants
                </h3>
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="colorName" className={labelClasses}>
                        Color Name
                      </label>
                      <input
                        id="colorName"
                        placeholder="e.g., Rose Gold"
                        value={variant?.colorName}
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
                        <div className="grid grid-cols-5 top-full w-full left-0 gap-5 absolute bg-white p-4  z-50">
                          {product.images.map((img, idx) => (
                            <div className="relative" key={idx}>
                              {variant.images.includes(img) && (
                                <FaCheckCircle className="absolute top-3 right-3 text-red-600 font-bold text-xl shadow bg-white p-0 rounded-full" />
                              )}
                              <img
                                key={idx}
                                alt={`Product image ${idx + 1}`}
                                src={img}
                                width={300}
                                height={300}
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
                                className="w-40 h-40 object-cover rounded cursor-pointer"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* </select> */}

                    <div className="grid grid-cols-5 gap-3">
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
                              alt={`Product image ${index + 1}`}
                              width={300}
                              height={300}
                              className="w-40 h-40 object-cover rounded cursor-pointer"
                            />
                          </div>
                        );
                      })}
                    </div>


                  
                  {/* <div><label className={labelClasses}>Variant Images (Optional)</label><ImageUploader onUpload={(files) => handleFileUpload(files, 'variant')} onRemove={(idx) => setVariant(v => ({...v, images: v.images.filter((_, i) => i !== idx)}))} images={variant.images} uploaderId="variant-uploader" maxFiles={3} isUploading={isVariantUploading} /></div> */}
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className={buttonClasses.primary + " w-full"}
                  >
                    Add Variant
                  </button>
                </div>
                {errors.variants && (
                  <p className="text-red-500 text-sm mt-2">{errors.variants}</p>
                )}
                {product.colorVariants.length > 0 && (
                  <div className="space-y-2 pt-4">
                    <label className={labelClasses}>Added Variants</label>
                    <div className="flex flex-wrap gap-2">
                      {product.colorVariants.map((v, i) => (
                        <div
                          key={i}
                          className="bg-gray-100 rounded-lg p-2 flex items-center justify-between text-sm w-full"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {v?.colorName}
                            </span>
                            <span className="text-gray-500">
                              (Qty: {v?.quantity})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeVariant(i)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
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
                    className={"labelClasses + flex items-center"}
                  >
                    Price (<FaRupeeSign className="w-3 h-3 " />)
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={product.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                    className={inputClasses}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="discount"
                    className={"labelClasses + flex items-center"}
                  >
                    Discount (%)
                  </label>
                  <input
                    id="discount"
                    name="discount"
                    type="number"
                    value={product.discount ?? 0}
                    onChange={handleInputChange}
                    placeholder="0"
                    className={inputClasses}
                  />
                  {errors.discount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.discount}
                    </p>
                  )}
                </div>
                <div>
                  <label className={"labelClasses + flex items-center"}>
                    Final Price
                  </label>
                  <div className="p-2 mt-1 rounded-md bg-gray-100 font-semibold text-gray-700 flex items-center">
                   <input
                   
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
                    type="checkbox"
                    name="isNewArrival"
                    checked={product.isNewArrival}
                    onChange={handleInputChange}
                    className="h-5 w-5 rounded border-gray-300 text-[#99571d] focus:ring-blue-500"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <div>
                <label htmlFor="offer" className={labelClasses}>
                  Offer
                </label>
                <div className={cardClasses + " space-y-3"}>
                  {offers.map((offer) => {
                    const offerId = String(offer._id); // convert to string to avoid mismatch
                    return (
                      <label
                        key={offerId}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={offerId}
                          checked={product.offer.includes(offerId)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setProduct((prev) => ({
                              ...prev,
                              offer: checked
                                ? [...prev.offer, offerId]
                                : prev.offer.filter((id) => id !== offerId),
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

              <div>
                <label htmlFor="tags" className={labelClasses}>
                  Tags
                </label>
                <div className={cardClasses + " space-y-3"}>
                  {tags.map((tag) => {
                    const tagId = String(tag._id); // convert to string to avoid mismatch
                    return (
                      <label
                        key={tagId}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={tagId}
                          checked={product.tags.includes(tagId)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setProduct((prev) => ({
                              ...prev,
                              tags: checked
                                ? [...prev.tags, tagId]
                                : prev.tags.filter((id) => id !== tagId),
                            }));
                          }}
                          className="h-5 w-5 rounded border-gray-300 text-[#99571d] focus:ring-blue-500"
                        />
                        <span>{tag.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
