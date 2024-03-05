const express = require("express");
const {
  postIngredient,
  getIngredientList,
  getIngredientDetail,
  updateIngredient,
  deleteIngredient,
  getSingleIngredrient,
} = require("../controller/ingredient");
const router = express.Router();

// router.get("/", helloController);
router.post("/post", postIngredient);
router.get("/list", getIngredientList);
router.get("/detail/:categoryId", getIngredientDetail);

router.put("/update/:categoryId", updateIngredient);
router.delete("/delete/:categoryId", deleteIngredient);
//to get single category value in param
router.param("categoryId", getSingleIngredrient);

module.exports = router;
