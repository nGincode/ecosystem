const jwt = require("jsonwebtoken");
const { verify } = require("node-php-password");
const { user, permission } = require("../../models");

module.exports = async (req, res) => {
  const { body } = req;

  if (!body.email || !body.password) {
    return res.json({
      status: 400,
      message: "Email and password must be provided",
    });
  }

  const User = await user.findOne({
    where: { email: body.email },
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

  if (!User) {
    return res.json({
      status: 404,
      message: "Email not found",
    });
  }

  if (!User.status === "active") {
    return res.json({
      status: 404,
      message: "Account not active",
    });
  }

  const isPasswordCorrect = verify(body.password, User.password);
  if (!isPasswordCorrect) {
    return res.json({
      status: 404,
      message: "Wrong Password",
    });
  }

  const data = {
    users_uuid: User.uuid,
    users_id: User.id,
    email: User.email,
    username: User.username,
    permission: User.permission,
  };
  const token = jwt.sign({ data }, "fembinurilham");

  return res.json({
    status: 200,
    token,
    client_id: User.uuid,
    data: User,
  });
};
