"use client";

import { useEffect, useState, useCallback } from "react";
import { FaCloudUploadAlt, FaPlus, FaEdit, FaTimes } from "react-icons/fa";
import { MdModeEditOutline, MdOutlineDeleteForever } from "react-icons/md";
import { GiCancel } from "react-icons/gi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import PopupModal from "../../components/admin/ConfirmPopup";
import { base_url } from "@/app/components/store/utile"; // Ensure this path is correct

const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [tagName, setTagName] = useState("");
  const [imageFile, setImageFile] = useState(null); // Local file object for new uploads
  const [existingImage, setExistingImage] = useState(""); // URL string from DB for editing
  const [editingTag, setEditingTag] = useState(null);

  // Delete Modal State
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);

  const fetchTags = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/tag`);
      setTags(res.data.tags || []);
    } catch (err) {
      console.error("Error fetching tags:", err);
      toast.error("Failed to load tags.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // Combined Add/Edit Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tagName.trim()) return toast.warn("Please enter a tag name.");

    
    const formData = new FormData();
    formData.append("name", tagName);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editingTag) {
        // UPDATE Logic
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_LOCAL_PORT}/tag/${editingTag._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (res.data) {
          toast.success("Tag updated successfully!");
          resetForm();
          fetchTags();
        }
      } else {
        // ADD Logic
        const res = await axios.post(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/tag/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data) {
          toast.success("Tag added successfully!");
          resetForm();
          fetchTags();
        } else {
          toast.error(res.data.message || "Failed to add tag.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(editingTag ? "Error updating tag." : "Error adding tag.");
    }
  };

  const handleEditClick = (tag) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setExistingImage(tag.image || "");
    setImageFile(null); // Clear any pending new image uploads
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setTagName("");
    setImageFile(null);
    setExistingImage("");
    setEditingTag(null);
  };

  const confirmDeleteTag = async () => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/tag/${tagToDelete._id}`
      );

      if (res.status === 200 || res.status === 204) {
        toast.success("Tag deleted successfully!");
        if (editingTag && editingTag._id === tagToDelete._id) {
          resetForm(); 
        }
        fetchTags();
      } else {
        toast.error("Failed to delete tag.");
      }
    } catch (err) {
      toast.error("Something went wrong while deleting.");
    } finally {
      setShowDeletePopup(false);
    }
  };

 

  const handelToggle = async(id)=>{
    try {
      const response = await axios.put(`${base_url}/tag/toggle/${id}`);
      const data = await response.data;
      if(data.success){
        fetchTags()
        toast.success(data.message)
      }
    } catch (error) {
      
      toast.error(error.response.data.message)
    }
  }





  const previewSrc = imageFile
    ? URL.createObjectURL(imageFile)
    : existingImage
    ? `${base_url}/${existingImage}`
    : null;

  return (
    <div className="w-full p-4 lg:p-6">
      <ToastContainer className="z-[9999]" />
      
      <h2 className="text-2xl font-bold mb-6 text-[#4d4c4b] drop-shadow-sm">
        Manage Tags
      </h2>

      {/* Form Section */}
      <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Image Upload/Preview Area */}
          {previewSrc ? (
            <div className="relative h-40 w-full sm:w-1/2 lg:w-1/3 rounded-md border border-gray-200 overflow-hidden group shadow-sm">
              <img
                src={previewSrc}
                alt="Tag preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setExistingImage(""); // Clears the image entirely
                }}
                className="absolute top-2 right-2 flex items-center justify-center bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-md"
                title="Remove Image"
              >
                <GiCancel className="text-lg" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="tagImage"
              className="flex flex-col h-40 w-full sm:w-1/2 lg:w-1/3 cursor-pointer border-2 border-dashed border-gray-300 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-400 justify-center items-center rounded-md transition-all group"
            >
              <FaCloudUploadAlt className="text-4xl text-gray-400 group-hover:text-gray-500 transition-colors mb-2" />
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Upload Image
              </p>
              <span className="text-xs text-gray-400 mt-1">Click to browse files</span>
            </label>
          )}

          <input
            type="file"
            hidden
            accept="image/*"
            id="tagImage"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
          />

          {/* Input & Action Buttons */}
          <div className="flex gap-3 justify-between flex-wrap items-center">
            <input
              type="text"
              required
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Enter tag name"
              className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#99571d] px-4 py-2 w-full flex-1 rounded-xl text-sm transition"
            />
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-[#4d4c4b] hover:bg-[#272625] text-white px-5 py-2 rounded-xl shadow flex items-center text-sm transition min-w-[100px] justify-center"
              >
                {editingTag ? (
                  <>
                    <FaEdit className="mr-2" /> Update
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" /> Add
                  </>
                )}
              </button>

              {editingTag && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-xl shadow flex items-center text-sm transition"
                >
                  <FaTimes className="mr-2" /> Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Tags Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#4d4c4b] text-white text-sm font-medium">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Tag Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  Loading tags...
                </td>
              </tr>
            ) : tags.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500 italic">
                  No tags found.
                </td>
              </tr>
            ) : (
              tags.map((tag, index) => (
                <tr
                  key={tag._id}
                  className={`hover:bg-[#f3f2f1] transition border-b ${
                    editingTag?._id === tag._id ? "bg-[#fcf8f2]" : ""
                  }`}
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    {tag.image ? (
                      <img
                        src={`${base_url}/${tag.image}`}
                        alt={tag.name}
                        className="h-12 w-12 object-cover rounded shadow-sm border border-gray-200"
                      />
                    ) : (
                      <span className="text-xs text-gray-400 italic">No Image</span>
                    )}
                  </td>
                  <td className="px-4 py-3 capitalize font-medium">{tag.name}</td>
                  <td className="px-4 py-3 capitalize font-medium">
<div onClick={()=>handelToggle(tag._id)} className={` relative h-[25px] cursor-pointer rounded-2xl w-[50px]  ${tag.status? "bg-green-500" :"bg-red-500 "} duration-300 `}>

<div className={` absolute  w-1/2 h-full rounded-full border-2 top-0 ${tag.status? "bg-green-900  border-green-500 right-0":"bg-red-900  border-red-500 left-0"} duration-300`}>

</div>

</div>

                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(tag)}
                        className="text-[#47dd4ee7] hover:text-green-700 cursor-pointer transition"
                        title="Edit"
                      >
                        <MdModeEditOutline className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => {
                          setShowDeletePopup(true);
                          setTagToDelete(tag);
                        }}
                        className="text-[#dd4747e7] hover:text-red-700 cursor-pointer transition"
                        title="Delete"
                      >
                        <MdOutlineDeleteForever className="w-6 h-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      
      {showDeletePopup && (
        <PopupModal
          title={`Delete Tag - '${tagToDelete?.name}'?`}
          message="This action cannot be undone."
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
};

export default TagsPage;