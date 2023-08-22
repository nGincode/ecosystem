const express = require("express");
const router = express.Router();

const npwpController = require("../../controller/npwp");

router.get("/", npwpController.get);
router.post("/", npwpController.post);
router.put("/", npwpController.put);

router.delete("/:uuid", npwpController.del);
router.get("/:uuid", npwpController.getId);
router.put("/:uuid", npwpController.putId);

module.exports = router;
