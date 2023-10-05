const express = require("express");
const router = express.Router();

const efakturControllerOut = require("../../controller/efaktur/out");

router.get("/out", efakturControllerOut.get);
router.post("/out", efakturControllerOut.post);
router.put("/out", efakturControllerOut.put);

router.delete("/out/:uuid", efakturControllerOut.del);
router.get("/out/:uuid", efakturControllerOut.getId);
router.put("/out/:uuid", efakturControllerOut.putId);

router.post("/out/proof", efakturControllerOut.proof);
router.post("/out/export", efakturControllerOut.exprt);

module.exports = router;
