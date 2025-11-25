"use client";
import "../globals.css";
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { GlobalProvider } from "../components/context/GlobalContext";
import Sidebar from "../components/admin/Sidebar";
import { ToastContainer } from "react-toastify";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  const checkAdminAuth = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/user/admin/`, {
        credentials: "include", // send cookies
      });

      if (res.status === 204) {
        // No user logged in
        router.replace("/admin/auth");
        return;
      }

      if (!res.ok) {
        router.replace("/admin/auth");
        return;
      }

      const data = await res.json();

    if (!data.user || !data.user.role?.includes("admin")) {
  router.replace("/admin/auth");
  return;
}

      // Store user in localStorage for quick access (optional)
      // localStorage.setItem("saajUser", JSON.stringify(data.user));

      setLoading(false);
    } catch (err) {
      console.error("Error checking admin auth:", err);
      router.replace("/admin/auth");
    }
  }, [router]);



  useEffect(() => {
    if (pathname === "/admin/auth") {
      setLoading(false);
      return;
    }
    checkAdminAuth();
  }, [pathname, checkAdminAuth]);

  if (loading) {
    return (
      <html lang="en">
        <body>
          <div className="p-8">Checking authentication...</div>
        </body>
      </html>
    );
  }

  if (pathname === "/admin/auth") {
    return (
      <html lang="en">
        <body>
          <GlobalProvider>
          <div className="flex flex-col min-h-screen bg-[#ffffff]">
            <ToastContainer className="z-[999999]" />
            <main className="flex-1">{children}</main>
          </div>
          </GlobalProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
          <GlobalProvider>
        <div className="relative flex h-screen bg-[#faf8f8] transition-all duration-300 text-[#333] font-sans">
          <ToastContainer className="z-[999999]" />
          <Sidebar />
          <main className="flex-1 p-8 overflow-y-auto shadow-2xl">
          {children}
          </main>
        </div>
        </GlobalProvider>
      </body>
    </html>
  );
}
