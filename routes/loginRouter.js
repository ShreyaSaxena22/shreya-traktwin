const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const {
  getLoginPage,
  postLoginPage,
  getlogoutpage,
} = require("../controllers/loginController");
const router = express.Router();

router.get("/", getLoginPage);
router.post("/signin", postLoginPage);
router.get("/logout", getlogoutpage);
module.exports = router;
