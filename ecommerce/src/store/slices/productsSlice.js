// src/store/slices/productsSlice.js
// Uses API when available, falls back to local data

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import localProducts from "../../data/products";

// Try to import API functions, but they may fail if backend is down
let fetchProductsApi, fetchCategoriesApi;
try {
  const api = require("../../services/api");
  fetchProductsApi = api.fetchProducts;
  fetchCategoriesApi = api.fetchCategories;
} catch (e) {
  fetchProductsApi = null;
  fetchCategoriesApi = null;
}

// ── Async thunks ──────────────────────────────────────────
export const loadProducts = createAsyncThunk(
  "products/loadProducts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { category, searchQuery, sortBy } = getState().products;

      // Try API first
      if (fetchProductsApi) {
        try {
          const params = {};
          if (category !== "All") params.category = category;
          if (searchQuery.trim()) params.search = searchQuery;
          if (sortBy !== "default") params.sortBy = sortBy;
          return await fetchProductsApi(params);
        } catch (apiErr) {
          // API failed, fall through to local data
          console.warn("API unavailable, using local data:", apiErr.message);
        }
      }

      // Fallback: use local data with client-side filtering
      let filtered = [...localProducts];

      if (category !== "All") {
        filtered = filtered.filter((p) => p.category === category);
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
      }
      if (sortBy === "price-asc") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-desc") {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      return filtered;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadCategories = createAsyncThunk(
  "products/loadCategories",
  async (_, { rejectWithValue }) => {
    try {
      if (fetchCategoriesApi) {
        try {
          return await fetchCategoriesApi();
        } catch (apiErr) {
          console.warn("API unavailable for categories, using local data");
        }
      }
      // Fallback: extract categories from local data
      const cats = ["All", ...new Set(localProducts.map((p) => p.category))];
      return cats;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────
const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    categories: ["All"],
    category: "All",
    searchQuery: "",
    sortBy: "default",
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // loadProducts
      .addCase(loadProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // loadCategories
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { setCategory, setSearchQuery, setSortBy } = productsSlice.actions;

// Selectors
export const selectAllProducts = (state) => state.products.items;
export const selectCategories = (state) => state.products.categories;
export const selectCategory = (state) => state.products.category;
export const selectSearchQuery = (state) => state.products.searchQuery;
export const selectSortBy = (state) => state.products.sortBy;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;

// Products are already filtered/sorted
export const selectFilteredProducts = selectAllProducts;

export default productsSlice.reducer;


