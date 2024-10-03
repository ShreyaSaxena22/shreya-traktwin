const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const {
  getMainCategorylist,
  getMainCategoryCreate,
  postMainCategory,
  postmaincatpublish,
  postmaincatunpublish,
  getdeleteCategory,
  getCategoryDetails,
  postcategoryupdatedetails,
} = require("../controllers/MainCategoryConrtol");
const router = express.Router();

router.get("/", getMainCategorylist);
router.get("/createmaincategory", getMainCategoryCreate);
router.post("/addmaincategory", postMainCategory);
router.post("/maincatpublished", postmaincatpublish);
router.post("/maincatunpublished", postmaincatunpublish);
router.get("/deleteCategory", getdeleteCategory);
router.get("/viewCategoryDetails", getCategoryDetails)
router.post("/updatedetails", postcategoryupdatedetails)
module.exports = router;
