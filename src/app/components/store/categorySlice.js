import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { base_url } from "./utile";

// API CALL
export const getCategory = createAsyncThunk(
  "category/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/category/cat-sub`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching category");
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    info: [],
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      
      .addCase(getCategory.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })

 
      .addCase(getCategory.fulfilled, (state, action) => {
        state.info = action.payload;
        state.isLoading = false;
      })

    
      .addCase(getCategory.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});


export default categorySlice.reducer;