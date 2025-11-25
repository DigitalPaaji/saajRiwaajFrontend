"use client";

import { useEffect, useState, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PopupModal from "../../components/admin/ConfirmPopup";

const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/tag`);
      const data = await res.json();
 
      setTags(data.tags || []);
    } catch (err) {
      console.error("Error fetching tags:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return toast.warn("Please enter a tag name.");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/tag/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTag }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Tag added successfully!");
        setNewTag("");
        fetchTags();
      } else {
        toast.error(data.message || "Failed to add tag.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding tag.");
    }
  };

  const confirmDeleteTag = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/tag/${tagToDelete._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        

        await fetchTags();
        toast.success("Tag deleted successfully!");
      } 
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setShowDeletePopup(false);
    }
  };

  return (
    <div className="w-full">
      <ToastContainer className="z-[9999]" />
        <h2 className="text-2xl font-bold mb-6 text-[#4d4c4b] drop-shadow-sm">Manage Tags</h2>

      <div className=" my-6 ">
        <form onSubmit={handleAddTag} className="flex gap-2 justify-between flex-wrap ">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add new tag"
            className="border px-3 py-2 w-full rounded-xl"
          />
          <button
            type="submit"
            className="bg-[#4d4c4b] hover:bg-[#272625] text-white px-4 py-2 rounded-xl shadow flex items-center"
          >
            <FaPlus className="mr-2" /> Add
          </button>
        </form>
      </div>




      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-left">
          <thead className="bg-[#4d4c4b] text-white text-xl font-medium">
            <tr className="text-sm">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Tag Name</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium">
            {tags.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  No tags found.
                </td>
              </tr>
            ) : (
              tags.map((tag, index) => (
                <tr
                  key={tag._id}
                  className="hover:bg-[#f3f2f1] transition border-b"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 capitalize">{tag.name}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setShowDeletePopup(true);
                        setTagToDelete(tag);
                      }}
                      className="bg-[#dd4747e7] text-white cursor-pointer px-3 py-1 rounded hover:bg-[#ec4242e7] transition"
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

      {showDeletePopup && (
        <PopupModal
          title={`Delete tag - '${tagToDelete?.name}'?`}
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

export default TagsPage;
