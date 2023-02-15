const express = require("express");
const followRouter = express.Router();

const { followUserByUserId, unfollowUserByUserId } = require("../service/followService");

const { protectRoute } = require("../service/authService");

followRouter.use(protectRoute);

followRouter
  .route("/:id")
  .post(followUserByUserId)
  .delete(unfollowUserByUserId);

module.exports = followRouter;
