"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useGlobalContext } from "../context/GlobalContext";
import Image from "next/image";
import Link from "next/link";
import { getSocket } from "../socket";
import axios from "axios";
import Swal from "sweetalert2";
import { data } from "autoprefixer";

 

export default function CheckoutSidebar({
  isOpen,
  setIsOpen,
  
 
  total,
  discountPercent,
}) {
  const { user,cart, setCart, setIsOrderOpen } = useGlobalContext();




  const [address, setAddress] = useState({
    name: "",
    email: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // const [paymentMethod, setPaymentMethod] = useState("COD");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPopup,setshowPopUp]=useState(false)
  useEffect(() => {
    // autofill from logged-in user
    if (user) {
      setAddress((prev) => ({
        ...prev,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      addressLine: user.address?.addressLine || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      pincode: user.address?.pincode || "",
      country: user.address?.country || "India",
      }));
    }
  }, [user]);

  const handleCOD = async () => {
    try {

      const payload = {
        items: cart.map((c) => ({
          product: c._id,
          quantity: c?.quantity,
          price: c.price,
        })),
        shippingAddress: address,
        paymentMethod: "COD",
        amount:
          discountPercent > 0
            ? Math.floor(total * (1 - discountPercent / 100))
            : total,
      };
      if(!payload?.items || !payload.items.length){
        toast.error("error")
        return
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true); 
        setCart([])
        location.reload()
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch (err) {
      toast.error("Error placing order");
    }
  };





//   const handlePayOnline = async () => {
//  const socket = getSocket();
 

//     const ok = await loadRazorpay();
//      if (!ok) return alert("Failed to load Razorpay");
 

//       const amount = discountPercent > 0
//                     ? Math.floor(total * (1 - discountPercent / 100))
//                     : total



          
//     const orderRes = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/order`, {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   credentials: "include",
//   body: JSON.stringify({
//     amount,
//     type: "ONLINE",  // IMPORTANT
//     items: cart.map((c) => ({
//       product: c?.product?._id,
//       quantity: c?.quantity,
//       price: c.price,
//     })),
//     shippingAddress: address,
//     paymentMethod: "ONLINE",
//   }),
// });

//     const order = await orderRes.json();
  
//  const options = {
//       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//       amount: order.order.amount,
//       currency: "INR",
//       name: "Sajriwaaj",
//       description: "Order Payment",
//       // image: `${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/logo.jpeg`,
//       order_id: order.order.id,
//       handler: async function (response) {

//         const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/order/verify`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({...response,productId:order.productOrder._id,userId:order.userId}),
//         });

//         const verifyData = await verifyRes.json();
    
//         if (verifyData.success) {
//            setSuccess(true); 
//         setCart([])
//          socket.emit("buy", {
//       name:verifyData.name
//     });
//                 location.reload()
//         } else {
//           alert("Payment Verification Failed!");
//         }
//       },
//       prefill: {
//         name: "Test User",
//         email: "test@example.com",
//         contact: "9876543210",
//       },
//       theme: {color: "#FAF8EA",
//       hide_topbar: false },
//     };

//      const paymentObject = new window.Razorpay(options);
//     paymentObject.open();
   
//   };

const handlePayOnline = async () => {
  if(address.phone.length <10 || address.length >12){
    return 
  }
  const amount =
    discountPercent > 0
      ? Math.floor(total * (1 - discountPercent / 100))
      : total;

  // 1) Create backend order
  const orderRes = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      amount,
      type: "ONLINE",
      items: cart.map((c) => ({
        product: c?.product?._id,
        quantity: c?.quantity,
        price: c.price,
        color:c?.color
      })),
      shippingAddress: address,
      paymentMethod: "ONLINE",
    }),
  });

  const order = await orderRes.json();

  // 2) Start PhonePe payment
  const ppRes = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/order/phonepe/pay`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    orderId: order?.productOrder?._id,
    amount,
    userId: order.userId,
  }),
});

const data = await ppRes.json();

if (data.tokenUrl) {
  openPhonePePayPage(data.tokenUrl,order.productOrder._id)
}else {
    alert("Failed to start payment!");
  }
};
function loadPhonePeScript() {
  return new Promise((resolve, reject) => {
    if (window.PhonePeCheckout) return resolve();
    const script = document.createElement("script");
    script.src = "https://mercury.phonepe.com/web/bundle/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject("Failed to load PhonePe script");
    document.body.appendChild(script);
  });
}

async function openPhonePePayPage(tokenUrl, orderId) {
  try {
    await loadPhonePeScript(); 

    window.PhonePeCheckout.transact({
      tokenUrl,
      type: "IFRAME",
      callback: async function (response) {
    
        if (response === "USER_CANCEL") {
          alert("Payment cancelled by user");
        } else if (response === "CONCLUDED") {
          const statusRes = await axios.post(
            `${process.env.NEXT_PUBLIC_LOCAL_PORT}/order/phonepe/status/${orderId}`
          );
          if (statusRes.data.success) {

setshowPopUp(true)

          } else {
              Swal.fire({
                 title: "Oops...",
  text: data.message,
  icon: "error",
  draggable: true                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
});
location.reload()
          }
        }
      },
    });
  } catch (err) {
    console.error("Error opening PhonePe PayPage:", err);
  }
}


    const handlePlaceOrder = () => {
      const { name, email, phone, addressLine, city, state, pincode } = address;
      let newErrors = {};

      if (!name) newErrors.name = "Full name is required";
      if (!email) newErrors.email = "Email is required";
      if (!phone) newErrors.phone = "Phone number is required";
       if (phone.startsWith("+")? phone.length!==14: phone.length !==10 ) newErrors.phone = "Enter valid Phone number";
       
      if (!addressLine) newErrors.addressLine = "Address is required";
      if (!city) newErrors.city = "City is required";
      if (!state) newErrors.state = "State is required";
      if (!pincode) newErrors.pincode = "Pincode is required";

      setErrors(newErrors);

      if (Object.keys(newErrors).length !== 0) return;

    handlePayOnline();
    };



    if(showPopup){
      return(
      <div onClick={()=>setshowPopUp(false)} className=" z-[999] bg-black/60 fixed top-0 w-full h-screen flex justify-center items-center  ">
        <div className="flex flex-col items-center gap-3  text-center bg-[#faf8ea] p-8">

              <Image  src={'/Images/success.gif'} alt="" width={400} height={400} className="w-full h-40 object-contain"/>
            
              <h3 className="text-green-600 text-xl font-mosetta font-medium text-center">
                Order placed successfully! 🎉
              </h3>
              <a href={'/orders'}
          
          
          className="px-5 py-3 w-fit bg-[#B67032] text-white rounded-md"
          >
                View Order Details
              </a>
                </div>
            </div>
      )
    }
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[999]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0   min-h-screen w-[90%] md:w-[40%] xl:w-[25%] bg-white shadow-lg z-[999] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
           
        
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b-[1px] border-[#99571d]">
          <h2 className="text-xl font-mosetta font-medium text-[#99571d]">
            {success ? "Success!" : "Delivery Details"}
          </h2>
          <button onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto text-sm">
          {/* ✅ SUCCESS SCREEN */}
          {success ? (
            <div className="min-h-screen flex flex-col items-center space-y-5  py-20 text-center ">
              <Image  src={'/Images/success.gif'} alt="" width={400} height={400} className="w-full h-40 object-contain"/>
            
              <h3 className="text-green-600 text-xl font-mosetta font-medium text-center">
                Order placed successfully! 🎉
              </h3>
              <Link href={'/orders'}
          
               onClick={() => {
                setIsOpen(false)
                // setIsOrderOpen(true)
               }

               }
                className="px-5 py-3 w-fit bg-[#B67032] text-white rounded-md"
              >
                View Order Details
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Address input form */}
              <div className="space-y-3">
                <input
                  value={address.name}
                  placeholder="Full Name"
                  onChange={(e) =>
                    setAddress({ ...address, name: e.target.value })
                  }
                  className="border rounded-md w-full p-2 focus:border-black"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
                <input
                  value={address.email}
                  placeholder="Email"
                  onChange={(e) =>
                    setAddress({ ...address, email: e.target.value })
                  }
                  className="border rounded-md w-full p-2 focus:border-black"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
                <input
                  value={address.phone}
                  placeholder="Phone Number"
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                  className="border rounded-md w-full p-2 focus:border-black"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone}</p>
                )}
                <textarea
                  value={address.addressLine}
                  placeholder="House / Street Address"
                  onChange={(e) =>
                    setAddress({ ...address, addressLine: e.target.value })
                  }
                  className="border rounded-md w-full p-2 focus:border-black"
                  rows={2}
                />
                {errors.addressLine && (
                  <p className="text-red-500 text-xs">{errors.addressLine}</p>
                )}
                <div className="flex gap-3">
                  <input
                    value={address.city}
                    placeholder="City"
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    className="border rounded-md w-full p-2 focus:border-black"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs">{errors.city}</p>
                  )}

                  <input
                    value={address.state}
                    placeholder="State"
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                    className="border rounded-md w-full p-2 focus:border-black"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-xs">{errors.state}</p>
                  )}
                </div>
                <input
                  value={address.pincode}
                  placeholder="Pincode"
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value })
                  }
                  className="border rounded-md w-full p-2 focus:border-black"
                />
                {errors.pincode && (
                  <p className="text-red-500 text-xs">{errors.pincode}</p>
                )}
              </div>

              <hr />

              {/* Payment */}
              <div className="space-y-3">
                <h3 className="font-semibold">Payment Method</h3>
               
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="online"
                    value="ONLINE"
                    checked
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-[#B67032]"
                  />
                  <label htmlFor="online">UPI / Card / Netbanking</label>
                </div>
              </div>

              {/* Amount */}
              <div className="flex justify-between font-semibold text-base mt-3">
                <span>Total Amount</span>
                <span>
                  ₹
                  {discountPercent > 0
                    ? Math.floor(total * (1 - discountPercent / 100))
                    : total}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="block w-full bg-[#B67032] hover:bg-[#9c5a2b] text-white py-3 rounded-md text-center mt-2 font-semibold"
              >
               Pay Now
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
