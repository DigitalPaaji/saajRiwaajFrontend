"use client";

import { useEffect, useState, useCallback } from "react";
import { FaEdit, FaPlus, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdModeEditOutline, MdOutlineDeleteForever } from "react-icons/md";
import PopupModal from "../../components/admin/ConfirmPopup";
import Subcategories from "../../components/admin/Subcategory";

const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  
  // New state to track the category being edited
  const [editingTag, setEditingTag] = useState(null);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/category/`);
      const data = await res.json();
      setTags(data.cats || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
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
    if (!newTag.trim()) return toast.warn("Please enter a category name.");

    if (editingTag) {
      // EDIT MODE
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/category/${editingTag._id}`, {
          method: "PUT", // Adjust to "PATCH" if your backend requires it
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newTag }),
        });

        const data = await res.json();
        if (res.ok) {
          toast.success("Category updated successfully!");
          setNewTag("");
          setEditingTag(null);
          fetchTags();
        } else {
          toast.error(data.message || "Failed to update category.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error updating category.");
      }
    } else {
      // ADD MODE
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/category/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newTag }),
        });

        const data = await res.json();
        if (res.ok) {
          toast.success("Category added successfully!");
          setNewTag("");
          fetchTags();
        } else {
          toast.error(data.message || "Failed to add category.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error adding category.");
      }
    }
  };

  const handleEditClick = (tag) => {
    setEditingTag(tag);
    setNewTag(tag.name);
    // Scroll to top if the form is far up the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingTag(null);
    setNewTag("");
  };

  const confirmDeleteTag = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/category/${tagToDelete._id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        toast.success("Category deleted successfully!");
        // If the deleted tag was being edited, clear the form
        if (editingTag && editingTag._id === tagToDelete._id) {
          cancelEdit();
        }
        fetchTags();
      } else {
        toast.error("Failed to delete category.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setShowDeletePopup(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-4 lg:p-6">
  
      <section className="w-full">
        <ToastContainer className="z-[9999]" />

        <h2 className="text-2xl font-mosetta text-[#99571d] mb-6 font-bold drop-shadow-sm">
          Manage Categories
        </h2>

        
        <div className="mb-6">
          <form
            onSubmit={handleSubmit}
            className="flex gap-3 justify-between flex-wrap items-center"
          >
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter category name"
              className="border border-gray-300 focus:ring-2 focus:ring-[#99571d] px-4 py-2 w-full flex-1 rounded-xl text-sm transition"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-[#4d4c4b] hover:bg-[#272625] text-white px-4 py-2 rounded-xl shadow flex items-center text-sm transition min-w-[100px] justify-center"
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
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-xl shadow flex items-center text-sm transition"
                >
                  <FaTimes className="mr-2" /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full text-left text-sm ">
            <thead className="font-mosetta bg-[#4d4c4b] text-white text-sm font-medium">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Category Name</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tags.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No categories found.
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
                    <td className="px-4 py-3 text-center flex justify-center gap-2">
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

        {/* Delete Confirmation Popup */}
        {showDeletePopup && (
          <PopupModal
            title={`Delete Category - '${tagToDelete?.name}'?`}
            message="This action cannot be undone."
            onCancel={() => setShowDeletePopup(false)}
            onConfirm={confirmDeleteTag}
            confirmText="Delete"
            cancelText="Cancel"
            type="delete"
            showCancel
          />
        )}
      </section>

      {/* Subcategories Section */}
      <section className="w-full">
        <Subcategories />
      </section>
    </div>
  );
};

export default TagsPage;