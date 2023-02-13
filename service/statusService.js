const statusModel = require("../models/statusModel");

// CRUD
async function createStatus(req, res) {
  try {
    let { status } = req.body;
    const newStatus = {
      userId: req.id,
      status: status,
    };
    let addedStatus = await statusModel.create(newStatus);
    res.status(200).json({
      message: "Added new status !!",
      data: addedStatus,
    });
  } catch (error) {
    res.status(501).json({
      message: "Failed to create status",
      error,
    });
  }
}

async function getAllStatus(req, res) {
  try {
    let status = await statusModel.find({});
    res.status(200).json({
      message: "Got all status !!",
      data: status,
    });
  } catch (error) {
    res.status(501).json({
      message: "Failed to get status",
      error,
    });
  }
}

// shorten the code
async function updateStatusById(req, res) {
  try {
    let statusId = req.params.id;
    // check if the user has that status with given id
    let status = await statusModel.findById(statusId);
    if (status && status.userId === req.id) {
      let sentStatus = req.body;
      for (let key in sentStatus) {
        status[key] = sentStatus[key];
      }
      status.isEdited = true;
      let updatedStatus = await status.save();
      res.status(200).json({
        message: "Task updated successfully..",
        data: updatedStatus,
      });
    } else {
      res.status(501).json({
        message: "Failed to update the task..",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to update the task..",
      error,
    });
  }
}

// shorten the code
async function deleteStatusById(req, res) {
  try {
    let statusId = req.params.id;
    // check if the user has that status with given id
    let status = await statusModel.findById(statusId);
    if (status && status.userId === req.id) {
      let deletedStatus = await status.deleteOne();
      res.status(200).json({
        message: "status deleted successfully",
        data: deletedStatus,
      });
    } else {
      res.status(501).json({
        message: "Failed to delete the status..",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to delete the status..",
      error,
    });
  }
}

module.exports.createStatus = createStatus;
module.exports.getAllStatus = getAllStatus;
module.exports.deleteStatusById = deleteStatusById;
module.exports.updateStatusById = updateStatusById;
