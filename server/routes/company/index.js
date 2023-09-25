const express = require("express");
const router = express.Router();

const companyController = require("../../controller/company");

router.get("/", companyController.get);
router.post("/", companyController.post);
router.put("/", companyController.put);

router.delete("/:uuid", companyController.del);
router.get("/:uuid", companyController.getId);
router.put("/:uuid", companyController.putId);

module.exports = router;
