const express = require("express");
const userRouter = express.Router();

const {
  // createUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  // getUserStatus,
} = require("../service/userService");

const {
  getFollowersByUserId,
  getFollowingsByUserId,
} = require("../service/followService");

const { logout, protectRoute } = require("../service/authService");

userRouter.use(protectRoute);

userRouter.route("").get(getAllUsers);

userRouter.route("/:id/followers").get(getFollowersByUserId);
userRouter.route("/:id/followings").get(getFollowingsByUserId);

userRouter
  .route("/userProfile")
  .get(getUserProfile)
  .put(updateUserProfile)
  .delete(deleteUserProfile);

// userRouter.route("/userProfile/status").get(getUserStatus);

userRouter.route("/logout").get(logout);

module.exports = userRouter;
