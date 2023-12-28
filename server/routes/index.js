const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifToken = require("../middleware/jwt");

const user = require("./user");
const efaktur = require("./efaktur");
const stock = require("./stock");
const npwp = require("./npwp");
const company = require("./company");
const auth = require("./auth");
const permission = require("./permission");

router.get("/", async (req, res) => {
  // res.send("API Starting!");
  const { user } = require("../models");
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
  });
  res.send(User ? "API Starting!" : "Database not Connect");
});

router.get("/token", (req, res) => {
  const data = { id: 1 };
  res.send(jwt.sign({ data }, "fembinurilham"));
});

router.use("/user", verifToken, user);
router.use("/efaktur", verifToken, efaktur);
router.use("/permission", verifToken, permission);
router.use("/npwp", verifToken, npwp);
router.use("/company", verifToken, company);
router.use("/stock", verifToken, stock);
router.use("/", auth);

module.exports = router;
