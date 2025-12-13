"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { 
  RxCross2, 
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiFileTextLine,
  RiCheckboxCircleLine,
  RiLoader4Line 
} from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";

const pages = [
  { label: "Terms & Conditions", value: "terms-conditions", icon: RiFileTextLine },
  { label: "Privacy Policy", value: "privacy-policy", icon: RiCheckboxCircleLine },
  { label: "Return / Refund", value: "refund-policy", icon: RiEditLine },
  { label: "Delivery Info", value: "delivery-information", icon: RiFileTextLine },
  { label: "About Us", value: "about-us", icon: RiFileTextLine },
  { label: "FAQ", value: "faq", icon: RiFileTextLine },
];

const Page = () => {
  const [pageType, setPageType] = useState("terms-conditions");
  const [heading, setHeading] = useState("");
  const [des, setDes] = useState("");
  const [pageData, setPageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("view"); 
  const [editId,setEditId] = useState()

  const handleAddContent = async () => {
    if (!heading || !des) {
      alert("Heading and content are required");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/pages/create`,
        { pageType, heading, des }
      );
      const data = await response.data;
      if (data.success) {
        setPageData(data.data.contant || []);
        setHeading("");
        setDes("");
        setActiveTab("view");
      }
    } catch (error) {
      console.error("Error adding content:", error);
      alert("Failed to add content");
    } finally {
      setSubmitting(false);
    }
  };



 const handleEditContent = async () => {
    if (!heading || !des) {
      alert("Heading and content are required");
      return;
    }
    

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/pages/update`,
        { pageType, heading, des, editId }
      );
      const data = await response.data;
      if (data.success) {
     fetchPages(pageType)
        setHeading("");
        setDes("");
        setActiveTab("view");
      }
    } catch (error) {
      console.error("Error adding content:", error);
      alert("Failed to add content");
    } finally {
      setSubmitting(false);
    }
  };



  const fetchPages = async (pageType) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/pages/get/${pageType}`
      );
      const data = await response.data;
      if (data.success) {
        setPageData(data?.data?.contant || []);
      } else {
        setPageData([]);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
      setPageData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/pages/delete`,
        {
          pageType,
          contentId: id,
        }
      );
      const data = await response.data;
      if (data.success) {
        fetchPages(pageType);
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      alert("Failed to delete content");
    }
  };

  useEffect(() => {
    fetchPages(pageType);
  }, []);

  useEffect(() => {
    fetchPages(pageType);
    setHeading("");
    setDes("");
    setActiveTab("view");
  }, [pageType]);

  const getPageTitle = () => {
    return pages.find((page) => page.value === pageType)?.label || pageType.replace("-", " ");
  };
  const addEdit=(data)=>{
    setHeading(data.heading)
    setDes(data.des)
    setEditId(data._id)
    setActiveTab("add")
console.log(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Page Content Management
          </h1>
          <p className="text-gray-600">Manage content for different pages of your website</p>
        </div>

        {/* Page Selection Tabs */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Select Page</h2>
          <div className="flex flex-wrap gap-3">
            {pages.map((page) => {
              const Icon = page.icon;
              return (
                <button
                  key={page.value}
                  onClick={() => setPageType(page.value)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 transform hover:scale-105
                    ${
                      pageType === page.value
                        ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-100"
                        : "bg-white text-gray-700 hover:bg-amber-50 hover:text-amber-600 border border-gray-200"
                    }
                  `}
                >
                  <Icon className={`text-lg ${pageType === page.value ? 'text-white' : 'text-amber-500'}`} />
                  <span className="font-medium">{page.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4 border-b border-amber-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                  {getPageTitle()}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {pageData.length} content items
                </p>
              </div>
              
              <div className="flex gap-2 bg-white rounded-lg p-1 border border-amber-200">
                <button
                  onClick={() => setActiveTab("view")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "view"
                      ? "bg-amber-500 text-white"
                      : "text-gray-600 hover:text-amber-600"
                  }`}
                >
                  View Content
                </button>
                <button
                  onClick={() => {setActiveTab("add"),setEditId(null)}}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeTab === "add"
                      ? "bg-amber-500 text-white"
                      : "text-gray-600 hover:text-amber-600"
                  }`}
                >
                  <RiAddLine />
                  Add New
                </button>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6">
            {activeTab === "view" ? (
              <div>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <RiLoader4Line className="text-4xl text-amber-500 animate-spin" />
                  </div>
                ) : pageData.length > 0 ? (
                  <div className="space-y-4">
                    {pageData.map((item, index) => (
                      <div
                        key={item._id}
                        className="group bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-5 hover:border-amber-300 transition-all duration-300 hover:shadow-md"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-semibold text-sm">
                                {index + 1}
                              </span>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {item.heading}
                              </h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed pl-11">
                              {item.des}
                            </p>
                          </div>
                    

                                                      <button
                            onClick={() => addEdit(item)}
                            className="opacity-0 group-hover:opacity-100 ml-4 p-2 rounded-lg text-green-500 hover:bg-red-50 transition-all duration-200"
                            title="edit"
                          >
                           
                             <MdModeEdit className="text-xl"/>
                            
                                                      </button>


      <button
                            onClick={() => handleDelete(item._id)}
                            className="opacity-0 group-hover:opacity-100 ml-4 p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-200"
                            title="Delete"
                          >
                            <RiDeleteBinLine className="text-xl" />
                       
                            
                                                      </button>


                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <RiFileTextLine className="text-3xl text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No content yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Add your first content item for this page
                    </p>
                    <button
                      onClick={() => {setActiveTab("add"),setEditId(null)}}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      <RiAddLine />
                      Add Content
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Add New Content
                  </h3>
                  <p className="text-gray-600">
                    Add content for {getPageTitle().toLowerCase()}
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Heading
                    </label>
                    <input
                      type="text"
                      placeholder="Enter section heading..."
                      value={heading}
                      onChange={(e) => setHeading(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Enter detailed content..."
                      value={des}
                      onChange={(e) => setDes(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
{editId? <button
                      onClick={handleEditContent}
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <RiLoader4Line className="animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <RiAddLine />
                          Edit Content
                        </>
                      )}
                    </button>:<button
                      onClick={handleAddContent}
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <RiLoader4Line className="animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <RiAddLine />
                          Add Content
                        </>
                      )}
                    </button>}

                    



                    <button
                      onClick={() => {
                        setActiveTab("view");
                        setHeading("");
                        setDes("");
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Changes are saved automatically. Content will appear on the live website.</p>
        </div>
      </div>
    </div>
  );
};

export default Page;