import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCartCount } from "../store/slices/cartSlice";
import { selectWishlistItems } from "../store/slices/wishlistSlice";
import { setSearchQuery, selectSearchQuery } from "../store/slices/productsSlice";
import "./Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartCount);
  const wishlist = useSelector(selectWishlistItems);
  const searchQuery = useSelector(selectSearchQuery);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
    if (e.target.value) navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner page-container">
        <Link to="/" className="navbar-logo">
          ARCANE<span>.</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Shop</Link>
          <Link to="/wishlist" className="nav-link">
            Wishlist
            {wishlist.length > 0 && (
              <span className="badge">{wishlist.length}</span>
            )}
          </Link>
        </div>

        <div className="navbar-actions">
          {searchOpen && (
            <input
              className="search-input"
              autoFocus
              placeholder="Search products…"
              value={searchQuery}
              onChange={handleSearch}
              onBlur={() => !searchQuery && setSearchOpen(false)}
            />
          )}
          <button
            className="icon-btn"
            onClick={() => setSearchOpen((v) => !v)}
            title="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
          <Link to="/cart" className="icon-btn cart-btn" title="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
