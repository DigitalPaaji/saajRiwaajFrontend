"use client"
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiHome, 
  FiMap, 
  FiGlobe 
} from 'react-icons/fi';

const AddressCompo = ({setAddressData,addressData}) => {
  const { user } = useSelector((state) => state.user);



  useEffect(() => {
    if (user) {
      setAddressData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address:user.address || prev.address,
      }));
    }
  }, [ user ]);

  // Handler for top-level fields (name, email, phone)
  const handleMainChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler for nested address fields
  const handleNestedChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  setCheckOutAddress(addressData)
   
  };

  return (
    <div className=" mx-auto p-4 md:p-8">
      <div className="bg-white/50 rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        
        <div className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <FiMapPin className="text-[#B67032]" />
            Shipping Address
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Please enter your delivery details below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- Personal Details Section --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={addressData.name}
                  onChange={handleMainChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#B67032]/20 focus:border-[#B67032] transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={addressData.email}
                  onChange={handleMainChange}
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#B67032]/20 focus:border-[#B67032] transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={addressData.phone}
                  onChange={handleMainChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#B67032]/20 focus:border-[#B67032] transition-all outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100 my-6" />

          {/* --- Address Section --- */}
          <div className="space-y-6">
            
            {/* Address Line */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Address Line (House No, Building, Street)</label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                  <FiHome className="text-gray-400" />
                </div>
                <textarea
                  name="addressLine"
                  value={addressData.address.addressLine}
                  onChange={handleNestedChange}
                  placeholder="123 Main Street, Appt 4B..."
                  rows="3"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#B67032]/20 focus:border-[#B67032] transition-all outline-none resize-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* City */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">City</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMap className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="city"
                    value={addressData.address.city}
                    onChange={handleNestedChange}
                    placeholder="Mumbai"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#B67032]/20 focus:border-[#B67032] transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* State */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">State</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="state"
                    value={addressData.address.state}
                    onChange={handleNestedChange}
                    placeholder="Maharashtra"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#B67032]/20 focus:border-[#B67032] transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Pincode */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">PIN Code</label>
                <input
                  type="text"
                  name="pincode"
                  value={addressData.address.pincode}
                  onChange={handleNestedChange}
                  placeholder="400001"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#B67032]/20 focus:border-[#B67032] transition-all outline-none"
                  required
                />
              </div>

              {/* Country */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Country</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiGlobe className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="country"
                    value={addressData.address.country}
                    onChange={handleNestedChange}
                    readOnly // Usually country is fixed for local stores, remove readOnly if needed
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed outline-none"
                  />
                </div>
              </div>
            </div>
          </div>


 
        </form>
      </div>
    </div>
  );
};

export default AddressCompo;