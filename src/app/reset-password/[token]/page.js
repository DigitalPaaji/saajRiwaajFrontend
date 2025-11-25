"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { useGlobalContext } from "@/app/components/context/GlobalContext";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { resetPassword } = useGlobalContext();
  const { token } = useParams();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    const { password, confirmPassword } = form;
    let err = {};

    if (!password) err.password = "Password is required.";
    else if (password.length < 8) err.password = "Minimum 8 characters.";
    else {
      const strong =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!strong.test(password)) {
        err.password =
          "Must include upper, lower, number & special character.";
      }
    }

    if (!confirmPassword) err.confirmPassword = "Please confirm password.";
    else if (confirmPassword !== password)
      err.confirmPassword = "Passwords do not match.";

    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }
    setErrors({});

    const { ok, message } = await resetPassword(token, password);
    if (ok) {
      toast.success("Password updated!");
      setTimeout(() => router.push("/"), 500);
    } else {
      toast.error(message || "Something went wrong.");
    }
  };

  return (
    <div className="md:grid grid-cols-2">
      {/* Left image */}
      <div className="hidden md:block">
        <Image
          alt=""
          src={"/Images/admin.webp"}
          width={400}
          height={400}
          className="w-full h-screen object-cover"
        />
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center px-4 min-h-screen bg-gradient-to-b from-[#FAF7F2] to-[#F5E8DA]">
        <ToastContainer />
        <div className="w-full max-w-md rounded-2xl overflow-hidden">
          {/* Logo */}
          <div className="flex justify-center py-8">
            <Link href="/" className="flex-shrink-0 group">
              <Image
                src="/Images/logo.webp"
                width={400}
                height={400}
                alt="Saaj Riwaaj Logo"
                className="h-14 w-auto group-hover:scale-105 transition-transform"
              />
            </Link>
          </div>

          {/* Title */}
          <div className="px-6 py-4 border-b border-[#E6D3C1]">
            <h2 className="text-3xl font-serif font-bold text-[#6B3B1A] text-center tracking-wide">
              Reset Password
            </h2>
          </div>

          {/* Form */}
          <div className="p-6 space-y-5">
            {/* New Password */}
            <div>
              <input
                type="password"
                placeholder="New Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className={`w-full border p-3 rounded-md focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 bg-red-50"
                    : "border-[#D5BBA3] focus:ring-[#B67032]"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className={`w-full border p-3 rounded-md focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-red-500 bg-red-50"
                    : "border-[#D5BBA3] focus:ring-[#B67032]"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#B67032] text-white py-2.5 rounded-md font-medium tracking-wide shadow-sm hover:bg-[#9A5928] transition"
            >
              Save Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
