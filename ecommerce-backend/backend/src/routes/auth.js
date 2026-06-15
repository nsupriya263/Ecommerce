const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { name },
    email_confirm: true, // auto-confirm for development
  });

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({
    message: "User created successfully",
    user: { id: data.user.id, email: data.user.email },
  });
});

// POST /api/auth/signin
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  // Sign in via Supabase client (not admin) to get user session/token
  const { createClient } = require("@supabase/supabase-js");
  const userClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY // public anon key for sign-in
  );

  const { data, error } = await userClient.auth.signInWithPassword({ email, password });

  if (error) return res.status(401).json({ error: error.message });

  res.json({
    token: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name,
    },
  });
});

// POST /api/auth/signout  (client just discards the token; this is optional server-side)
router.post("/signout", (req, res) => {
  res.json({ message: "Signed out" });
});

module.exports = router;
