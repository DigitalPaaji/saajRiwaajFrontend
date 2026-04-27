"use client"
import React, { useState, useEffect } from 'react';
import { FiX, FiCopy, FiUnlock } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addSlide } from '../store/sliderSlice';
import { base_url } from '../store/utile';

const Popup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  
  // Safely access the user from Redux state
  const user = useSelector(state => state.user?.user);

  // Dynamic values based on authentication status
  const discountAmount = "25% Off" 
  const couponCode =  "SAAJRIWAAJ25"

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenDiscountPopup');
 
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenDiscountPopup', 'true');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
    toast.success("Coupon code copied to clipboard!");
    localStorage.setItem('hasSeenDiscountPopup', 'true');
  };

  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 transition-opacity duration-300">

      {/* Main Container: Horizontal on medium+ screens */}
      <div className="relative w-full max-w-4xl bg-[#f6f4f0] rounded-3xl shadow-2xl overflow-hidden flex flex-col-reverse md:flex-row animate-fade-in">

        {/* --- Left Side: Content Area --- */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center text-center">
          
          <span className="text-sm font-bold tracking-widest text-stone-500 uppercase mb-2">
            A Special Gift
          </span>
          
          <h2 className="text-3xl md:text-4xl font-bold md:font-extrabold text-stone-900 mb-2 tracking-tight">
            {discountAmount}
          </h2>
          
          <p className="text-stone-600 mb-8 text-base">
            Use this coupon code at checkout to claim your gift.
          </p>

      

          {/* Coupon Code Display Box & Copy Action */}
          <div className="w-full max-w-sm flex flex-col gap-3">
            <div className="bg- border border-dashed  rounded-xl py-2  px-6 flex items-center justify-center shadow-inner">
              <span className="text-xl   font-semibold tracking-widest text-">
                {couponCode}
              </span>
            </div>
            
            <button 
              onClick={handleCopyCode}
              className="w-full py-3 rounded-xl font-bold transition-transform hover:scale-[1.02] bg-gradient-to-r from-[#bc861a] via-[#f1d981] to-[#bc861a] text-[#292927] flex items-center justify-center gap-2 shadow-md"
            >
              <FiCopy className="w-5 h-5" />
              Copy Code
            </button>
          </div>
    {/* Login Prompt for non-users */}
          {!user && (
            <div className="w-full flex items-center justify-center gap-2 text-left p-4">
              <div className="flex items-center gap-2">
                <FiUnlock className="text-[#bc861a] w-4 h-4" />
                
              </div>
              <button
                onClick={() => dispatch(addSlide("login"))}
                className="text-sm font-bold text-[#bc861a] hover:underline whitespace-nowrap"
              >
                Login Now
              </button>
            </div>
          )}
          {/* Dismiss Link */}
          <button
            onClick={handleClose}
            className=" text-sm text-stone-500 hover:text-stone-800 underline tracking-wide transition-colors"
          >
            No thanks, continue shopping
          </button>

        </div>

        {/* --- Right Side: Image Area --- */}
        <div className="w-full md:w-1/2 relative">
          
          {/* Close Button - Placed exactly like the reference image */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-20 backdrop-blur-sm"
            aria-label="Close popup"
          >
            <FiX className="w-5 h-5" />
          </button>

          <img
            // src="/Images/category/earrings.webp"
            src={`${base_url}/uploads/1772084151159-424599470.webp`}
            alt="Elegant jewelry collection"
            className=" h-64 md:h-auto min-h-[300px] hidden lg:block absolute inset-0 w-full object-cover object-center sepia-[0.2]"
          />
        </div>

      </div>
    </div>
  );
};

export default Popup;

// "use client"
// import React, { useState, useEffect } from 'react';
// import { FiX, FiCopy, FiUnlock } from 'react-icons/fi';
// import { useDispatch, useSelector } from 'react-redux';
// import { toast } from 'react-toastify';
// import { addSlide } from '../store/sliderSlice';
// import { base_url } from '../store/utile';

// const Popup = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dispatch = useDispatch();
  
//   // Safely access the user from Redux state
//   const user = useSelector(state => state.user?.user);

//   // Dynamic values based on authentication status
//   const discountAmount = "25% Off" 
//   const couponCode =  "SAAJRIWAAJ25"

//   useEffect(() => {
//     const hasSeenPopup = localStorage.getItem('hasSeenDiscountPopup');
 
//     if (!hasSeenPopup) {
//       const timer = setTimeout(() => {
//         setIsOpen(true);
//       }, 3000);

//       return () => clearTimeout(timer);
//     }
//   }, []);

//   const handleClose = () => {
//     setIsOpen(false);
//     localStorage.setItem('hasSeenDiscountPopup', 'true');
//   };

//   const handleCopyCode = () => {
//     navigator.clipboard.writeText(couponCode);
//     toast.success("Coupon code copied to clipboard!");
//     localStorage.setItem('hasSeenDiscountPopup', 'true');
//   };

//   if (!isOpen) return null;

//   return (
//     // Backdrop
//     <div className="fixed inset-0 z-[999] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 transition-opacity duration-300">

//       {/* Main Container: Horizontal on medium+ screens */}
//       <div className="relative w-full max-w-4xl bg-[#f6f4f0] rounded-3xl shadow-2xl overflow-hidden flex flex-col-reverse md:flex-row animate-fade-in">

//         {/* --- Left Side: Content Area --- */}
//         <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center text-center">
          
//           <span className="text-sm font-bold tracking-widest text-stone-500 uppercase mb-2">
//             A Special Gift
//           </span>
          
//           <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-2 tracking-tight">
//             {discountAmount}
//           </h2>
          
//           <p className="text-stone-600 mb-8 text-base">
//             Use this coupon code at checkout to claim your gift.
//           </p>

//           {/* Login Prompt for non-users */}
//           {!user && (
//             <div className="w-full max-w-sm bg-white/60 border border-[#e5dfd3] rounded-xl p-3 mb-6 flex items-center justify-between text-left shadow-sm">
//               <div className="flex items-center gap-2">
//                 <FiUnlock className="text-[#bc861a] w-5 h-5" />
                
//               </div>
//               <button
//                 onClick={() => dispatch(addSlide("login"))}
//                 className="text-sm font-bold text-[#bc861a] hover:underline whitespace-nowrap"
//               >
//                 Login Now
//               </button>
//             </div>
//           )}

//           {/* Coupon Code Display Box & Copy Action */}
//           <div className="w-full max-w-sm flex flex-col gap-3">
//             <div className="bg- border border-dashed  rounded-xl py-3.5  px-6 flex items-center justify-center shadow-inner">
//               <span className="text-2xl   font-semibold tracking-widest text-">
//                 {couponCode}
//               </span>
//             </div>
            
//             <button 
//               onClick={handleCopyCode}
//               className="w-full py-3.5 rounded-xl font-bold  bg-gradient-to-r from-[#bc861a] via-[#f1d981] to-[#bc861a] text-[#292927] flex items-center justify-center gap-2 shadow-md"
//             >
//               <FiCopy className="w-5 h-5" />
//               Copy Code
//             </button>
//           </div>

    
//           <button
//             onClick={handleClose}
//             className="mt-6 text-sm text-stone-500 hover:text-stone-800 underline tracking-wide transition-colors"
//           >
//             No thanks, continue shopping
//           </button>

//         </div>

//         {/* --- Right Side: Image Area --- */}
//         <div className="w-full md:w-1/2 relative h-64 md:h-auto min-h-[300px]">
          
//           {/* Close Button - Placed exactly like the reference image */}
//           <button
//             onClick={handleClose}
//             className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-20 backdrop-blur-sm"
//             aria-label="Close popup"
//           >
//             <FiX className="w-5 h-5" />
//           </button>

//           <img
//             // src="/Images/category/earrings.webp"
//             src={`${base_url}/uploads/1772084151159-424599470.webp`}
//             alt="Elegant jewelry collection"
//             className="absolute inset-0 w-full h-full object-cover object-center sepia-[0.2]"
//           />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Popup;