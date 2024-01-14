var jwt = require("jsonwebtoken");

const Auth = async (req, res, next) => {
  try {
    const token = req.get("authorization");
    if (!token) return res.status(401).send({ error: "There is no token" });
    const jwtSecret = req.originalUrl.includes("refresh")
      ? process.env.JWT_REFRESH_SECRET
      : process.env.JWT_SECRET;
    jwt.verify(token.split(" ")[1], jwtSecret, (err, user) => {
      if (err) {
        console.log(err?.message);
        return res
          .status(401)
          .send({
            error:
              err.message == "jwt expired"
                ? "Token Expired Please login again"
                : "Invalid Token",
          });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(401).send({ error: "Unauthorized" });
  }
};

module.exports = { Auth };
