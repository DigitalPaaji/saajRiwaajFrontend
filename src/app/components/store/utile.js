export  const base_url = `${process.env.NEXT_PUBLIC_LOCAL_PORT}`


export const fbEvent = (event, data = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, data);
  }
};

export const PixelEvents = {
  ADD_TO_CART: "AddToCart",
  ADD_TO_WISHLIST: "AddToWishlist",
  INITIATE_CHECKOUT: "InitiateCheckout",
  PURCHASE: "Purchase",
  VIEW_CONTENT: "ViewContent",
  SEARCH: "Search",
  LEAD: "Lead",
};