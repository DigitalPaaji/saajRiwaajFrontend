import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { base_url } from "./utile";

 export const getCartItem = createAsyncThunk("/cart/items",async()=>{
  const response = await axios.get(`${base_url}/cart/get`);
  const data = await response.data;
  return data;

})



const getcartFromStorage = () => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// 🔹 Save to localStorage
const savecartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: [ ],
  },


  extraReducers:(builder)=>{
builder.addCase(getCartItem.fulfilled,(state,action)=>{

  state.items = action.payload
})

  },





  reducers: {
    // 🔁 Reload cart
    getcart: (state) => {
      const data = localStorage.getItem("cart");
      state.items = data ? JSON.parse(data) : [];
    },


    addTocart: (state, action) => {
      const product = action.payload;

      const exists = state.items.find(
        (item) => item.product === product.product && item.color ===product.color
      );

      if (exists) {
        // increase quantity
        exists.quantity += product.quantity;
      } else {
        // add new with quantity
        state.items.push({  quantity: 1,...product });
      }
    toast.success("Add to cart")
      savecartToStorage(state.items);
    },

  
    decreaseQuantity: (state, action) => {
      const product = action.payload;

      const item = state.items.find(
        (item) => item.product === product.product && item.color ===product.color
      );

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
         
          state.items = state.items.filter(
            (item) => item.product !== product.product || item.color !==product.color
          );
        }
      }

      savecartToStorage(state.items);
    },

   
    removeFromcart: (state, action) => {
      const product = action.payload;

      state.items = state.items.filter(
        (item) => item.product !== product.product || item.color !==product.color
      );

      savecartToStorage(state.items);
    },

    // 🧹 Clear cart
    clearcart: (state) => {
      state.items = [];
      savecartToStorage([]);
    },

 updatQunentityinCart: (state,action)=>{
const {id,type} = action.payload;
state.items = state.items.map((item)=> item._id==id?   {...item,quantity  : type=="add" ? item.quantity + 1  : Math.max(1, item.quantity - 1) } : item)
 },
 removeFormuserCart:(state,action)=>{
  state.items = state.items.filter((item)=>item._id != action.payload)
 },
  
 addTocartUser:(state,action)=>{
  state.items = action.payload
 }

  },
});

export const {
  getcart,
  addTocart,
  decreaseQuantity,
  removeFromcart,
  clearcart,
  updatQunentityinCart,
  removeFormuserCart,
  addTocartUser
} = cartSlice.actions;

export default cartSlice.reducer;