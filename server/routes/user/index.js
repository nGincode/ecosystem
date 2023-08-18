const express = require("express");
const router = express.Router();

const userController = require("../../controller/user");

router.get("/", userController.get);
router.post("/", userController.post);
router.put("/", userController.put);
router.delete("/:uuid", userController.del);

router.get("/:uuid", userController.getId);
router.put("/:uuid", userController.putId);

module.exports = router;
