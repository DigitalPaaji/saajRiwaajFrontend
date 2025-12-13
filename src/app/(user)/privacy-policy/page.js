"use client";

import { useEffect, useState } from "react";
import Banner from "../../components/user/InnerBanner";
import axios from "axios";

const privacyData = [
  {
    heading: "Privacy Policy – Saaj Riwaaj",
    para: `At Saaj Riwaaj, we value your trust and are committed to protecting your privacy.

All personal details shared during order placement — including your name, contact number, address, and payment information — are kept 100% confidential and used only for order processing and delivery purposes.

We never share, sell, or misuse your data in any way. Your shopping experience and privacy are always our top priority.

Email: saajriwaaj22@gmail.com
Contact: +91 99888 23422
Founder – Saaj Riwaaj: Aakashkabir Singh Rattan`
  },

  {
    heading: "Shipping Policy",
    para: `• All orders are processed within 2–5 business days after confirmation.
• Once shipped, you will receive a tracking number via WhatsApp or email.
• Delivery time may vary based on your location (generally 5–10 days across India).
• Each product is carefully packed to ensure it reaches you safely and beautifully.

For any shipping-related questions, feel free to contact us at:
Email: saajriwaaj22@gmail.com 
Contact: +91 99888 23422
Founder – Saaj Riwaaj: Aakashkabir Singh Rattan`
  },

  {
    heading: "Return & Refund Policy",
    para: `We want you to love every piece you buy from Saaj Riwaaj!

If you receive a defective or damaged product, you can request a return or exchange within 48 hours of delivery — but please note the following:

• Return requests must include a proper unboxing video clearly showing the issue.
  (Without a valid video, returns or refunds will not be accepted.)
• The product should be unused, in its original packaging, with all tags intact.
• Once verified, we will initiate an exchange or refund (as per your request).
• Refunds are processed within 7–10 business days after approval.
•  Exchanged product will be delivered within 3 working days


At Saaj Riwaaj, we believe in honesty, trust, and transparency — because every jewel we send carries our name and your happiness.

Email: saajriwaaj22@gmail.com
Contact: +91 99888 23422
Founder – Saaj Riwaaj: Aakashkabir Singh Rattan`
  }
];
 
export default function PrivacyPage() {


  
 const [privacyData,setFaqData]=useState()
const [loading,setLoading]=useState(false)


 const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/pages/get/privacy-policy`
      );
      const data = await response.data;
      if (data.success) {
        setFaqData(data?.data?.contant || []);
      } else {
        setFaqData([]);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
      setFaqData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchPages()
  },[])
  return (
    <div>
      <Banner title="Privacy Policy" />

      <div className="px-4 sm:px-8 lg:px-24 xl:px-60 mx-auto my-16">
        {privacyData?.map((section, index) => (
          <div key={index} className="mb-10">
            {section.heading && (
              <h2 className="text-lg font-semibold mb-3">{section.heading}</h2>
            )}
            <p className="text-gray-700 leading-7 whitespace-pre-line">
              {section.des}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
