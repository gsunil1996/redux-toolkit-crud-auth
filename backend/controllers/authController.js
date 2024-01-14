const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .send({ error: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const { password: _, ...rest } = user._doc;
    return res.status(201).send({ user: rest });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ error: "Invalid Credentials" });
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(401).send({ error: "Invalid Credentials" });
    }
    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );
    const { password: _, ...rest } = user._doc;
    return res.status(201).send({ user: rest, token, refreshToken });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};

const refresh = async (req, res) => {
  try {
    const { user } = req;
    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    return res.status(201).send({ token });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};

const protectedRoute = (req, res) => {
  try {
    return res.status(201).send({ message: "protected route" });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};

module.exports = { register, login, refresh, protectedRoute };
