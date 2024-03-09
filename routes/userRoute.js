const express = require("express");
const {
  postUser,
  signIn,
  signOut,
  userList,
  userById,
  userDetails,
  requireSignin,
  postConfirmation,
  resendVerificationEmail,
  forgetPassword,
  resetPassword,
  updatePreferences,
  updateLikedRecipes,
  deleteLikedRecipes,
} = require("../controller/user");
const { userValidation } = require("../validation");

const router = express.Router();

router.post("/post", userValidation, postUser);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.get("/list", userList);
router.get("/detail/:userId", requireSignin, userDetails);

router.post("/confirmation/:token", postConfirmation);
router.post("/resend/confirmation", resendVerificationEmail);
router.post("/password/forget", forgetPassword);
router.put("/password/reset/:token", resetPassword);

router.put("/update/preferences", updatePreferences);
router.put("/update/likedrecipes", updateLikedRecipes);
router.delete("/delete/likedrecipes", deleteLikedRecipes);

router.param("userId", userById);
module.exports = router;
