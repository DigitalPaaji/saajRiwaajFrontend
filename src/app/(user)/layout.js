import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import { GoogleOAuthProvider } from "@react-oauth/google";

import LayoutComp from "./LayoutComp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Saajriwaaj",
  description: "SaajRiwaaj celebrates the beauty of life’s precious occasions",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
 <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}
      </head>




      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  `}
      >
        <GoogleOAuthProvider  clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        {/* <GlobalProvider> */}
            {/* <AnnouncementBar /> */}
                {/* <Navbar/> */}
                      {/* <CartSidebar/> */}
    <LayoutComp>
            
                      {/* <CartSidebar/>
                      <LoginSignup/>
                      <Wishlist/>
                      <OrderSidebar/> */}
{/* <Popup />                              */}
        {children}

</LayoutComp>
              {/* <Footer /> */}
          
        {/* </GlobalProvider> */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
