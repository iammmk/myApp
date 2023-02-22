const express = require("express");
const userRouter = express.Router();

const {
  getAllUsers,
  getUserByUserId,
  getUserProfile,
  updateUserProfile,
  // deleteUserProfile,
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

userRouter.route("/userProfile/:id").get(getUserByUserId);

userRouter.route("/:id/followers").get(getFollowersByUserId);
userRouter.route("/:id/followings").get(getFollowingByUserId);
userRouter.route("/:id/like").get(statusLikedByUserId);

userRouter.route("/myProfile").get(getUserProfile).put(updateUserProfile);
// .delete(deleteUserProfile);

userRouter.route("/userProfile/status/Following").get(getStatusByFollowing);

userRouter.route("/logout").get(logout);

module.exports = userRouter;
