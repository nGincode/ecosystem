const jwt = require("jsonwebtoken");
const { hash, verify } = require("node-php-password");
const { user, company, companyUser } = require("../models");
const { Op } = require("sequelize");
const Crypto = require("crypto");
const moment = require("moment/moment");

const getId = async (req, res) => {
  const { users_id, users_uuid, email, username } = req.user;
  const { uuid } = req.params;

  const Company = await company.findOne({
    where: { uuid: uuid },
    attributes: ["uuid", "npwp", "name", "phone", "address"],
  });

  if (!Company) {
    return res.json({
      massage: "Company not found",
    });
  }

  res.json({
    status: 200,
    massage: "Get data successful",
    data: Company,
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
  const users = req.body?.["users"];

  if (req.body.npwp.length < 15 || req.body.npwp.length > 16) {
    return res.status(400).json({
      massage: "NPWP/NIK Not Valid",
    });
  }

  const Company = await company.findOne({
    where: { uuid: uuid },
  });

  if (req.body.npwp !== Company.npwp) {
    const cekCompany = await company.findOne({
      where: { npwp: req.body.npwp },
    });
    if (cekCompany) {
      return res.status(400).json({
        massage: "Company has been used",
      });
    }
  }

  if (!Company) {
    return res.status(400).json({
      massage: "Company not found",
    });
  }

  if (!users.length) {
    return res.status(400).json({
      massage: "Users not found",
    });
  }

  const data = {
    npwp: req.body.npwp,
    name: name,
    phone: phone,
    email: email == "" || !email ? null : email,
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

  await Company.update(data);

  await companyUser.destroy({
    where: {
      company_id: Company.id,
    },
  });

  let createCompanyUser = [];
  if (!Array.isArray(users)) {
    const dtUser = await user.findOne({ where: { uuid: users } });
    if (dtUser) {
      createCompanyUser.push({
        company_id: Company.id,
        user_id: dtUser.id,
      });
    } else {
      return res.status(400).json({
        massage: "Users not valid",
      });
    }
  } else {
    for (let index = 0; index < users.length; index++) {
      const usersUUID = users[index];
      const dtUser = await user.findOne({ where: { uuid: usersUUID } });
      if (dtUser) {
        createCompanyUser.push({
          company_id: Company.id,
          user_id: dtUser.id,
        });
      } else {
        return res.status(400).json({
          massage: "Users not valid",
        });
      }
    }
  }
  await companyUser.bulkCreate(createCompanyUser);

  res.json({
    status: 200,
    massage: "Update data successful",
    data: data,
  });
};

const get = async (req, res) => {
  const { users_id, users_uuid, email, username, permission } = req.user;
  const { dataUser } = req.query;

  if (dataUser) {
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
          value: val.uuid,
          label: val.username,
        };
      }),
    });
  } else {
    let Company;
    if (permission.view === "all") {
      Company = await company.findAll({
        attributes: ["uuid", "npwp", "name", "phone", "address"],
        include: [
          {
            model: user,
            as: "user",
          },
        ],
      });
    } else {
      Company = await company.findAll({
        where: {
          user_id: users_id,
        },
        attributes: ["uuid", "npwp", "name", "phone", "address"],
        include: [
          {
            model: user,
            as: "user",
          },
        ],
      });
    }

    if (!Company) {
      return res.json({
        massage: "Company not found",
      });
    }

    const data = Company.map((val) => {
      if (!Array.isArray(val.address)) {
        val.address = JSON.parse(val.address);
      }

      return {
        uuid: val.uuid,
        name: val.name,
        npwp: val.npwp,
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
        userCompany: val.user,
      };
    });

    res.json({
      status: 200,
      massage: "Get data successful",
      data: data,
    });
  }
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
    users,
  } = req.body;

  const Company = await company.findOne({
    where: { uuid: uuid },
  });

  if (!Company) {
    return res.json({
      massage: "Company not found",
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

  await company.update(data);

  await companyUser.destroy({
    where: {
      company_id: Company.id,
    },
  });

  for (let index = 0; index < users.length; index++) {
    const usersUUID = users[index];
    const dtUser = await user.findOne({ where: { uuid: usersUUID } });
    await companyUser.create({
      company_id: Company.id,
      user_id: dtUser.id,
    });
  }

  res.json({
    status: 200,
    massage: "Update data successful",
    data: data,
  });
};

const del = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const { uuid } = req.params;

  const Company = await company.findOne({
    where: { uuid: uuid },
    attributes: ["id", "uuid", "npwp", "name", "phone", "address"],
  });

  if (!Company) {
    return res.status(400).json({
      massage: "Company not found",
    });
  }

  await Company.destroy();
  await companyUser.destroy({
    where: {
      company_id: Company.id,
    },
  });

  res.json({
    massage: "Delete successful",
    data: Company,
  });
};

const post = async (req, res) => {
  const { name, address, phone, email } = req.body;
  const { users_id, users_uuid } = req.user;

  if (req.body.npwp.length < 15 || req.body.npwp.length > 16) {
    return res.status(400).json({
      massage: "NPWP/NIK Not Valid",
    });
  }

  const cekCompany = await company.findOne({
    where: { npwp: req.body.npwp },
  });

  if (cekCompany) {
    return res.status(400).json({
      massage: "Company has been used",
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
  };

  let postCom = await company.create(data);

  if (postCom) {
    await companyUser.create({
      company_id: postCom.id,
      user_id: users_id,
    });
  }

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
