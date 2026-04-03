"use client";
import { X, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { base_url } from "../store/utile";
// Assuming you still need these if they are used elsewhere in your app:
// import { useGlobalContext } from "../context/GlobalContext";
// import Account from "./Account";

export default function AuthSidebar({ isAuthOpen, setIsAuthOpen }) {
  const [form, setForm] = useState({ email: "" });
  const [showOtpFields, setShowOtpFields] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [errors, setErrors] = useState({ email: "" });
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const inputRef = useRef([]);

  const handleSendOtp = async () => {
    const { email } = form;
    let emailError = "";

    if (!email) {
      emailError = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) emailError = "Invalid email format.";
    }

    if (emailError) {
      setErrors({ email: emailError });
      return;
    }
    
    setErrors({ email: "" });
    setIsLoading(true);

    try {
      const response = await axios.post(`${base_url}/user/loginUser`, form);
      const data = response.data;
      
      if (data.success) {
        toast.success(data.message);
        setShowOtpFields(true);
        setTimeout(() => inputRef.current[0]?.focus(), 50);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const token = credentialResponse.credential;
    setIsLoading(true);
 const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    try {
      const response = await axios.post(
        `${base_url}/user/loginUser/google`,
        {  token2: token,
           cart,
           wishlist, }
      );
      const data = await response.data;
        if (data.success) {
  
        localStorage.removeItem("cart");
        localStorage.removeItem("wishlist");
        toast.success(data.message);
        location.reload();
      }
     
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        (error.response?.data?.errors && Object.values(error.response.data.errors)[0]?.message) || 
        "Google Login failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

  
    if (element.value !== "" && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const verifyOtp = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    setIsLoading(true);

    try {
      // Safely parse local storage
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      const response = await axios.post(`${base_url}/user/verifyotp`, {
        email: form.email,
        otp: fullOtp,
        cart,
        wishlist,
      });

      const data = response.data;
      if (data.success) {
  
        localStorage.removeItem("cart");
        localStorage.removeItem("wishlist");
        toast.success(data.message);
        location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isAuthOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[998]"
          onClick={() => !isLoading && setIsAuthOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-[90%] md:w-[40%] xl:w-[25%] bg-white shadow-lg z-[999] transition-transform duration-300 ${
          isAuthOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-6 border-b-[1px] border-[#292927]">
          <h2 className="text-lg montserrat">Customer Login</h2>
          <button onClick={() => setIsAuthOpen(false)} disabled={isLoading}>
            <X className="w-5 h-5 text-gray-600 hover:text-black" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ email: e.target.value })}
              className={`w-full border p-2 rounded outline-none transition-all ${
                errors.email ? "border-red-500" : "border-gray-400 focus:border-[#292927]"
              } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={showOtpFields || isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {showOtpFields && (
            <div className="py-2">
              <p className="text-gray-600 font-medium mb-3 text-center">
                Enter Verification Code
              </p>
              <div className="flex justify-between gap-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    ref={(elm) => (inputRef.current[index] = elm)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onChange={(e) => handleChange(e.target, index)}
                    disabled={isLoading}
                    className="w-10 h-10 md:w-12 md:h-12 border-2 rounded-lg text-center text-xl text-gray-800 bg-white outline-none transition-all border-gray-400 focus:border-[#292927] focus:ring-2 focus:ring-[#e2ad7f] disabled:opacity-60"
                  />
                ))}
              </div>
            </div>
          )}

          {!showOtpFields ? (
            <button
              className="w-full bg-[#292927] hover:bg-[#292927] transition-colors text-white py-2 rounded flex justify-center items-center h-10 disabled:opacity-70"
              onClick={handleSendOtp}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send OTP"}
            </button>
          ) : (
            <button
              className="w-full bg-[#292927] hover:bg-[#292927] transition-colors text-white py-2 rounded flex justify-center items-center h-10 disabled:opacity-70"
              onClick={verifyOtp}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify OTP"}
            </button>
          )}

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink-0 mx-4 text-sm text-stone-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex justify-center pointer-events-auto">
            <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
               <GoogleLogin 
                 onSuccess={handleGoogleLogin} 
                 onError={() => toast.error("Google Login Failed")} 
               />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}