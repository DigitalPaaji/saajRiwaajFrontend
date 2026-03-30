import { createSlice } from "@reduxjs/toolkit";






const saveWishlistToStorage = (wishlist) => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState: {
    items: [ ],
  },

  reducers: {

    getWishlist: (state) => {
      const data = localStorage.getItem("wishlist");
      state.items = data ? JSON.parse(data) : [];
    },

    addToWishlist: (state, action) => {
      const product = action.payload;

      const exists = state.items.find(
        (item) => item === product
      );

      if (!exists) {
        state.items.push(product);
        saveWishlistToStorage(state.items);
      }
    },

    removeFromWishlist: (state, action) => {
      const productId = action.payload;

      state.items = state.items.filter(
        (item) => item !== productId
      );

      saveWishlistToStorage(state.items);
    },

    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage([]);
    },
   addFullList:(state,action)=>{
    state.items=action.payload
   },
   removeuserWishlist:(state,action)=>{
      const productId = action.payload;
 state.items = state.items.filter(
        (item) => item !== productId
      );
   }
,
   addToWishlistUser:(state, action)=>{
const product = action.payload;

      const exists = state.items.find(
        (item) => item === product
      );
 if (!exists) {
        state.items.push(product);
      
      }


   }




  },


});

export const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  addFullList,
  removeuserWishlist,
  addToWishlistUser,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;