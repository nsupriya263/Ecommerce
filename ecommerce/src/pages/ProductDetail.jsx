import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAllProducts } from "../store/slices/productsSlice";
import { addToCart } from "../store/slices/cartSlice";
import { toggleWishlist, selectIsWishlisted } from "../store/slices/wishlistSlice";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const product = products.find((p) => p.id === parseInt(id));
  const isWishlisted = useSelector(selectIsWishlisted(product?.id));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="not-found page-container">
        <p>Product not found.</p>
        <Link to="/" className="back-link">← Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) dispatch(addToCart(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="product-detail page-container fade-up">
      <Link to="/" className="back-link">← Back to Shop</Link>

      <div className="detail-grid">
        <div className="detail-image-col">
          <div className="detail-image-wrap">
            <img src={product.image} alt={product.name} className="detail-image" />
            {product.badge && (
              <span className={`card-badge badge-${product.badge.toLowerCase().replace(" ", "-")}`}>
                {product.badge}
              </span>
            )}
          </div>
        </div>

        <div className="detail-info-col">
          <p className="detail-category">{product.category}</p>
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-rating">
            <span className="stars-large">{"★".repeat(Math.floor(product.rating))}</span>
            <span className="rating-score">{product.rating}</span>
            <span className="rating-count">({product.reviews} reviews)</span>
          </div>

          <p className="detail-description">{product.description}</p>

          <div className="detail-price-row">
            <span className="detail-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="detail-original">${product.originalPrice.toFixed(2)}</span>
                <span className="detail-discount">−{discount}%</span>
              </>
            )}
          </div>

          <div className="detail-actions">
            <div className="qty-control">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>

            <button
              className={`add-btn ${added ? "added" : ""}`}
              onClick={handleAddToCart}
            >
              {added ? "✓ Added to Cart" : "Add to Cart"}
            </button>

            <button
              className={`wish-btn ${isWishlisted ? "wishlisted" : ""}`}
              onClick={() => dispatch(toggleWishlist(product))}
              title="Wishlist"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          <div className="detail-meta">
            <div className="meta-item">
              <span>📦</span>
              <span>Free shipping on orders over $99</span>
            </div>
            <div className="meta-item">
              <span>↩</span>
              <span>30-day hassle-free returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
