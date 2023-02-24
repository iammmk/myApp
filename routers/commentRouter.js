const express = require("express");
const commentRouter = express.Router();

const {
  getCommentByCommentId,
  getChildCommentsByCommentId,
  removeComment,
  // addCommentByCommentId,
  // updateComment,
} = require("../service/commentService");

const { protectRoute } = require("../service/authService");

commentRouter.use(protectRoute);

commentRouter
  .route("/:id")
  // .post(addCommentByCommentId) //commentId
  .get(getCommentByCommentId) //commentId
  // .put(updateComment) //commentId
  .delete(removeComment); //commentId

commentRouter.route("/:id/childComments").get(getChildCommentsByCommentId); //commentId

module.exports = commentRouter;
