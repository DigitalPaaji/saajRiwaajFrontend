"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address!");
      return false;
    }

    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid phone number (10 digits)!");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/api/send-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Your request has been submitted!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error(data.error || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit form. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen ">
      {/* Decorative background pattern - subtle diamonds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-40 -right-40 w-80 h-80 border border-amber-200/50 rotate-45" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 border border-amber-200/50 rotate-45" />
        <div className="absolute top-1/3 left-1/4 w-40 h-40 border border-amber-300/30 rounded-full" />
        <div className="absolute bottom-1/4 right-1/3 w-60 h-60 border border-amber-300/30 rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400" />
            <span className="mx-3 text-amber-600 text-sm tracking-wider font-serif">TIMELESS ELEGANCE</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-light text-gray-800 mb-4">
            Let's Create <span className="text-amber-700 font-medium">Something Beautiful</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Whether you have a question about our collections, need a custom piece, or simply want to share your thoughts — our team is here to assist you.
          </p>
          <div className="flex justify-center mt-6">
            <div className="w-16 h-0.5 bg-gradient-to-r from-amber-300 to-amber-600 rounded-full" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="w-[] gap-12 lg:gap-16 items-start">
      

          {/* Right Column - Form */}
          <div className="bg-white rounded-3xl shadow-2xl border border-amber-100/80 overflow-hidden transition-all duration-500 hover:shadow-3xl">
            <div className="bg-gradient-to-r from-amber-50 to-white px-8 py-6 border-b border-amber-100">
              <h3 className="text-2xl font-serif font-semibold text-gray-800">Send an Inquiry</h3>
              <p className="text-gray-500 text-sm mt-1">We'll respond within 24 hours</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your elegant name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 focus:border-amber-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200/60 transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="hello@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 focus:border-amber-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200/60 transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 focus:border-amber-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200/60 transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Your Message <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your vision, custom request, or any question..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 focus:border-amber-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200/60 transition-all duration-200 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 px-6 py-4 text-white font-medium shadow-lg transition-all duration-300 hover:shadow-amber-200/50 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-amber-600 to-amber-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </button>
              <p className="text-xs text-center text-gray-400 mt-4">
                By submitting, you agree to our <a href="#" className="text-amber-600 hover:underline">Privacy Policy</a>
              </p>
            </form>

          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="light" toastClassName="rounded-xl shadow-lg" />
    </div>
  );
}