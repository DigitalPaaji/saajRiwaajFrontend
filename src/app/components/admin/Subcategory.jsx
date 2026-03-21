"use client";

import { useEffect, useState, useCallback } from "react";
import { FaPlus, FaEdit, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineDeleteForever, MdModeEditOutline } from "react-icons/md";
import PopupModal from "./ConfirmPopup";

const Subcategories = () => {
  const [tags, setTags] = useState([]); // This stores subcategories
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // New state to track the subcategory being edited
  const [editingTag, setEditingTag] = useState(null);

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/subcategory/`);
      const data = await res.json();
      setTags(data.cats || []);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
    fetchCategories();
  }, [fetchTags, fetchCategories]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return toast.warn("Please enter a subcategory name.");
    if (!selectedCategory) return toast.warn("Please select a category.");

    if (editingTag) {
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/subcategory/${editingTag._id}`, {
          method: "PUT", // 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newTag, category: selectedCategory }),
        });

        const data = await res.json();
        if (res.ok) {
          toast.success("Subcategory updated successfully!");
          cancelEdit();
          fetchTags();
        } else {
          toast.error(data.error || "Failed to update subcategory.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error updating subcategory.");
      }
    } else {
   
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/subcategory/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newTag, category: selectedCategory }),
        });

        const data = await res.json();
        if (res.ok) {
          toast.success("Subcategory added successfully!");
          setNewTag("");
          // Don't clear selectedCategory here so they can add multiple to the same parent easily
          fetchTags();
        } else {
          // Show specific MongoDB duplicate error
          if (data.error?.includes("duplicate") || data.error?.includes("E11000")) {
            toast.error("This subcategory already exists.");
          } else {
            toast.error(data.error || "Failed to add subcategory.");
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Error adding subcategory.");
      }
    }
  };

  const handleEditClick = (tag) => {
    setEditingTag(tag);
    setNewTag(tag.name);
   
    setSelectedCategory(tag.category); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingTag(null);
    setNewTag("");
    setSelectedCategory(""); 
  };

  const confirmDeleteTag = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/subcategory/${tagToDelete._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Subcategory deleted successfully!");
        if (editingTag && editingTag._id === tagToDelete._id) {
          cancelEdit();
        }
        fetchTags();
      } else {
        toast.error("Failed to delete subcategory.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setShowDeletePopup(false);
    }
  };

  return (
    <div className="w-full">
      <ToastContainer className="z-[9999]" autoClose={2000} />

      <h2 className="text-2xl font-serif capitalize mb-6 text-[#4d4c4b] drop-shadow-sm">
        Manage Subcategories
      </h2>

      <div className="my-6">
        <form onSubmit={handleSubmit} className="flex gap-2 justify-between flex-wrap xl:flex-nowrap items-center">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border px-3 py-2 w-full rounded-xl flex-1"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add new subcategory"
            className="border px-3 py-2 w-full rounded-xl flex-1"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-[#4d4c4b] hover:bg-[#272625] text-white px-4 py-2 rounded-xl shadow flex items-center min-w-[100px] justify-center"
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
                onClick={cancelEdit}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-xl shadow flex items-center transition"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-left ">
          <thead className="bg-[#4d4c4b] text-white text-xl font-medium">
            <tr className="font-mosetta text-sm">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Subcategory</th>
              <th className="px-4 py-3">Parent Category</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium">
            {tags.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No subcategories found.
                </td>
              </tr>
            ) : (
              tags.map((tag, index) => (
                <tr
                  key={tag._id}
                  className={`hover:bg-[#f3f2f1] transition border-b ${editingTag?._id === tag._id ? 'bg-[#fcf8f2]' : ''}`}
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 capitalize">{tag.name}</td>
                  <td className="px-4 py-3 capitalize">
                    {categories.find((c) => c._id === tag?.category)?.name || "—"}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showDeletePopup && (
        <PopupModal
          title={`Delete subcategory - '${tagToDelete?.name}'?`}
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
};

export default Subcategories; // Note: Export name updated to match standard practices if used as a standalone component