const express = require("express");
const statusRouter = express.Router();

const {
  createStatus,
  getAllStatus,
  deleteStatusById,
  // updateStatusById,
  getStatusByStatusId,
  updateContentById,
} = require("../service/statusService");

const {
  getCommentByStatusId,
  addCommentByStatusId,
} = require("../service/commentService");

const { protectRoute } = require("../service/authService");

statusRouter.use(protectRoute);
statusRouter.route("").get(getAllStatus).post(createStatus);

statusRouter
  .route("/:id")
  .get(getStatusByStatusId) //statusId
  // .put(updateStatusById) //statusId
  .put(updateContentById) // statusId or commentId
  .delete(deleteStatusById); //statusId

statusRouter
  .route("/:id/comment")
  .get(getCommentByStatusId) //statusId
  .post(addCommentByStatusId); //statusId

module.exports = statusRouter;
