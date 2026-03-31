import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { base_url }  from "./utile";
import axios  from"axios";

export const getFaqs = createAsyncThunk("faq/get",async()=>{
      const response = await axios.get(
        `${base_url}/pages/get/faq`
      );
    return response.data;
    }
)




const faqSlice = createSlice({
  name: "faq",
  initialState: {
    faqs: [],
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFaqs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFaqs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.faqs = action.payload?.data?.contant;
      })
      .addCase(getFaqs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default faqSlice.reducer;
