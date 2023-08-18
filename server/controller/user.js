const jwt = require("jsonwebtoken");
const { hash, verify } = require("node-php-password");
const { User } = require("../models");
const { Op } = require("sequelize");
const Crypto = require("crypto");

const getId = async (req, res) => {
  const { users_id, users_uuid, email, username } = req.user;
  const { uuid } = req.params;

  const user = await User.findOne({
    where: { uuid: uuid },
    attributes: [
      "uuid",
      "img",
      "fullName",
      "email",
      "username",
      "dateOfBirth",
      "phone",
      "role",
      "address",
      "status",
    ],
  });

  if (!user) {
    return res.json({
      message: "User not found",
    });
  }

  res.json({
    massage: "Get data successful",
    data: user,
  });
};

const putId = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const {
    username,
    email,
    fullName,
    phone,
    address,
    dateOfBirth,
    role,
    status,
    active,
  } = req.body;
  const { uuid } = req.params;

  const user = await User.findOne({
    where: { uuid: uuid },
    attributes: [
      "id",
      "uuid",
      "img",
      "fullName",
      "email",
      "username",
      "dateOfBirth",
      "phone",
      "role",
      "address",
      "status",
    ],
  });

  if (!user) {
    return res.json({
      message: "User not found",
    });
  }

  const data = {
    username: username,
    email: email,
    fullName: fullName,
    phone: phone,
    address: address,
    dateOfBirth: dateOfBirth,
    role: role,
    status: status,
  };

  await user.update(data);

  res.json({
    status: 200,
    massage: "Update data successful",
    data: data,
  });
};

const get = async (req, res) => {
  const { users_id, users_uuid, email, username } = req.user;

  const user = await User.findAll({
    attributes: [
      "uuid",
      "img",
      "fullName",
      "email",
      "username",
      "dateOfBirth",
      "phone",
      "role",
      "address",
      "status",
    ],
  });

  if (!user) {
    return res.json({
      message: "User not found",
    });
  }

  res.json({
    massage: "Get data successful",
    data: user,
  });
};

const put = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const { username, email, fullName, phone, address, dateOfBirth } = req.body;
  const { old_password, password, confirm_password } = req.body;

  const user = await User.findOne({
    where: { id: users_id },
  });

  if (!user) {
    return res.json({
      message: "User not found",
    });
  }

  if (email) {
    const data = {
      username: username,
      email: email,
      fullName: fullName,
      phone: phone,
      address: address,
      dateOfBirth: dateOfBirth,
    };

    await user.update(data);

    const token = jwt.sign(
      {
        data: {
          users_uuid: users_uuid,
          users_id: users_id,
          email: email,
          username: username,
        },
      },
      "fembinurilham"
    );

    res.json({
      status: 200,
      massage: "Update data successful",
      data: data,
      token,
    });
  } else if (old_password && password && confirm_password) {
    if (
      old_password.length < 8 ||
      password.length < 8 ||
      confirm_password.length < 8
    ) {
      return res.status(400).json({
        massage: "Password min 8 char",
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        massage: "Password not match",
      });
    }

    const isPasswordCorrect = verify(old_password, user.password);
    if (!isPasswordCorrect) {
      return res.status(404).json({
        massage: "Wrong Old Password",
      });
    }

    const data = {
      password: hash(password),
    };

    await user.update(data);

    res.json({
      status: 200,
      massage: "Update password successful",
    });
  } else if (req.files) {
    const { img } = req.files;
    img.mv(
      __dirname +
        "../../../public/upload/" +
        users_uuid +
        "." +
        img.name.split(".")[1]
    );

    const data = {
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      img: "/upload/" + users_uuid + "." + img.name.split(".")[1],
    };
    await user.update({
      img: "/upload/" + users_uuid + "." + img.name.split(".")[1],
    });

    return res.json({
      massage: "Upload Avatar Success",
      data: data,
    });
  } else {
    return res.json({
      message: "User not found",
    });
  }
};

const del = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const { uuid } = req.params;

  const user = await User.findOne({
    where: { uuid: uuid },
    attributes: [
      "id",
      "uuid",
      "img",
      "fullName",
      "email",
      "username",
      "dateOfBirth",
      "phone",
      "role",
      "address",
      "status",
    ],
  });

  if (!user) {
    return res.json({
      message: "User not found",
    });
  }

  await user.destroy();

  res.json({
    massage: "Delete successful",
    data: user,
  });
};

const post = async (req, res) => {
  const {
    username,
    email,
    fullName,
    phone,
    address,
    dateOfBirth,
    role,
    password,
    confirm_password,
  } = req.body;

  const user = await User.findOne({
    where: { [Op.or]: [{ username: username }, { email: email }] },
  });

  if (user) {
    return res.status(400).json({
      massage: "Email or Username already used",
    });
  }

  if (password.length < 8 || confirm_password.length < 8) {
    return res.status(400).json({
      massage: "Password min 8 char",
    });
  }

  if (password !== confirm_password) {
    return res.status(400).json({
      massage: "Password not match",
    });
  }

  const data = {
    uuid: Crypto.randomUUID(),
    username: username,
    email: email,
    role: role,
    fullName: fullName,
    phone: phone,
    address: address,
    dateOfBirth: dateOfBirth,
    password: hash(password),
    status: "active",
  };

  await User.create(data);

  res.json({
    status: 200,
    massage: "Create successful",
    data: data,
  });
};

module.exports = {
  get,
  put,
  post,
  del,
  getId,
  putId,
};
