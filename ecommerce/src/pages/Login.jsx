// src/pages/Login.jsx  ← NEW FILE
// Add route: <Route path="/login" element={<Login />} /> in App.js

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, registerUser, selectAuthStatus, selectAuthError } from "../store/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);

  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "signin") {
      const result = await dispatch(loginUser({ email: form.email, password: form.password }));
      if (result.meta.requestStatus === "fulfilled") navigate("/");
    } else {
      const result = await dispatch(registerUser(form));
      if (result.meta.requestStatus === "fulfilled") {
        alert("Account created! Please sign in.");
        setMode("signin");
      }
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 420, paddingTop: "4rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>{mode === "signin" ? "Sign In" : "Create Account"}</h1>

      {authError && (
        <p style={{ color: "red", marginBottom: "1rem" }}>{authError}</p>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {mode === "signup" && (
          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          style={btnStyle}
        >
          {status === "loading" ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        {mode === "signin" ? (
          <>Don't have an account? <button onClick={() => setMode("signup")} style={linkBtn}>Sign Up</button></>
        ) : (
          <>Already have an account? <button onClick={() => setMode("signin")} style={linkBtn}>Sign In</button></>
        )}
      </p>

      <Link to="/" style={{ display: "block", textAlign: "center", marginTop: "1rem" }}>← Back to Shop</Link>
    </div>
  );
};

const inputStyle = {
  padding: "0.75rem 1rem",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "1rem",
  width: "100%",
  boxSizing: "border-box",
};

const btnStyle = {
  padding: "0.75rem",
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "1rem",
  cursor: "pointer",
};

const linkBtn = {
  background: "none",
  border: "none",
  color: "#111",
  textDecoration: "underline",
  cursor: "pointer",
  fontSize: "inherit",
};

export default Login;
