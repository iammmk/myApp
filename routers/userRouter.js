const express = require("express");
const userRouter = express.Router();

const {
  // getAllUsers,
  getUserByUserId,
  getUserProfile,
  updateUserProfile,
  // deleteUserProfile,
} = require("../service/userService");

const {
  getFollowersByUserId,
  getFollowingByUserId,
  getFollowSuggestion,
} = require("../service/followService");

const { statusLikedByUserId } = require("../service/likeService");

const { logout, protectRoute } = require("../service/authService");
const { getStatusByUserId } = require("../service/statusService");
const {
  getNotifications,
  editNotificationCount,
  clearNotifications
} = require("../service/notificationService");

userRouter.use(protectRoute);

userRouter.route("").get(getFollowSuggestion);

userRouter.route("/userProfile/:id").get(getUserByUserId);

userRouter.route("/:id/followers").get(getFollowersByUserId);
userRouter.route("/:id/followings").get(getFollowingByUserId);
userRouter.route("/:id/like").get(statusLikedByUserId);
userRouter.route("/:id/status").get(getStatusByUserId);
userRouter
  .route("/notification")
  .get(getNotifications)
  .put(editNotificationCount)
  .delete(clearNotifications)

userRouter.route("/myProfile").get(getUserProfile).put(updateUserProfile);
// .delete(deleteUserProfile);

// userRouter.route("/userProfile/status/Following").get(getStatusByFollowing);

userRouter.route("/logout").get(logout);

module.exports = userRouter;
