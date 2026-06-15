// src/pages/Home.jsx
// REPLACES the existing Home.jsx

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFilteredProducts,
  selectProductsStatus,
  selectProductsError,
  selectCategory,
  selectSearchQuery,
  selectSortBy,
  loadProducts,
  loadCategories,
} from "../store/slices/productsSlice";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectFilteredProducts);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);

  // Re-fetch whenever filters change
  const category = useSelector(selectCategory);
  const searchQuery = useSelector(selectSearchQuery);
  const sortBy = useSelector(selectSortBy);

  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch, category, searchQuery, sortBy]);

  return (
    <div className="home page-container">
      <div className="home-hero">
        <p className="hero-eyebrow">Curated for the discerning</p>
        <h1 className="hero-title">
          Objects of
          <br />
          <em>Distinction</em>
        </h1>
        <p className="hero-sub">Handpicked goods for those who notice the difference.</p>
      </div>

      <FilterBar />

      {status === "loading" && (
        <div className="empty-state">
          <p>Loading products…</p>
        </div>
      )}

      {status === "failed" && (
        <div className="empty-state">
          <p>Error: {error}</p>
        </div>
      )}

      {status === "succeeded" && products.length === 0 && (
        <div className="empty-state">
          <p>No products match your search.</p>
        </div>
      )}

      {status === "succeeded" && products.length > 0 && (
        <div className="products-grid">
          {products.map((product, i) => (
            <div key={product._id} style={{ animationDelay: `${i * 0.05}s` }}>
              <ProductCard product={{ ...product, id: product._id }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
