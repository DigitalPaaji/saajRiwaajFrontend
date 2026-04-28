import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Script from "next/script";
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
 
      </head>




      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  `}
      >
 <Script
          id="facebook-pixel"
          strategy="afterInteractive"
        >
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}
            (window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '1692823222163457');
            fbq('track', 'PageView');
          `}
        </Script>

            <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1692823222163457&ev=PageView&noscript=1"
          />
        </noscript>

        
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
