import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch all products
export const fetchAllProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/getAllProducts');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/products/deleteProductForAdmin/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  products: [],
  single_product: null,
  loading: false,
  error: null,
  lastFetched: null,
};

// Product slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSingleProduct: (state, action) => {
      state.single_product = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
        state.lastFetched = Date.now();
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectAllProducts = (state) => state.products.products;
export const selectLoadingState = (state) => state.products.loading;
export const selectError = (state) => state.products.error;
export const selectSingleProduct = (state) => state.products.single_product;

// Actions and reducer export
export const { setSingleProduct } = productsSlice.actions;
export default productsSlice.reducer;
