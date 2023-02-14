const express = require("express");
const likeRouter = express.Router();

const {
  addLike,
  removeLike,
  statusLikedByUserId,
  getLikesByStatusId,
} = require("../service/likeService");

const { protectRoute } = require("../service/authService");

likeRouter.use(protectRoute);

likeRouter
  .route("")
  .get(getLikesByStatusId) 

likeRouter
  .route("/:id")
  .get(statusLikedByUserId) //userId
  .post(addLike) //statusId
  .delete(removeLike); //statusId

module.exports = likeRouter;
