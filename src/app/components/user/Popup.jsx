"use client"
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FiX, FiMail, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Popup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

 
  const brandColor = "#99571d";

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
    // localStorage.setItem('hasSeenDiscountPopup', 'true');
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    
   try {
     if (email) {
    //  toast("Email captured for jewelry newsletter:", email);
      // TODO: Send email to your backend/Mailchimp/Klaviyo here
      
      setIsSubmitted(true);
      localStorage.setItem('hasSeenDiscountPopup', 'true'); 
    
  const response = await axios.post(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/newsletter/send`,{email})
  const data = await response.data;
  if(data.success){
    toast.success(data.message)
    setIsOpen(false);
  }else{
    toast.error(data.message)
  }



        
   
    }
   } catch (error) {
    toast.error(error.response.data.message)
   }
  };

  // Don't render anything if the popup is closed
  if (!isOpen) return null;

  return (
    // Backdrop - slightly warmer tint than pure black
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-stone-900/70 backdrop-blur-sm p-4 transition-opacity duration-300">
      
      {/* Main Container - Added animate-fade-in-up (requires tailwind config or custom css, assuming generic fade-in for now) */}
      <div className="relative w-full max-w-md bg-white dark:bg-stone-950 rounded-2xl shadow-2xl overflow-hidden animate-fade-in transition-colors border border-stone-100 dark:border-stone-800">
        
        {/* Close Button - More subtle placement */}
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/70 dark:bg-black/30 text-stone-600 hover:text-black dark:hover:text-white transition-colors z-20"
          aria-label="Close popup"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* --- Top Image Area --- */}
        <div className="relative h-48 w-full overflow-hidden">
          {/* Overlay gradient to make top part of image slightly darker for close button visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10"></div>
          
          <img 
            // Jewelry image URL (Change this to your specific image)
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop" 
            alt="Elegant diamond and gold jewelry" 
            className="w-full h-full object-cover object-center sepia-[0.2]" // Subtle sepia tint to match bronze color
          />
        </div>

        {/* --- Content Area --- */}
        <div className="p-8 text-center">
          {!isSubmitted ? (
            <>
              {/* Refined Copy for Jewelry */}
              <h3 className="text-3xl font-bold text-stone-950 dark:text-white mb-2 tracking-tight">
                Unlock <span style={{color: brandColor}}>25% Off</span>
              </h3>
              <p className="text-stone-600 dark:text-stone-300 mb-7 text-base font-medium">
                Subscribe to our exclusive list. Receive your instant discount code, rare offers, and new collection previews.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="text-stone-400 w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    // Changed focus ring color to brand bronze
                    className="w-full pl-11 pr-4 py-3.5 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50 dark:bg-stone-900 text-stone-950 dark:text-white focus:outline-none focus:ring-2 transition-all"
                    style={{'--tw-ring-color': brandColor, borderColor: email ? brandColor : ''}}
                  />
                </div>
                
                <button
                  type="submit"
                  // Integrated brand color as background
                  className="w-full text-white font-semibold py-3.5 px-4 rounded-xl transition-colors duration-200 shadow-md hover:brightness-110"
                  style={{backgroundColor: brandColor}}
                >
                  Reveal My Coupon
                </button>
              </form>
              
              <button 
                onClick={handleClose}
                className="mt-5 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 underline tracking-wide"
              >
                No thanks, I prefer paying full price
              </button>
            </>
          ) : (
            /* --- Success State --- */
            <div className="py-8 flex flex-col items-center animate-fade-in">
              {/* Icon uses brand color */}
              <FiCheckCircle className="w-20 h-20 mb-5" style={{color: brandColor}} />
              <h3 className="text-2xl font-bold text-stone-950 dark:text-white mb-2">
                Welcome to the List 🎉
              </h3>
              <p className="text-stone-700 dark:text-stone-300 mb-2 max-w-xs">
                Your <span font-bold>25% off</span> code is sparkling in your inbox at <strong>{email}</strong>.
              </p>
              <p className="text-sm text-stone-400 mt-6 italic">
                Closing automatically...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;