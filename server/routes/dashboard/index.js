const express = require("express");
const router = express.Router();

const dasController = require("../../controller/dahboard");

router.get("/", dasController.get);

module.exports = router;
