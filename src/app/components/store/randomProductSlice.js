import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { base_url } from "./utile";

export const getRandomProduct = createAsyncThunk(
  "randomproduct/get",
  async (categoryid, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${base_url}/product/random/${categoryid}`
      );

      return response.data; // no need for extra variable

    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);


const randomProductSlice = createSlice({
  name: "randomproduct",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getRandomProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRandomProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(getRandomProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default randomProductSlice.reducer;



