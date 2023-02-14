const express = require("express");
const commentRouter = express.Router();

const { addComment, removeComment, getComments, updateComment } = require("../service/commentService");

const { protectRoute } = require("../service/authService");

commentRouter.use(protectRoute);

commentRouter
  .route("/:id")
  .post(addComment) //statusId
  .get(getComments) //statusId
  .put(updateComment) //commentId
  .delete(removeComment); //commentId

module.exports = commentRouter;
