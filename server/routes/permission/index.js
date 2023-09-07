const express = require("express");
const router = express.Router();

const permissionController = require("../../controller/permission");

router.get("/", permissionController.get);
router.post("/", permissionController.post);
router.put("/", permissionController.put);

router.delete("/:uuid", permissionController.del);
router.get("/:uuid", permissionController.getId);
router.put("/:uuid", permissionController.putId);

module.exports = router;
