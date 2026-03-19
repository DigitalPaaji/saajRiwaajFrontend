"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FiMail, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'
axios.defaults.withCredentials = true
const page = () => {
  const [allNewsLetter, setAllNewsLetter] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  const getNewsletter = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/newsletter/get`)
      const data = await response.data;
      if (data.success) {
        setAllNewsLetter(data.data)
      }
    } catch (error) {
      console.error("Error fetching newsletters:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getNewsletter()
  }, [])

  const handleDelete = async (id) => {
    // Add a quick confirmation so you don't delete by accident
    const isConfirmed = window.confirm("Are you sure you want to remove this subscriber?");
    if (!isConfirmed) return;

    try {
      // Assuming your backend expects the ID in the URL
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/newsletter/delete/${id}`);

      if (response.data.success) {
        toast.success(response.data.message)
        setAllNewsLetter(prev => prev.filter(subscriber => subscriber._id !== id));
      }
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      toast.error("Failed to delete subscriber.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiMail className="text-blue-600" />
          Newsletter Subscribers
        </h1>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          Total: {allNewsLetter.length}
        </span>
      </div>

      <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-4">Email Address</th>
                <th scope="col" className="px-6 py-4">Subscribed Date</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                /* Loading State */
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    Loading subscribers...
                  </td>
                </tr>
              ) : allNewsLetter.length === 0 ? (
                /* Empty State */
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                /* Data Rows */
                allNewsLetter.map((subscriber) => (
                  <tr
                    key={subscriber._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4">
                      {/* Formats the MongoDB timestamp into a readable date */}
                      {new Date(subscriber.createdAt || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(subscriber._id)}
                        className="p-2 text-red-600 hover:bg-red-50 hover:text-red-800 rounded-lg transition-colors"
                        title="Delete Subscriber"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default page