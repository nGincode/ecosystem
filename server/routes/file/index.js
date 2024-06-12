const express = require("express");
const router = express.Router();
const files = require("../../controller/files");

router.get("/:dir", files.get);
router.post("/", files.post);

module.exports = router;
