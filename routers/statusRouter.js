const express = require("express");
const statusRouter = express.Router();

const {
  createStatus,
  getAllStatus,
  deleteStatusById,
  updateStatusById,
  getStatusByUserId
} = require("../service/statusService");

const { protectRoute } = require("../service/authService");


statusRouter.use(protectRoute)
statusRouter
  .route("")
  .get(getAllStatus)
  .post(createStatus)

statusRouter
  .route("/:id")
  .get(getStatusByUserId) //userId
  .put(updateStatusById) //statusId
  .delete(deleteStatusById); //statusId

module.exports = statusRouter;
