"use client";
import Image from "next/image";
import Link from "next/link";

import { useGlobalContext } from "../../components/context/GlobalContext";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";


export default function AuthSidebar() {
  const { forgotPassword } = useGlobalContext();
  const [form, setForm] = useState({
 
    email: "",
    password: "",

  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleForgotPassword = async () => {
    if (timer > 0) return; // Block if still in cooldown
 const { email } = form; // Get email from state
  if (!email) {
  setError("Please enter your email first.");
    return;
  }
    // Call your forgot password API
    const { ok, message } = await forgotPassword(email);
    if (ok) {
      setError("Password reset link sent! Valid for 5 minutes.");
      setLinkSent(true);
      setTimer(300); // 5 minutes in seconds
    } else {
      toast.error(message);
    }
  };
  const loginAdmin = async ({email,password})=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/user/loginAdmin`,{
      method:'POST',
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify({ email, password }),
      credentials:'include',
    })
    const data = await res.json()
       if (!res.ok) {
    const errorMessage =
      data.message ||
      (data.errors && Object.values(data.errors)[0]?.message) ||
      "Login failed.";
    throw new Error(errorMessage);
  }
if (!data.user.role?.includes("admin")) {
  throw new Error("You are not authorized as admin");
}

  localStorage.setItem('saajAdmin',JSON.stringify(data.user))
  localStorage.setItem('saajAdminToken', data.token)

    // setUser(data.user)
  

  return data;
  }


  const handleLogin = async () => {
    const {email, password} = form;
    let errors ={}
     if (!email) {
      errors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) errors.email = "Invalid email format.";
    }

    if(!password) errors.password = "Password is required.";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setError("");
    setFieldErrors({});
    try {
    const data = await loginAdmin({ email, password });
    toast.success("Login Successful!");
    console.log("Logged In User:", data.user);

    // You can save user in localStorage or context here
    setForm({  email: "", password: "" });
if (data.user.role.includes("admin")) {
      window.location.href = "/admin";
    }
  } catch (err) {
    // console.error("Login Error:", err);
    setError(err.message || "Something went wrong.");
  }
  }
  
  return (
    <div className="md:grid grid-cols-2 ">
   <div className="hidden md:block">
    <Image alt="" src={'/Images/admin.webp'} width={400} height={400} className="w-full h-screen object-cover"/>
    {/* <Image alt="" src={'/Images/admin.webp'} width={400} height={400} className="w-full h-auto object-cover"/>
    <Image alt="" src={'/Images/admin.webp'} width={400} height={400} className="w-full h-auto object-cover"/>
    <Image alt="" src={'/Images/admin.webp'} width={400} height={400} className="w-full h-auto object-cover"/> */}

   </div>

    <div className="flex items-center justify-center px-4 min-h-screen bg-gradient-to-b from-[#FAF7F2] to-[#F5E8DA]">
      <ToastContainer />
      <div className="w-full max-w-md  rounded-2xl  overflow-hidden ">
        
        {/* Logo */}
        <div className="flex justify-center py-8 ">
          <Link href="/" className="flex-shrink-0 group">
            <Image
            width={400}
            height={400}
              src="/Images/logo.webp"
              alt="Saaj Riwaaj Logo"
              className="h-14 w-auto transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Title */}
        <div className="px-6 py-4 border-b border-[#E6D3C1]">
          <h2 className="text-3xl font-mosetta  font-bold text-[#99571d] tracking-wide text-center">
            Admin Panel
          </h2>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full border p-3 rounded-md focus:outline-none focus:ring-2 
              ${fieldErrors.email ? "border-red-500 bg-red-50" : "border-[#D5BBA3] focus:ring-[#B67032]"}`}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full border p-3 rounded-md focus:outline-none focus:ring-2 
              ${fieldErrors.password ? "border-red-500 bg-red-50" : "border-[#D5BBA3] focus:ring-[#B67032]"}`}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
            )}
          </div>
  
          {/* Forgot password */}
          <p className={`text-right text-sm text-[#B67032] cursor-pointer hover:underline
          ${
                timer > 0 ? "text-gray-500" : "text-blue-600 cursor-pointer"
              }`}
              onClick={handleForgotPassword}
          >
           {timer > 0
                ? `Link sent — valid for ${Math.floor(timer / 60)}:${String(
                    timer % 60
                  ).padStart(2, "0")}`
                : linkSent
                ? "Resend password link"
                : "Forgot password?"}
          </p>

          {/* General Error */}
          {error && <p className="text-red-600 text-center">{error}</p>}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-[#B67032] text-white py-2.5 rounded-md font-medium tracking-wide shadow-sm hover:bg-[#9A5928] transition"
          >
            Login
          </button>

          {/* <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-[#E6D3C1]" />
            <span className="text-sm text-[#9E8A76]">or</span>
            <div className="flex-1 h-px bg-[#E6D3C1]" />
          </div> */}

          {/* Google Button */}
          {/* <button className="w-full flex items-center justify-center gap-2 hover:bg-[#FFF6ED] transition">
            <img src="/Images/google-icon.png" alt="Google" className="h-5 w-5" />
            <span className="text-sm font-medium text-[#6B3B1A]">Continue with Google</span>
          </button> */}
        </div>
      </div>
    </div>
     </div>
  );
}
