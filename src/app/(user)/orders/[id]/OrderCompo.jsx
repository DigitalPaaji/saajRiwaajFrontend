"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiHome,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiCreditCard,
  FiCalendar,
  FiDollarSign,
  FiPercent
} from 'react-icons/fi';
import { FaIndianRupeeSign } from "react-icons/fa6";

import { FaRegGem, FaTag } from 'react-icons/fa';
import { TbPackageImport } from 'react-icons/tb';
import { MdLocalOffer } from 'react-icons/md';
import { TbTruckDelivery } from "react-icons/tb";



const OrderCompo = ({ id }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/order/user/${id}`
      );
      setOrder(response.data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'placed':
        return <FiClock className="text-[#B67032] text-xl" />;
      case 'processing':
        return <FiPackage className="text-[#B67032] text-xl" />;
      case 'shipped':
        return <FiTruck className="text-[#B67032] text-xl" />;
      case 'delivered':
        return <FiCheckCircle className="text-[#B67032] text-xl" />;
      default:
        return <FiPackage className="text-[#B67032] text-xl" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'placed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getColorName = (item) => {
    if (!item.product.colorVariants) return 'N/A';
    const colorVariant = item.product.colorVariants.find(
      variant => variant._id === item.color
    );
    return colorVariant?.colorName || 'N/A';
  };

  const calculateSavings = (order) => {
    let totalOriginal = 0;
    let totalDiscounted = 0;
    
    order.items.forEach(item => {
      totalOriginal += item.product.price * item.quantity;
      totalDiscounted += item.price * item.quantity;
    });
    
    return {
      totalOriginal,
      totalDiscounted,
      savings: totalOriginal - totalDiscounted
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#B67032] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <FaRegGem className="text-6xl text-[#B67032] mx-auto mb-4 opacity-50" />
          <p className="text-gray-600">No order found</p>
          <button
            onClick={fetchData}
            className="mt-4 px-6 py-2 bg-[#B67032] text-white rounded-lg hover:bg-[#a56129] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const savings = calculateSavings(order);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-[#B67032] mb-2 flex items-center font-serif gap-2">
                <TbPackageImport className="text-[#B67032]" />
                Order Details
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-gray-600">Order ID: {order._id}</p>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                  {order.paymentMethod}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Order Date</div>
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <FiCalendar className="text-[#B67032]" />
                {formatDate(order.createdAt)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#d4af37]/40 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.orderStatus)}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Order Status</h2>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      order.orderStatus
                    )}`}>
                      {order.orderStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
                {order.trackingnumber && (
                  <div className="sm:text-right">
                    <div className="text-sm text-gray-500">Tracking Number</div>
                    <div className="text-gray-700 font-medium">{order.trackingnumber}</div>
                  </div>
                )}
              </div>

              {/* Status Progress Bar */}
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#B67032] bg-[#B67032]/10">
                    Placed
                  </div>
                  <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#B67032] bg-[#B67032]/10">
                    Confirmed
                  </div>
                  <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#B67032] bg-[#B67032]/10">
                    Shipped
                  </div>
                  <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#B67032] bg-[#B67032]/10">
                    Delivered
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-amber-100">
                  <div
                    style={{ width: 
                      order.orderStatus === 'placed' ? '25%' : 
                      order.orderStatus === 'confirmed' ? '50%' : 
                      order.orderStatus === 'shipped' ? '75%' : '100%'
                    }}
                    className="shadow-none flex flex-col text-end whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#B67032] to-[#d4af37]"
                  >
                 
                  </div>
                    <TbTruckDelivery  className=' font-bold text-[#02861e]  object-cover '/> 
                </div>
              </div>
            </div>

            {/* Items Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#d4af37]/40 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FiShoppingBag className="text-[#B67032]" />
                Order Items ({order.items.length})
              </h2>
              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <div key={item._id} className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-full h-60 md:w-24 md:h-24 flex-shrink-0 ">
                      <img
                      loading="lazy"
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-contain object-left md:object-cover md:rounded-lg  md:border md:border-[#d4af37]/30"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100/FAF3E0/B67032?text=Jewelry';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{item.product.name}</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                              Color: {getColorName(item)}
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-[#B67032]">
                              ₹{item.price.toLocaleString('en-IN')}
                            </span>
                            {item.product.discount > 0 && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{item.product.price.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          {item.product.discount > 0 && (
                            <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                              <FiPercent className="text-xs" />
                              {item.product.discount}% OFF
                            </div>
                          )}
                        </div>
                      </div>
                      {item.product.description?.paragraphs && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {item.product.description.paragraphs[0]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Information */}
          <div className="space-y-8">
            {/* Payment Summary */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#d4af37]/40 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FaIndianRupeeSign  className="text-[#B67032]" />
                Payment Summary
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Original Total</span>
                  <span className="text-gray-700">₹{savings.totalOriginal.toLocaleString('en-IN')}</span>
                </div>
                
                {savings.savings > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-1">
                      <FaTag className="text-green-500" />
                      Discounts Applied
                    </span>
                    <span className="text-green-600 font-medium">
                      -₹{savings.savings.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-[#B67032]">
                      ₹{order.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-800 flex items-center gap-1">
                      <FiCreditCard className="text-[#B67032]" />
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600">Payment Status</span>
                    <span className={`font-medium px-2 py-1 rounded ${
                      order.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#d4af37]/40 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FiMapPin className="text-[#B67032]" />
                Shipping Address
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiHome className="text-[#B67032] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{order.shippingAddress.name}</p>
                    <p className="text-gray-600 mt-1">{order.shippingAddress.addressLine}</p>
                    <p className="text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </p>
                    <p className="text-gray-600">
                      {order.shippingAddress.country} - {order.shippingAddress.pincode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="text-[#B67032] flex-shrink-0" />
                  <span className="text-gray-600">{order.shippingAddress.phone}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#d4af37]/40 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FaRegGem className="text-[#B67032]" />
                Customer Information
              </h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-800">{order.userId.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{order.userId.email}</p>
                </div>
                {order.userPhone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">{order.userPhone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Actions */}
            {order.orderStatus === 'placed' && (
              <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-[#B67032] text-white rounded-lg hover:bg-[#a56129] transition-colors font-medium">
                    Track Order
                  </button>
                  <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium">
                    Cancel Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-[#d4af37]/40 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <FiClock className="text-2xl text-[#B67032] mx-auto mb-2" />
              <p className="text-sm text-gray-600">Order Placed</p>
              <p className="font-medium text-gray-800">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-center">
              <FiTruck className="text-2xl text-[#B67032] mx-auto mb-2" />
              <p className="text-sm text-gray-600">Expected Delivery</p>
              <p className="font-medium text-gray-800">5-7 Business Days</p>
            </div>
            <div className="text-center">
              <MdLocalOffer className="text-2xl text-[#B67032] mx-auto mb-2" />
              <p className="text-sm text-gray-600">Total Savings</p>
              <p className="font-medium text-green-600">
                ₹{savings.savings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>If you have any questions about your order, please contact our customer support.</p>
          <p className="mt-1 text-[#B67032] font-medium">Thank you for shopping with Saajriwaaj!</p>
        </div>
      </div>
    </div>
  );
};

export default OrderCompo;