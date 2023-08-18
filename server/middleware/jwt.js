const jwt = require("jsonwebtoken");
const { User } = require("../models");

const jwtProses = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ massage: "Incorrect credential" });
  }

  const JWTToken = token.split(" ").pop();

  try {
    const data = jwt.verify(JWTToken, "fembinurilham");

    const user = await User.findOne({
      where: {
        id: data.data.users_id,
      },
    });

    if (!user) {
      return res.json({
        message: "User not found",
      });
    }

    req.user = data.data;

    next();
  } catch (err) {
    return res.status(500).json({ massage: "Incorrect credential" });
  }
};

module.exports = jwtProses;
