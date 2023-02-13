const express = require("express");
const statusRouter = express.Router();

const {
  createStatus,
  getAllStatus,
  deleteStatusById,
  updateStatusById,
} = require("../service/statusService");

const { protectRoute } = require("../service/authService");


statusRouter.use(protectRoute)
statusRouter
  .route("")
  .get(getAllStatus)
  .post(createStatus)

statusRouter
  .route("/:id")
  .put(updateStatusById)
  .delete(deleteStatusById);

module.exports = statusRouter;
