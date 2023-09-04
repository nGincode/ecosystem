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
    attributes: ["uuid", "npwp", "name", "phone", "address"],
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

  const Npwp = await npwp.findAll({
    attributes: ["uuid", "npwp", "name", "phone", "address"],
  });

  if (!Npwp) {
    return res.json({
      message: "NPWP not found",
    });
  }

  const data = Npwp.map((val) => {
    return {
      uuid: val.uuid,
      npwp: val.npwp,
      name: val.name,
      phone: val.phone,
      addressJson: val.address,
      address:
        val.address.jalan +
        " " +
        val.address.block +
        " " +
        val.address.no +
        " " +
        val.address.rt +
        " " +
        val.address.rw +
        " " +
        val.address.kel +
        " " +
        val.address.kec +
        " " +
        val.address.kabkot +
        " " +
        val.address.prov +
        " " +
        val.address.kodepos,
    };
  });

  res.json({
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
    data: npwp,
  });
};

const post = async (req, res) => {
  const { name, address, phone } = req.body;

  const data = {
    uuid: Crypto.randomUUID(),
    npwp: req.body.npwp,
    name: name,
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
