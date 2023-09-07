const jwt = require("jsonwebtoken");
const { hash, verify } = require("node-php-password");
const { User, npwp, permission } = require("../models");
const { Op } = require("sequelize");
const Crypto = require("crypto");

const getId = async (req, res) => {
  const { users_id, users_uuid, email, username } = req.user;
  const { uuid } = req.params;

  const Npwp = await npwp.findOne({
    where: { uuid: uuid },
    attributes: ["uuid", "npwp", "name", "phone", "address"],
  });

  if (!Npwp) {
    return res.json({
      message: "NPWP not found",
    });
  }

  res.json({
    status: 200,
    massage: "Get data successful",
    data: Npwp,
  });
};

const putId = async (req, res) => {
  const { uuid } = req.params;
  const { users_id, users_uuid } = req.user;
  const {
    name,
    phone,
    jalan,
    block,
    no,
    rt,
    rw,
    kec,
    kel,
    prov,
    kabkot,
    kodepos,
    email,
  } = req.body;

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
    name: name,
    phone: phone,
    email: email,
    address: {
      jalan: jalan,
      block: block,
      no: no,
      rt: rt,
      rw: rw,
      kec: kec,
      kel: kel,
      prov: prov,
      kabkot: kabkot,
      kodepos: kodepos,
    },
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

  const Permission = await permission.findAll();

  if (!Permission) {
    return res.json({
      message: "Permission not found",
    });
  }

  const data = Permission.map((val) => {
    return {
      uuid: val.uuid,
      name: val.name,
      permission: val.data,
    };
  });

  res.json({
    status: 200,
    massage: "Get data successful",
    data: data,
  });
};

const put = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const {
    name,
    phone,
    jalan,
    block,
    no,
    rt,
    rw,
    kec,
    kel,
    prov,
    kabkot,
    kodepos,
    email,
  } = req.body;

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
    name: name,
    phone: phone,
    email: email,
    address: {
      jalan: jalan,
      block: block,
      no: no,
      rt: rt,
      rw: rw,
      kec: kec,
      kel: kel,
      prov: prov,
      kabkot: kabkot,
      kodepos: kodepos,
    },
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
    attributes: ["id", "uuid", "npwp", "name", "phone", "address"],
  });

  if (!Npwp) {
    return res.json({
      message: "NPWP not found",
    });
  }

  await Npwp.destroy();

  res.json({
    massage: "Delete successful",
    data: Npwp,
  });
};

const post = async (req, res) => {
  const { name, perm } = req.body;

  const data = {
    uuid: Crypto.randomUUID(),
    data: perm,
    name: name,
  };

  await permission.create(data);

  return res.json({
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
