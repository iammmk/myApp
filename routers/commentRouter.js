const express = require("express");
const commentRouter = express.Router();

const { getCommentByCommentId, removeComment, addCommentByCommentId, updateComment } = require("../service/commentService");

const { protectRoute } = require("../service/authService");

commentRouter.use(protectRoute);

commentRouter
  .route("/:id")
  .post(addCommentByCommentId) //commentId
  .get(getCommentByCommentId) //commentId
  .put(updateComment) //commentId
  .delete(removeComment); //commentId

module.exports = commentRouter;
