"use client";

import Banner from "../../components/user/InnerBanner";

const returnsPolicyData = [
  {
    heading: "Hassle-Free Returns & Exchanges",
    para: "We offer 7 days of hassle-free returns & exchanges from the date of delivery and a further 5-7 days for the returned product(s) to reach us. We also offer reverse pick-up services. A reverse shipment fee of Rs 100 will be deducted at the time of refund per order, regardless of the number of items within that order. This means that if an order contains multiple items, only a single deduction of Rs 100 will be made for the entire order, not on each individual item."
  },
  {
    heading: "Pick-Up Attempts",
    para: "Pick-up will be attempted twice. If the courier company is unable to pick up the shipment, you will have to send the shipment back to the company address. Reverse Pick-Up is subject to the availability of the service in your area pin code."
  },
  {
    heading: "Refund / Store Credit",
    para: "For Prepaid and COD orders, a store credit will be processed within 1-2 working days once we receive the return shipment. Store credit equivalent to the amount paid by you, which can be used anytime."
  },
  {
    heading: "Product Condition",
    para: "Please return your product(s) in the same condition as it was shipped. If the products are returned in poor condition or have clearly been worn, a refund will not be provided."
  },
  {
    heading: "Shipping Charges",
    para: "Shipping Charges are Non-Refundable."
  },
  {
    heading: "Customer Support",
    para: "You can get in touch with us about any issues at our customer support portal or drop us a line at support@saajriwaaj.com and we will be happy to help. For a faster response, send us a message on Instagram @saaj_riwaaj. All queries will be solved between Monday-Saturday, 10 am-5 pm. All pending queries will be solved on priority the next day."
  },
  {
    heading: "Order Cancellations",
    para: "Cancellations will only be possible till the order has not been dispatched from our warehouse."
  },
  {
    heading: "Claim Exchange or Return",
    para: "To claim exchange or returns click on the link below:\n\nhttps://saajriwaaj.ecoreturns.ai/apps/ecoreturnsai/"
  }
];



export default function PrivacyPage() {
  return (
    <div>
     
      <Banner title="Refund Policy" />


      <div className="px-4 sm:px-8 lg:px-24 xl:px-60 mx-auto my-16">
        {returnsPolicyData.map((section, index) => (
          <div key={index} className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-[#111]">{section.heading}</h2>
            <p className="text-gray-700 leading-7">{section.para}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
