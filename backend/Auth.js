var jwt = require("jsonwebtoken");

const Auth = async (req, res, next) => {
  try {
    const token = req.get("authorization");
    if (!token) return res.status(401).send({ error: "There is no token" });
    const jwtSecret = req.originalUrl.includes("refresh")
      ? process.env.JWT_REFRESH_SECRET
      : process.env.JWT_SECRET;
    jwt.verify(token.split(" ")[1], jwtSecret, (err, user) => {
      if (err && err?.message === "TokenExpiredError") {
        return res.status(403).send({ error: "token expired" });
      }
      if (err) {
        return res.status(401).send({ error: "Invalid Token" });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(401).send({ error: "Unauthorized" });
  }
};

module.exports = { Auth };
