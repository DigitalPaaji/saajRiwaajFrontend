"use client";
import React, { useEffect, useState, useRef } from 'react';
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
  FiPercent,
  FiDownload,
  FiPrinter
} from 'react-icons/fi';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaRegGem, FaTag } from 'react-icons/fa';
import { TbPackageImport } from 'react-icons/tb';
import { MdLocalOffer } from 'react-icons/md';
import { TbTruckDelivery } from "react-icons/tb";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const OrderCompo = ({ id }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const invoiceRef = useRef(null);

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
    if (!order || !order.items) return { totalOriginal: 0, totalDiscounted: 0, savings: 0 };
    
    let totalOriginal = 0;
    let totalDiscounted = 0;
    
    order.items.forEach(item => {
      totalOriginal += (item.product?.price || 0) * item.quantity;
      totalDiscounted += (item.price || 0) * item.quantity;
    });
    
    return {
      totalOriginal,
      totalDiscounted,
      savings: totalOriginal - totalDiscounted
    };
  };

  const generateInvoice = async () => {
    if (!order || generatingInvoice) return;
    
    setGeneratingInvoice(true);
    
    try {
      const input = invoiceRef.current;
      
        
      const tempElement = document.createElement('div');
      tempElement.innerHTML = generateInvoiceHTML();
      document.body.appendChild(tempElement);
      
      // Remove any unsupported CSS before capturing
      const unsupportedStyles = document.querySelectorAll('style');
      unsupportedStyles.forEach(style => {
        if (style.textContent.includes('oklch')) {
          style.remove();
        }
      });

      const canvas = await html2canvas(tempElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        ignoreElements: (element) => {
         
          const style = window.getComputedStyle(element);
          const bg = style.background || style.backgroundColor;
          return bg && bg.includes('oklch');
        }
      });

      // Remove temporary element
      document.body.removeChild(tempElement);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`Invoice_${order._id}_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating invoice:', error);
      
      // Fallback: Create a simpler PDF
      try {
        const pdf = new jsPDF();
        pdf.text(`Invoice - Order ID: ${order._id}`, 20, 20);
        pdf.text(`Date: ${formatDate(order.createdAt)}`, 20, 30);
        pdf.text(`Total: ₹${order.amount.toLocaleString('en-IN')}`, 20, 40);
        pdf.text('Thank you for your purchase!', 20, 50);
        pdf.save(`Invoice_${order._id}_simple.pdf`);
      } catch (fallbackError) {
        console.error('Fallback invoice failed:', fallbackError);
        alert('Failed to generate invoice. Please try again or contact support.');
      }
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const generateInvoiceHTML = () => {
    const savings = calculateSavings(order);
    
    return `
      <div style="font-family: 'Arial', sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; background: white;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #B67032;">
          <div>
            <h1 style="color: #B67032; font-size: 32px; margin: 0 0 10px 0; font-weight: bold;">Saajriwaaj</h1>
            <p style="color: #666; margin: 0;">Premium Jewelry & Accessories</p>
            <p style="color: #666; margin: 10px 0 0 0; font-weight: bold;">INVOICE</p>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 24px; font-weight: bold; color: #333; margin: 0 0 10px 0;">Invoice #${order._id}</p>
            <p style="color: #666; margin: 5px 0;">Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
            <p style="color: #666; margin: 5px 0;">Status: <span style="font-weight: bold; color: ${order.paymentStatus === 'paid' ? '#10B981' : '#EF4444'}">
              ${order.paymentStatus.toUpperCase()}
            </span></p>
          </div>
        </div>

        <!-- Company and Customer Info -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px;">
          <div>
            <h3 style="color: #333; font-size: 18px; margin: 0 0 10px 0; font-weight: bold;">Billed From:</h3>
            <p style="color: #B67032; font-weight: bold; margin: 5px 0;">Saajriwaaj Enterprises</p>
            <p style="color: #666; margin: 5px 0;">123 Jewel Street, Gem City</p>
            <p style="color: #666; margin: 5px 0;">Mumbai, Maharashtra 400001</p>
            <p style="color: #666; margin: 5px 0;">India</p>
            <p style="color: #666; margin: 10px 0 0 0;">GSTIN: 27ABCDE1234F1Z5</p>
          </div>
          <div>
            <h3 style="color: #333; font-size: 18px; margin: 0 0 10px 0; font-weight: bold;">Billed To:</h3>
            <p style="color: #333; font-weight: bold; margin: 5px 0;">${order.shippingAddress?.name || 'N/A'}</p>
            <p style="color: #666; margin: 5px 0;">${order.shippingAddress?.addressLine || 'N/A'}</p>
            <p style="color: #666; margin: 5px 0;">${order.shippingAddress?.city || 'N/A'}, ${order.shippingAddress?.state || 'N/A'}</p>
            <p style="color: #666; margin: 5px 0;">${order.shippingAddress?.country || 'N/A'} - ${order.shippingAddress?.pincode || 'N/A'}</p>
            <p style="color: #666; margin: 10px 0 0 0;">Phone: ${order.shippingAddress?.phone || order.userPhone || 'N/A'}</p>
            <p style="color: #666; margin: 5px 0;">Email: ${order.userId?.email || 'N/A'}</p>
          </div>
        </div>

        <!-- Order Items Table -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; font-size: 18px; margin: 0 0 15px 0; font-weight: bold;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #FEF3C7;">
                <th style="text-align: left; padding: 12px; border: 1px solid #FBBF24; color: #92400E; font-weight: bold;">#</th>
                <th style="text-align: left; padding: 12px; border: 1px solid #FBBF24; color: #92400E; font-weight: bold;">Item</th>
                <th style="text-align: left; padding: 12px; border: 1px solid #FBBF24; color: #92400E; font-weight: bold;">Color</th>
                <th style="text-align: left; padding: 12px; border: 1px solid #FBBF24; color: #92400E; font-weight: bold;">Qty</th>
                <th style="text-align: left; padding: 12px; border: 1px solid #FBBF24; color: #92400E; font-weight: bold;">Unit Price</th>
                <th style="text-align: left; padding: 12px; border: 1px solid #FBBF24; color: #92400E; font-weight: bold;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map((item, index) => `
                <tr style="${index % 2 === 0 ? 'background-color: #FFF7ED;' : ''}">
                  <td style="padding: 12px; border: 1px solid #FBBF24; color: #666;">${index + 1}</td>
                  <td style="padding: 12px; border: 1px solid #FBBF24; color: #333; font-weight: bold;">${item.product?.name || 'N/A'}</td>
                  <td style="padding: 12px; border: 1px solid #FBBF24; color: #666;">${getColorName(item)}</td>
                  <td style="padding: 12px; border: 1px solid #FBBF24; color: #666;">${item.quantity}</td>
                  <td style="padding: 12px; border: 1px solid #FBBF24; color: #666;">₹${(item.product?.price || 0).toLocaleString('en-IN')}</td>
                  <td style="padding: 12px; border: 1px solid #FBBF24; color: #B67032; font-weight: bold;">₹${((item.price || 0) * item.quantity).toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Summary Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
          <div>
            <h3 style="color: #333; font-size: 18px; margin: 0 0 15px 0; font-weight: bold;">Order Details</h3>
            <div style="color: #666; line-height: 1.8;">
              <p><strong>Order ID:</strong> ${order._id}</p>
              <p><strong>Order Date:</strong> ${formatDate(order.createdAt)}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
              <p><strong>Shipping:</strong> Standard Delivery</p>
              ${order.trackingnumber ? `<p><strong>Tracking #:</strong> ${order.trackingnumber}</p>` : ''}
            </div>
          </div>
          
          <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px;">
            <h3 style="color: #333; font-size: 18px; margin: 0 0 15px 0; font-weight: bold;">Payment Summary</h3>
            <div style="color: #666; line-height: 2;">
              <div style="display: flex; justify-content: space-between;">
                <span>Subtotal:</span>
                <span>₹${savings.totalOriginal.toLocaleString('en-IN')}</span>
              </div>
              ${savings.savings > 0 ? `
                <div style="display: flex; justify-content: space-between; color: #10B981;">
                  <span>Discount:</span>
                  <span>-₹${savings.savings.toFixed(2)}</span>
                </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #FBBF24; margin-top: 10px; font-weight: bold;">
                <span style="color: #333;">Total Amount:</span>
                <span style="color: #B67032; font-size: 24px;">₹${order.amount.toLocaleString('en-IN')}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #FBBF24; margin-top: 10px;">
                <span>Payment Status:</span>
                <span style="font-weight: bold; color: ${order.paymentStatus === 'paid' ? '#10B981' : '#EF4444'}">
                  ${order.paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #FBBF24; text-align: center; color: #666;">
          <p style="color: #B67032; font-weight: bold; margin-bottom: 10px; font-size: 18px;">Thank you for your business!</p>
          <p style="margin: 5px 0;">This is a computer-generated invoice and does not require a signature.</p>
          <p style="margin: 5px 0;">For any queries, contact: support@saajriwaaj.com | +91 9876543210</p>
          <p style="margin: 20px 0 0 0; font-size: 14px;">Terms & Conditions: All items are subject to availability. Prices are inclusive of GST.</p>
        </div>
      </div>
    `;
  };

  // Fix for password field warning (if this is a separate issue)
  // Make sure all password inputs are wrapped in forms
  const renderPasswordFieldFix = () => {
    return (
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Your password input field */}
      </form>
    );
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
        {/* Header with Invoice Button */}
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Order Date</div>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <FiCalendar className="text-[#B67032]" />
                  {formatDate(order.createdAt)}
                </div>
              </div>
              <button
                onClick={generateInvoice}
                disabled={generatingInvoice}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#B67032] to-[#d4af37] text-white rounded-lg hover:from-[#a56129] hover:to-[#c19b2b] transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {generatingInvoice ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FiDownload className="text-lg" />
                    Download Invoice
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Template (Hidden for PDF generation) */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div 
            ref={invoiceRef} 
            id="invoice-template"
            style={{ 
              width: '800px', 
              padding: '40px',
              backgroundColor: 'white',
              color: '#333',
              fontFamily: 'Arial, sans-serif'
            }}
            dangerouslySetInnerHTML={{ __html: generateInvoiceHTML() }}
          />
        </div>

        {/* Rest of your UI remains the same */}
        {/* ... rest of your existing UI code ... */}
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
                  <TbTruckDelivery className='font-bold text-[#02861e] object-cover'/> 
                </div>
              </div>
            </div>

            {/* Items Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#d4af37]/40 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FiShoppingBag className="text-[#B67032]" />
                Order Items ({order.items?.length || 0})
              </h2>
              <div className="space-y-6">
                {order.items?.map((item, index) => (
                  <div key={item._id || index} className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                   <div className="relative w-full h-60 md:w-24 md:h-24 flex-shrink-0">
  <Image
    src={
      item.product?.images?.[0]
        ? `${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${item.product.images[0]}`
        : "https://via.placeholder.com/100x100/FAF3E0/B67032?text=Jewelry"
    }
    alt={item.product?.name || "Product"}
    fill
    sizes="(max-width: 768px) 100vw, 96px"
    className="object-contain object-left md:object-cover md:rounded-lg md:border md:border-[#d4af37]/30"
  />
</div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{item.product?.name || 'Product'}</h3>
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
                              ₹{(item.price || 0).toLocaleString('en-IN')}
                            </span>
                            {item.product?.discount > 0 && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{(item.product?.price || 0).toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          {item.product?.discount > 0 && (
                            <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                              <FiPercent className="text-xs" />
                              {item.product.discount}% OFF
                            </div>
                          )}
                        </div>
                      </div>
                      {item.product?.description?.paragraphs && (
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
                <FaIndianRupeeSign className="text-[#B67032]" />
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
                    <p className="font-medium text-gray-800">{order.shippingAddress?.name || 'N/A'}</p>
                    <p className="text-gray-600 mt-1">{order.shippingAddress?.addressLine || 'N/A'}</p>
                    <p className="text-gray-600">
                      {order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.state || 'N/A'}
                    </p>
                    <p className="text-gray-600">
                      {order.shippingAddress?.country || 'N/A'} - {order.shippingAddress?.pincode || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="text-[#B67032] flex-shrink-0" />
                  <span className="text-gray-600">{order.shippingAddress?.phone || order.userPhone || 'N/A'}</span>
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
                  <p className="font-medium text-gray-800">{order.userId?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{order.userId?.email || 'N/A'}</p>
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
            <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={generateInvoice}
                  disabled={generatingInvoice}
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#B67032] to-[#d4af37] text-white rounded-lg hover:from-[#a56129] hover:to-[#c19b2b] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {generatingInvoice ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating Invoice...
                    </>
                  ) : (
                    <>
                      <FiPrinter />
                      Print Invoice
                    </>
                  )}
                </button>
                <button className="w-full px-4 py-2 border border-[#B67032] text-[#B67032] rounded-lg hover:bg-amber-50 transition-colors font-medium">
                  Track Order
                </button>
                {order.orderStatus === 'placed' && (
                  <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium">
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-[#d4af37]/40 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <div className="text-center">
              <FiDownload className="text-2xl text-[#B67032] mx-auto mb-2" />
              <p className="text-sm text-gray-600">Invoice</p>
              <button
                onClick={generateInvoice}
                className="text-[#B67032] font-medium hover:underline"
                disabled={generatingInvoice}
              >
                {generatingInvoice ? 'Generating...' : 'Download PDF'}
              </button>
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