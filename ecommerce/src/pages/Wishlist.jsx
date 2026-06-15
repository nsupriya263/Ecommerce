import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { selectWishlistItems, toggleWishlist } from "../store/slices/wishlistSlice";
import { addToCart } from "../store/slices/cartSlice";
import "./Wishlist.css";

const Wishlist = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectWishlistItems);

  if (items.length === 0) {
    return (
      <div className="wishlist-empty page-container">
        <div className="wishlist-empty-content">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <h2>Your wishlist is empty</h2>
          <p>Save items you love for later.</p>
          <Link to="/" className="shop-btn">Discover Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page page-container fade-up">
      <h1 className="wishlist-title">Wishlist</h1>
      <div className="wishlist-grid">
        {items.map((item) => (
          <div key={item.id} className="wishlist-card">
            <Link to={`/product/${item.id}`}>
              <img src={item.image} alt={item.name} className="wishlist-img" />
            </Link>
            <div className="wishlist-card-body">
              <p className="wishlist-cat">{item.category}</p>
              <Link to={`/product/${item.id}`} className="wishlist-name">{item.name}</Link>
              <p className="wishlist-price">${item.price.toFixed(2)}</p>
              <div className="wishlist-actions">
                <button
                  className="wl-cart-btn"
                  onClick={() => dispatch(addToCart(item))}
                >
                  Add to Cart
                </button>
                <button
                  className="wl-remove-btn"
                  onClick={() => dispatch(toggleWishlist(item))}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
