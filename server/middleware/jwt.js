const jwt = require("jsonwebtoken");
const { user, permission } = require("../models");

const jwtProses = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ massage: "Incorrect credential" });
  }

  const JWTToken = token.split(" ").pop();

  try {
    const data = jwt.verify(JWTToken, "fembinurilham");

    const User = await user.findOne({
      where: {
        id: data.data.users_id,
      },
      include: [
        {
          model: permission,
          as: "permission",
          attributes: {
            exclude: ["id", "uuid", "createdAt", "updatedAt"],
          },
        },
      ],
    });

    const dataNew = {
      users_uuid: User.uuid,
      users_id: User.id,
      email: User.email,
      username: User.username,
      permission: User.permission,
    };

    if (!User) {
      return res.json({
        message: "User not found",
      });
    }

    req.user = dataNew;

    next();
  } catch (err) {
    return res.status(500).json({ massage: "Incorrect credential" });
  }
};

module.exports = jwtProses;
