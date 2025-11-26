"use client";

import Banner from "../../components/user/InnerBanner";
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
    <div className="bg">
    
      {/* <Banner title="Contact Us" image="/contact-banner.jpg" /> */}

      <div className="px-4 sm:px-8 lg:px-24 xl:px-60 mx-auto py-16">
        <div className="max-w-3xl mx-auto">
         
          <h3 className="text-2xl font-semibold mb-8 text-center text-[#B67032]">
            Any Questions? <br />
            <span className="text-gray-700 text-4xl font-normal">Let Us Know!</span>
          </h3>

          <ToastContainer />

    
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6 bg-white rounded-2xl border border-[#d4af37]/40 shadow-sm hover:shadow-md transition-shadow duration-300 p-8"
          >
       
            <div>
              <label className="block mb-2 font-medium">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-[#d4af37]/40 px-4 py-3 bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40"
              />
            </div>

       
            <div>
              <label className="block mb-2 font-medium">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#d4af37]/40 px-4 py-3 bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40"
              />
            </div>

          
            <div>
              <label className="block mb-2 font-medium">Phone *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full rounded-xl border border-[#d4af37]/40 px-4 py-3 bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40"
              />
            </div>

        
            <div>
              <label className="block mb-2 font-medium">Message *</label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Write your message here..."
                className="w-full rounded-xl border border-[#d4af37]/40 px-4 py-3 bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40"
              ></textarea>
            </div>


            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#b67032e8] text-white px-10 py-3 rounded-xl hover:bg-[#B67032] transition duration-300 shadow-md"
              >
                {isSubmitting ? "Submitting..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
