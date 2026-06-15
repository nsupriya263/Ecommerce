import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../store/slices/cartSlice";
import "./Cart.css";

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const shipping = total >= 99 ? 0 : 9.99;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="cart-empty page-container">
        <div className="cart-empty-content">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/" className="shop-btn">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-container fade-up">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <button className="clear-btn" onClick={() => dispatch(clearCart())}>
          Clear All
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <Link to={`/product/${item.id}`} className="cart-item-img-wrap">
                <img src={item.image} alt={item.name} className="cart-item-img" />
              </Link>
              <div className="cart-item-info">
                <p className="cart-item-cat">{item.category}</p>
                <Link to={`/product/${item.id}`} className="cart-item-name">
                  {item.name}
                </Link>
                <p className="cart-item-price">${item.price.toFixed(2)} each</p>
              </div>
              <div className="cart-item-controls">
                <div className="qty-control">
                  <button
                    onClick={() =>
                      dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                    }
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                    }
                  >
                    +
                  </button>
                </div>
                <p className="cart-item-subtotal">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  className="remove-btn"
                  onClick={() => dispatch(removeFromCart(item.id))}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? <span className="free">Free</span> : `$${shipping.toFixed(2)}`}</span>
          </div>
          {shipping > 0 && (
            <p className="shipping-note">
              Add ${(99 - total).toFixed(2)} more for free shipping
            </p>
          )}
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
          <button className="checkout-btn">Proceed to Checkout</button>
          <Link to="/" className="continue-link">← Continue Shopping</Link>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
