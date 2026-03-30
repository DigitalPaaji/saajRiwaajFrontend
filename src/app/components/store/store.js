import  { configureStore }  from "@reduxjs/toolkit";
import categorySlice from "./categorySlice"
import randomProduct  from "./randomProductSlice"

import wishlist  from "./wishListSlice"
import user  from "./getUserSlice"
import cart  from "./cartSlice"
import slider from "./sliderSlice"
const store = configureStore({
    reducer:{
   category :categorySlice,
   randomProduct,
   wishlist,
   user,
   cart,
   slider,
    }
})

export default store