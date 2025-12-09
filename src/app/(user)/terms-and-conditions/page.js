"use client";

import Banner from "../../components/user/InnerBanner";

const termsData = [
  {
    para: "These Terms and Conditions govern your use of Saaj Riwaaj’s website and services. By accessing or using our website, you agree to comply with these Terms."
  },
  {
    heading: "Accounts",
    para: "To make a purchase or access certain services, you may need to create an account. You are responsible for maintaining the confidentiality of your account details and for all activities that occur under your account."
  },
  {
    heading: "Orders",
    para: "All orders placed through the website are subject to acceptance and availability. Saaj Riwaaj reserves the right to refuse or cancel any order for any reason, including product unavailability or errors in pricing."
  },
  {
    heading: "Pricing & Payments",
    para: "All prices are listed in INR and are inclusive of applicable taxes unless stated otherwise. Payments can be made via the available payment methods. We are not responsible for any fees charged by your payment provider."
  },
  {
    heading: "Delivery",
    para: "Delivery timelines are estimates and may vary depending on your location and availability of products. Saaj Riwaaj is not liable for delays caused by courier companies or other third parties."
  },
  {
    heading: "Returns & Exchanges",
    para: "We offer 7 days of hassle-free returns & exchanges from the date of delivery, and a further 5-7 days for the returned product(s) to reach us. Reverse pick-up is available with a fee of Rs 100 per order. Conditions apply; please refer to our Returns & Exchanges policy for full details."
  },
  {
    heading: "Product Usage",
    para: "Products should be used as intended. Saaj Riwaaj is not responsible for damages resulting from misuse, improper storage, or negligence."
  },
  {
    heading: "Intellectual Property",
    para: "All content on the website, including text, images, graphics, and logos, are the property of Saaj Riwaaj or its licensors and are protected by copyright and other intellectual property laws."
  },
  {
    heading: "Limitation of Liability",
    para: "Saaj Riwaaj shall not be liable for any indirect, incidental, or consequential damages arising from the use of the website or the purchase of products."
  },
  {
    heading: "Governing Law",
    para: "These terms and conditions are governed by and construed in accordance with the laws of india. Any disputes arising out of or in connection with these terms shall be subject to the jurisdiction of courts in patiala punjab"
  },
  {
    heading: "Changes to Terms",
    para: "We may update these Terms and Conditions from time to time. Changes will be posted on this page, and continued use of the website constitutes acceptance of the updated Terms."
  },
  {
    heading: "Contact Us",
    para: "For any questions regarding these Terms and Conditions, please contact us at support@saajriwaaj.com or visit our customer support portal. Our team is available Monday-Saturday, 10 am-5 pm."
  }
];



export default function PrivacyPage() {
  return (
    <div>
    
      <Banner title="Terms & Conditions" />

    
      <div className="px-4 sm:px-8 lg:px-24 xl:px-60 mx-auto my-16">
        {termsData.map((section, index) => (
          <div key={index} className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-[#111]">{section.heading}</h2>
            <p className="text-gray-700 leading-7">{section.para}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
