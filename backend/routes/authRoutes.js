// routes/authRoutes.js
const express = require("express");
const {
  register,
  login,
  refresh,
  protectedRoute,
} = require("../controllers/authController");
const { Auth } = require("../Auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refresh", Auth, refresh);
router.get("/protected", Auth, protectedRoute);

module.exports = router;
