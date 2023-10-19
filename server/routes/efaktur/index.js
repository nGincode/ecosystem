const express = require("express");
const router = express.Router();

const efakturControllerOut = require("../../controller/efaktur/out");
const efakturControllerIn = require("../../controller/efaktur/in");

router.get("/out", efakturControllerOut.get);
router.post("/out", efakturControllerOut.post);
router.put("/out", efakturControllerOut.put);

router.delete("/out/:uuid", efakturControllerOut.del);
router.get("/out/:uuid", efakturControllerOut.getId);
router.put("/out/:uuid", efakturControllerOut.putId);

router.post("/out/proof", efakturControllerOut.proof);
router.post("/out/export", efakturControllerOut.exprt);

router.get("/in", efakturControllerIn.get);
router.post("/in", efakturControllerIn.post);
router.put("/in", efakturControllerIn.put);

router.delete("/in/:uuid", efakturControllerIn.del);
router.get("/in/:uuid", efakturControllerIn.getId);
router.put("/in/:uuid", efakturControllerIn.putId);

router.post("/in/proof", efakturControllerIn.proof);
router.post("/in/export", efakturControllerIn.exprt);

module.exports = router;
