import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from "../store/slices/cartSlice";
import "./Checkout.css";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const shipping = total >= 99 ? 0 : 9.99;
  const grandTotal = total + shipping;

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    card: "",
    expiry: "",
    cvv: "",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId] = useState(() => "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase());

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    dispatch(clearCart());
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-empty page-container">
        <div className="checkout-empty-content">
          <h2>Nothing to checkout</h2>
          <p>Your cart is empty. Add some items first!</p>
          <Link to="/" className="shop-btn">Go Shopping</Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="checkout-success page-container fade-up">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h1>Order Confirmed!</h1>
          <p className="order-id">Order ID: <strong>{orderId}</strong></p>
          <p className="success-msg">
            Thank you for your purchase, <strong>{form.name}</strong>!
            <br />
            A confirmation email has been sent to <strong>{form.email}</strong>.
          </p>
          <div className="success-details">
            <p>Estimated delivery: <strong>3–5 business days</strong></p>
            <p>Total charged: <strong>${grandTotal.toFixed(2)}</strong></p>
          </div>
          <Link to="/" className="shop-btn">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page page-container fade-up">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping Information</h2>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="123 Main St"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="New York"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="zip">ZIP Code</label>
              <input
                id="zip"
                name="zip"
                type="text"
                placeholder="10001"
                value={form.zip}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <h2>Payment Details</h2>
          <div className="form-group">
            <label htmlFor="card">Card Number</label>
            <input
              id="card"
              name="card"
              type="text"
              placeholder="4242 4242 4242 4242"
              value={form.card}
              onChange={handleChange}
              maxLength="19"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiry">Expiry</label>
              <input
                id="expiry"
                name="expiry"
                type="text"
                placeholder="MM/YY"
                value={form.expiry}
                onChange={handleChange}
                maxLength="5"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                id="cvv"
                name="cvv"
                type="text"
                placeholder="123"
                value={form.cvv}
                onChange={handleChange}
                maxLength="4"
                required
              />
            </div>
          </div>

          <button type="submit" className="place-order-btn">
            Place Order — ${grandTotal.toFixed(2)}
          </button>
          <Link to="/cart" className="back-link">← Back to Cart</Link>
        </form>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>
          <div className="checkout-items">
            {items.map((item) => (
              <div key={item.id} className="checkout-item">
                <img src={item.image} alt={item.name} className="checkout-item-img" />
                <div className="checkout-item-info">
                  <p className="checkout-item-name">{item.name}</p>
                  <p className="checkout-item-qty">Qty: {item.quantity}</p>
                </div>
                <p className="checkout-item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="checkout-divider" />
          <div className="checkout-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="checkout-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? <span className="free">Free</span> : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="checkout-divider" />
          <div className="checkout-row checkout-total">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
