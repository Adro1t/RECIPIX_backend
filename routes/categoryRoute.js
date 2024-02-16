const express = require("express");
const {
  helloController,
  postCategory,
  getCategoryList,
  getSingleCategory,
  getCategoryDetail,
  updateCategory,
  deleteCategory,
} = require("../controller/category");
const { categoryValidation } = require("../validation");
const router = express.Router();

// router.get("/", helloController);
router.post("/post", categoryValidation, postCategory);
router.get("/list", getCategoryList);
router.get("/detail/:categoryId", getCategoryDetail);

router.put("/update/:categoryId", updateCategory);
router.delete("/delete/:categoryId", deleteCategory);
//to get single category value in param
router.param("categoryId", getSingleCategory);

module.exports = router;
