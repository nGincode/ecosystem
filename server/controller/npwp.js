const jwt = require("jsonwebtoken");
const { hash, verify } = require("node-php-password");
const { User, npwp } = require("../models");
const { Op } = require("sequelize");
const Crypto = require("crypto");

const getId = async (req, res) => {
  const { users_id, users_uuid, email, username } = req.user;
  const { uuid } = req.params;

  const Npwp = await npwp.findOne({
    where: { uuid: uuid },
    attributes: ["uuid", "npwp", "fullName", "phone", "address"],
  });

  if (!Npwp) {
    return res.json({
      message: "NPWP not found",
    });
  }

  res.json({
    massage: "Get data successful",
    data: Npwp,
  });
};

const putId = async (req, res) => {
  const { uuid } = req.params;
  const { users_id, users_uuid } = req.user;
  const { fullName, address, phone } = req.body;

  const Npwp = await npwp.findOne({
    where: { uuid: uuid },
  });

  if (!Npwp) {
    return res.json({
      message: "NPWP not found",
    });
  }

  const data = {
    npwp: req.body.npwp,
    fullName: fullName,
    phone: phone,
    address: address,
  };

  await Npwp.update(data);

  res.json({
    status: 200,
    massage: "Update data successful",
    data: data,
  });
};

const get = async (req, res) => {
  const { users_id, users_uuid, email, username } = req.user;

  const Npwp = await npwp.findAll({
    attributes: ["uuid", "npwp", "fullName", "phone", "address"],
  });

  if (!Npwp) {
    return res.json({
      message: "NPWP not found",
    });
  }

  res.json({
    massage: "Get data successful",
    data: Npwp,
  });
};

const put = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const { fullName, address, phone } = req.body;

  const Npwp = await npwp.findOne({
    where: { uuid: uuid },
  });

  if (!Npwp) {
    return res.json({
      message: "NPWP not found",
    });
  }

  const data = {
    npwp: req.body.npwp,
    fullName: fullName,
    phone: phone,
    address: address,
  };

  await npwp.update(data);

  res.json({
    status: 200,
    massage: "Update data successful",
    data: data,
  });
};

const del = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const { uuid } = req.params;

  const Npwp = await npwp.findOne({
    where: { uuid: uuid },
    attributes: ["id", "uuid", "npwp", "fullName", "phone", "address"],
  });

  if (!Npwp) {
    return res.json({
      message: "NPWP not found",
    });
  }

  await Npwp.destroy();

  res.json({
    massage: "Delete successful",
    data: npwp,
  });
};

const post = async (req, res) => {
  const { fullName, address, phone } = req.body;

  const data = {
    uuid: Crypto.randomUUID(),
    npwp: req.body.npwp,
    fullName: fullName,
    phone: phone,
    address: address,
  };

  await npwp.create(data);

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
