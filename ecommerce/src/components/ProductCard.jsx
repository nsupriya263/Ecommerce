import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../store/slices/cartSlice";
import { toggleWishlist, selectIsWishlisted } from "../store/slices/wishlistSlice";
import "./ProductCard.css";

const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars">
      {"★".repeat(full)}
      {half ? "½" : ""}
      <span className="stars-empty">{"★".repeat(5 - full - (half ? 1 : 0))}</span>
    </span>
  );
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const isWishlisted = useSelector(selectIsWishlisted(product.id));

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card fade-up">
      <div className="card-image-wrap">
        <img src={product.image} alt={product.name} className="card-image" />
        {product.badge && (
          <span className={`card-badge badge-${product.badge.toLowerCase().replace(" ", "-")}`}>
            {product.badge}
          </span>
        )}
        <button
          className={`wishlist-btn ${isWishlisted ? "wishlisted" : ""}`}
          onClick={handleWishlist}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div className="card-body">
        <p className="card-category">{product.category}</p>
        <h3 className="card-name">{product.name}</h3>
        <div className="card-rating">
          <Stars rating={product.rating} />
          <span className="card-reviews">({product.reviews})</span>
        </div>
        <div className="card-footer">
          <div className="card-price">
            <span className="price-current">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="price-original">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            + Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
