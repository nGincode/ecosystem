const express = require("express");
const router = express.Router();

const efakturController = require("../../controller/efaktur");

router.get("/", efakturController.get);
router.post("/", efakturController.post);
router.put("/", efakturController.put);

router.delete("/:uuid", efakturController.del);
router.get("/:uuid", efakturController.getId);
router.put("/:uuid", efakturController.putId);

router.post("/proof", efakturController.proof);

module.exports = router;
