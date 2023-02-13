const express = require("express");
const userRouter = express.Router();

const {
  // createUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getUserStatus,
} = require("../service/userService");

const { logout, protectRoute } = require("../service/authService");

userRouter.use(protectRoute);

userRouter.route("").get(getAllUsers);

userRouter
  .route("/userProfile")
  .get(getUserProfile)
  .put(updateUserProfile)
  .delete(deleteUserProfile);

userRouter.route("/status").get(getUserStatus);

userRouter.route("/logout").get(logout);

module.exports = userRouter;
