const express = require("express");
const router = express.Router();

const route = require("../../controller/stock");

router.get("/", route.get);
router.post("/", route.post);
router.put("/", route.put);
router.post("/export", route.exprt);

router.delete("/:uuid", route.del);
router.get("/:uuid", route.getId);
router.put("/:uuid", route.putId);

module.exports = router;
