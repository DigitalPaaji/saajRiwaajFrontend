"use client";
import { X } from "lucide-react";
import { useGlobalContext } from "../context/GlobalContext";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Account from "./Account";
import Image from "next/image";

export default function AuthSidebar() {
  const {
    isAuthOpen,
    setIsAuthOpen,
    forgotPassword,
    authTab,
    setAuthTab,
    user,
    setUser,
    isLoggedIn,
  } = useGlobalContext();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
     // when timer hits 0
    if (timer === 0) {
      setLinkSent(false);
      setError("");          // <–– CLEAR ERROR
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

  const switchTab = (tab) => {
    setAuthTab(tab);
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setError("");
    setFieldErrors("");
  };

  const signupUser = async ({ name, email, password }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
      credentials: "include",
    });

    const data = await res.json();
    // console.log("Status:", res.status);
    // console.log("Response data:", data);

    if (!res.ok) {
      // Try to extract a proper error message
      const errorMessage =
        data.message ||
        (data.errors && Object.values(data.errors)[0]?.message) ||
        "Signup failed.";
      throw new Error(errorMessage);
    }
    return data;
  };

  const handleSignup = async () => {
    const { name, email, password, confirmPassword } = form;
    let errors = {};

    if (!name) errors.name = "Name is required.";
    if (!email) {
      errors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) errors.email = "Invalid email format.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    } else {
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!strongPasswordRegex.test(password)) {
        errors.password =
          "Password must include uppercase, lowercase, number, and special character.";
      }
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    // If any errors, show and return
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setError("");
    setFieldErrors({});

    try {
      const data = await signupUser({ name, email, password });
      console.log("vgchgch   ", data);
      // Handle success
      toast.success("Signup Successful!");
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
      setAuthTab("login");
      // setIsAuthOpen(false);
    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
    }
  };

  const loginUser = async ({ email, password }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/user/loginUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const data = await res.json();
    localStorage.setItem("saajUser", JSON.stringify(data.user));
    localStorage.setItem("saajToken", data.token);
    setUser(data.user);
    if (!res.ok) {
      const errorMessage =
        data.message ||
        (data.errors && Object.values(data.errors)[0]?.message) ||
        "Login failed.";
      throw new Error(errorMessage);
    }

    return data;
  };
  const handleLogin = async () => {
    const { email, password } = form;
    let errors = {};
    if (!email) {
      errors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) errors.email = "Invalid email format.";
    }

    if (!password) errors.password = "Password is required.";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setError("");
    setFieldErrors({});
    try {
      const data = await loginUser({ email, password });
      setUser(data.user)
      toast.success("Login Successful!");
      console.log("Logged In User:", data.user);

      // You can save user in localStorage or context here
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
      setIsAuthOpen(false);
    } catch (err) {
      // console.error("Login Error:", err);
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <>
      {isAuthOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[998]"
          onClick={() => setIsAuthOpen(false)} // close on overlay click
        />
      )}
      <div
        className={`fixed top-0 right-0 h-screen w-[90%] md:w-[40%] xl:w-[25%] bg-white shadow-lg z-[999] transition-transform duration-300 ${
          isAuthOpen ? "translate-x-0" : "translate-x-full"
        }`}
   
      >
        {/* <ToastContainer /> */}

        {isLoggedIn && <Account />}

        <div className="flex justify-between items-center px-4 py-6 border-b-[1px] border-[#99571d]">
          <h2 className="text-xl font-semibold">
            {authTab === "login" ? "Customer Login" : "Create New Account"}
          </h2>

          <button onClick={() => setIsAuthOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Tab Switch */}
          {authTab === "signup" && (
            <div className="flex justify-end gap-4">
              <button
                onClick={() => switchTab("login")}
                className={"text-[#B67032] text-md underline"}
              >
                Login Instead
              </button>
            </div>
          )}

          {/* Tab Switch */}
          {authTab === "login" && (
            <div className="flex justify-end gap-4">
              <button
                onClick={() => switchTab("signup")}
                className={"text-[#B67032] text-md underline"}
              >
                Create New Account
              </button>
            </div>
          )}

          {/* Form Fields */}
          {(authTab === "signup" || isLoggedIn) && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-400 p-2 rounded"
              />
              {fieldErrors.name && (
                <p className="text-red-500 text-sm">{fieldErrors.name}</p>
              )}
            </>
          )}

          <>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-400 p-2 rounded"
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm">{fieldErrors.email}</p>
            )}
          </>
          <>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-400 p-2 rounded"
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-sm">{fieldErrors.password}</p>
            )}
          </>
          {authTab === "signup" && (
            <>
              <input
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className="w-full border border-gray-400 p-2 rounded"
              />
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </>
          )}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {authTab === "login" && (
            <p
              className={`text-right text-sm ${
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
          )}

          <button
            className="w-full bg-[#B67032] text-white py-2 rounded"
            onClick={authTab === "login" ? handleLogin : handleSignup}
          >
            {authTab === "login" ? "Login" : "Create Account"}
          </button>

          {/* <div className="text-center text-sm text-stone-500">or</div>

          <button className="w-full border py-2 rounded">
            Continue with Google
          </button> */}
        </div>
      </div>
    </>
  );
}
