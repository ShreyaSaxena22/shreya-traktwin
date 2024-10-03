const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const router = express.Router();
const { getDashboardPage } = require("../controllers/DashboardControl");

router.get("/", getDashboardPage);

module.exports = router;
