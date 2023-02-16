const express = require("express");
const userRouter = express.Router();

const {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  // getUserStatus,
} = require("../service/userService");

const {
  getFollowersByUserId,
  getFollowingByUserId,
} = require("../service/followService");

const { statusLikedByUserId } = require("../service/likeService");

const { logout, protectRoute } = require("../service/authService");
const { getStatusByFollowing } = require("../service/statusService");

userRouter.use(protectRoute);

userRouter.route("").get(getAllUsers);

userRouter.route("/:id/followers").get(getFollowersByUserId);
userRouter.route("/:id/followings").get(getFollowingByUserId);
userRouter.route("/:id/like").get(statusLikedByUserId);

userRouter
  .route("/userProfile")
  .get(getUserProfile)
  .put(updateUserProfile)
  .delete(deleteUserProfile);

userRouter.route("/userProfile/statusByFollowing").get(getStatusByFollowing);

// userRouter.route("/userProfile/status").get(getUserStatus);

userRouter.route("/logout").get(logout);

module.exports = userRouter;
