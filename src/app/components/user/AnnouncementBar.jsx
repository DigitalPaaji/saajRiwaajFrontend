'use client';
import React, { useState } from 'react';
import { X, Gift } from 'lucide-react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-amber-50 text-amber-800 py-3 overflow-hidden">
      {/* Close Button */}
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-amber-100 transition-colors z-10"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Marquee Content */}
      <div className="flex items-center gap-2">
        <div className="whitespace-nowrap animate-marquee flex items-center gap-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="flex items-center gap-1 text-lg font-medium px-4">
              <Gift className="w-4 h-4" />
Celebrate our grand launch with an exclusive 25% OFF on your first purchase, plus Free Shipping & Easy Returns on all orders. Discover timeless jewellery that defines your unique style. Shop now and make every moment shine!
          </span>
          ))}
        </div>
      </div>
    </div>
  );
}
