const jwt = require("jsonwebtoken");
const { hash, verify } = require("node-php-password");
const { User, npwp, company } = require("../models");
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

  if (req.body.npwp.length < 15 || req.body.npwp.length > 16) {
    return res.status(400).json({
      massage: "NPWP/NIK Not Valid",
    });
  }

  const Npwp = await npwp.findOne({
    where: { uuid: uuid },
  });

  if (req.body.npwp !== Npwp.npwp) {
    const cekNPWP = await npwp.findOne({ where: { npwp: req.body.npwp } });
    if (cekNPWP) {
      return res.status(400).json({
        massage: "NPWP has been used",
      });
    }
  }

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
  const { users_id, users_uuid, email, username, permission } = req.user;
  const { company_id } = req.query;

  if (!company_id) {
    return res.status(400).json({
      massage: "Company not found",
    });
  }
  const Company = await company.findOne({
    where: {
      uuid: company_id,
    },
  });

  if (!Company) {
    return res.status(400).json({
      massage: "Company not found",
    });
  }

  let Npwp;
  if (permission.view === "all") {
    Npwp = await npwp.findAll({
      where: { company_id: Company.id },
      attributes: ["uuid", "npwp", "name", "phone", "address"],
    });
  } else {
    Npwp = await npwp.findAll({
      where: {
        user_id: users_id,
        company_id: Company.id,
      },
      attributes: ["uuid", "npwp", "name", "phone", "address"],
    });
  }

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
      email: val.email,
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
    company_id,
  } = req.body;

  const Npwp = await npwp.findOne({
    where: { uuid: uuid },
  });

  const Company = await company.findOne({
    where: {
      uuid: company_id,
    },
  });

  if (!Company) {
    return res.status(400).json({
      massage: "Company not found",
    });
  }

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
    company_id: Company.id,
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
  const { name, address, phone, email, company_id } = req.body;
  const { users_id, users_uuid } = req.user;

  if (req.body.npwp.length < 15 || req.body.npwp.length > 16) {
    return res.status(400).json({
      massage: "NPWP/NIK Not Valid",
    });
  }

  const cekNPWP = await npwp.findOne({ where: { npwp: req.body.npwp } });

  if (cekNPWP) {
    return res.status(400).json({
      massage: "NPWP has been used",
    });
  }

  const Company = await company.findOne({
    where: {
      uuid: company_id,
    },
  });

  if (!Company) {
    return res.status(400).json({
      massage: "Company not found",
    });
  }

  const data = {
    uuid: Crypto.randomUUID(),
    npwp: req.body.npwp,
    name: name,
    phone: phone,
    address: address,
    email: email,
    user_id: users_id,
    company_id: Company.id,
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
