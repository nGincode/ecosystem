const jwt = require("jsonwebtoken");
const { verify } = require("node-php-password");
const { User } = require("../../models");

module.exports = async (req, res) => {
  const { body } = req;

  if (!body.email || !body.password) {
    return res.json({
      status: 400,
      message: "Email and password must be provided",
    });
  }

  const user = await User.findOne({
    where: { email: body.email },
  });

  if (!user) {
    return res.json({
      status: 404,
      message: "Email not found",
    });
  }

  const isPasswordCorrect = verify(body.password, user.password);
  if (!isPasswordCorrect) {
    return res.json({
      status: 404,
      message: "Wrong Password",
    });
  }

  const data = {
    users_uuid: user.uuid,
    users_id: user.id,
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign({ data }, "fembinurilham");

  return res.json({
    status: 200,
    token,
    client_id: user.uuid,
    data: user,
  });
};
