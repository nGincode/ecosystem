const jwt = require("jsonwebtoken");
const { hash, verify } = require("node-php-password");
const { user, permissionUser, permission, company } = require("../models");
const { Op } = require("sequelize");
const Crypto = require("crypto");
const moment = require("moment/moment");

const getId = async (req, res) => {
  const { users_id, users_uuid, email, username } = req.user;
  const { uuid } = req.params;

  const User = await user.findOne({
    where: { uuid: uuid },
    attributes: [
      "uuid",
      "img",
      "fullName",
      "email",
      "username",
      "dateOfBirth",
      "phone",
      "address",
      "status",
    ],
    include: [
      {
        model: permission,
        as: "permission",
        attributes: {
          exclude: ["id", "uuid", "createdAt", "updatedAt"],
        },
      },
      {
        model: company,
        as: "company",
      },
    ],
  });

  if (!User) {
    return res.json({
      massage: "User not found",
    });
  }

  res.json({
    massage: "Get data successful",
    data: User,
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

  const Permission = await permission.findOne({ where: { name: role } });

  if (!Permission) {
    return res.status(400).json({
      massage: "Role not valid",
    });
  }

  const User = await user.findOne({
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
      "address",
      "status",
    ],
    include: [
      {
        model: permission,
        as: "permission",
        attributes: {
          exclude: ["id", "uuid", "createdAt", "updatedAt"],
        },
      },
      {
        model: company,
        as: "company",
      },
    ],
  });

  if (!User) {
    return res.status(400).json({
      massage: "User not found",
    });
  }

  if (User.email !== email) {
    const Email = await user.findOne({
      where: { email: email },
    });

    if (Email) {
      return res.status(400).json({
        massage: "Email already used",
      });
    }
  }

  if (User.username !== username) {
    const Username = await user.findOne({
      where: { username: username },
    });

    if (Username) {
      return res.status(400).json({
        massage: "Username already used",
      });
    }
  }

  const data = {
    username: username,
    email: email,
    fullName: fullName,
    phone: phone,
    address: address,
    dateOfBirth: dateOfBirth,
    permission_id: Permission.id,
    status: status,
  };

  await User.update(data);

  res.json({
    status: 200,
    massage: "Update data successful",
    data: data,
  });
};

const get = async (req, res) => {
  const { users_id, users_uuid, email, username } = req.user;

  const User = await user.findAll({
    attributes: [
      "uuid",
      "img",
      "fullName",
      "email",
      "username",
      "dateOfBirth",
      "phone",
      "address",
      "status",
    ],
    include: [
      {
        model: permission,
        as: "permission",
        attributes: {
          exclude: ["id", "uuid", "createdAt", "updatedAt"],
        },
      },
      {
        model: company,
        as: "company",
      },
    ],
  });

  if (!User) {
    return res.json({
      massage: "User not found",
    });
  }
  res.json({
    massage: "Get data successful",
    data: User.map((val) => {
      return {
        uuid: val.uuid,
        img: val.img,
        fullName: val.fullName,
        email: val.email,
        username: val.username,
        dateOfBirth: val.dateOfBirth
          ? moment(val.dateOfBirth).format("DD MMM YYYY")
          : "-",
        phone: val.phone,
        role: val?.permission?.name,
        address: val.address,
        status: val.status,
      };
    }),
  });
};

const put = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const {
    username,
    email,
    fullName,
    phone,
    address,
    dateOfBirth,
    files,
    old_password,
    password,
    confirm_password,
  } = req.body;

  const User = await user.findOne({
    where: { id: users_id },
    include: [
      {
        model: permission,
        as: "permission",
        attributes: {
          exclude: ["id", "uuid", "createdAt", "updatedAt"],
        },
      },
      {
        model: company,
        as: "company",
      },
    ],
  });

  if (!User) {
    return res.json({
      massage: "User not found",
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
      permission: User.permission,
      img: User.img,
    };

    await User.update(data);

    const token = jwt.sign(
      {
        data: {
          users_uuid: users_uuid,
          users_id: users_id,
          email: email,
          username: username,
          permission: User.permission,
          company: User.company,
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

    const isPasswordCorrect = verify(old_password, User.password);
    if (!isPasswordCorrect) {
      return res.status(404).json({
        massage: "Wrong Old Password",
      });
    }

    const data = {
      password: hash(password),
    };

    await User.update(data);

    res.json({
      status: 200,
      massage: "Update password successful",
    });
  } else if (files) {
    const type = files.split(";")[0].split("/")[1];
    require("fs").writeFile(
      __dirname + `/../../public/upload/profile/${users_uuid}.${type}`,
      new Buffer.from(files.replace(/^data:image\/\w+;base64,/, ""), "base64"),
      (err) => {
        console.log(err);
      }
    );

    const data = {
      username: User.username,
      email: User.email,
      fullName: User.fullName,
      phone: User.phone,
      address: User.address,
      dateOfBirth: User.dateOfBirth,
      permission: User.permission,
      company: User.company,
      img: "/upload/profile/" + users_uuid + "." + type,
    };
    await User.update({
      img: "/upload/profile/" + users_uuid + "." + type,
    });

    return res.json({
      massage: "Upload Avatar Success",
      data: data,
    });
  } else {
    return res.json({
      massage: "User not found",
    });
  }
};

const del = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const { uuid } = req.params;

  const User = await user.findOne({
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
      "address",
      "status",
    ],
  });

  if (!User) {
    return res.json({
      massage: "User not found",
    });
  }

  require("fs").unlink(__dirname + `/../../public${User.img}`, (err) => {
    console.log(err);
  });

  await User.destroy();

  res.json({
    massage: "Delete successful",
    data: User,
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

  const User = await user.findOne({
    where: { [Op.or]: [{ username: username }, { email: email }] },
    include: [
      {
        model: permission,
        as: "permission",
        attributes: {
          exclude: ["id", "uuid", "createdAt", "updatedAt"],
        },
      },
      {
        model: company,
        as: "company",
      },
    ],
  });

  const Permission = await permission.findOne({ where: { name: role } });

  if (User) {
    return res.status(400).json({
      massage: "Email or Username already used",
    });
  }

  if (!role) {
    return res.status(400).json({
      massage: "Role required",
    });
  }

  if (!Permission) {
    return res.status(400).json({
      massage: "Role not valid",
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
    fullName: fullName,
    phone: phone,
    address: address,
    dateOfBirth: dateOfBirth,
    password: hash(password),
    status: "active",
    permission_id: Permission.id,
  };
  await user.create(data);

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
