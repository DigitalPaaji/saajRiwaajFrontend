import { createSlice }  from "@reduxjs/toolkit";

const initialState = {
  slide: null
};

const SliderSlice = createSlice({
    name: "slider",
  initialState,
    reducers:{
        addSlide:(state,action)=>{
         state.slide = action.payload
        },
        removeSlide :(state)=>{
            state.slide = null
        }
    }
})

export const {addSlide,removeSlide} = SliderSlice.actions

export default SliderSlice.reducer;


