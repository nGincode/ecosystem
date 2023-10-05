const jwt = require("jsonwebtoken");
const { hash, verify } = require("node-php-password");
const { User, npwp, permission } = require("../models");
const { Op } = require("sequelize");
const Crypto = require("crypto");

const putId = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const { uuid } = req.params;
  const { name, view, format } = req.body;

  const Permission = await permission.findOne({
    where: { uuid: uuid },
  });

  if (Permission.name !== name) {
    const dtPermission = await permission.findOne({ where: { name: name } });
    if (dtPermission) {
      return res.status(400).json({
        massage: "Name already exists",
      });
    }
  }

  if (!view) {
    return res.status(400).json({
      massage: "View Data required",
    });
  }

  if (!name) {
    return res.status(400).json({
      massage: "Name required",
    });
  }

  if (!Permission) {
    return res.status(404).json({
      massage: "ID not found",
    });
  }

  let post = JSON.parse(format).map((val) => {
    let data = [];
    let check = false;
    val.data.map((vall) => {
      if (vall.option) {
        let optionCheck = false;
        let dataOption = [];
        vall.option.map((valll) => {
          let find = req.body[valll.name.replace("[]", "")];
          if (find?.[0] === "true") {
            optionCheck = true;
          }
          dataOption.push({
            name: valll.name,
            label: valll.label,
            link: valll.link,
            checklist: [
              find?.[0] === "true" ? "view" : null,
              find?.[1] === "true" ? "create" : null,
              find?.[2] === "true" ? "edit" : null,
              find?.[3] === "true" ? "delete" : null,
            ],
          });
        });

        data.push({
          label: vall.label,
          check: optionCheck,
          data: dataOption,
        });
      } else {
        let find = req.body[vall.name.replace("[]", "")];
        if (find?.[0] === "true") {
          check = true;
        }
        data.push({
          name: vall.name,
          label: vall.label,
          link: vall.link,
          checklist: [
            find?.[0] === "true" ? "view" : null,
            find?.[1] === "true" ? "create" : null,
            find?.[2] === "true" ? "edit" : null,
            find?.[3] === "true" ? "delete" : null,
          ],
        });
      }
    });

    return {
      check: check,
      label: val.label,
      data: data,
    };
  });

  await Permission.update({ name: name, data: post, view: view });

  res.json({
    status: 200,
    massage: "Update data successful",
    data: { name: name, uuid: uuid, view: view },
  });
};

const get = async (req, res) => {
  const { users_id, users_uuid, email, username } = req.user;
  const userPermission = req.user.permission;

  let Permission;
  if (userPermission.view === "all") {
    Permission = await permission.findAll();
  } else {
    Permission = await permission.findAll({
      where: {
        user_id: users_id,
      },
    });
  }

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
      view: val.view,
    };
  });

  res.json({
    status: 200,
    massage: "Get data successful",
    data: data,
  });
};

const del = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const { uuid } = req.params;

  const Permission = await permission.findOne({
    where: { uuid: uuid },
    attributes: ["id", "uuid", "name"],
  });

  if (!Permission) {
    return res.json({
      message: "Permission not found",
    });
  }

  await Permission.destroy();

  res.json({
    massage: "Delete successful",
    data: Permission,
  });
};

const post = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const { name, perm, view } = req.body;

  const dtPermission = await permission.findOne({ where: { name: name } });
  if (dtPermission) {
    return res.status(400).json({
      massage: "Name already exists",
    });
  }

  const data = {
    uuid: Crypto.randomUUID(),
    user_id: users_id,
    data: perm,
    name: name,
    view: view,
  };

  await permission.create(data);

  return res.json({
    status: 200,
    massage: "Create successful",
    data: data,
  });
};

const put = async (req, res) => {};
const getId = async (req, res) => {};

module.exports = {
  get,
  put,
  post,
  del,
  getId,
  putId,
};
