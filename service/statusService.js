const commentModel = require("../models/commentModel");
const followModel = require("../models/followModel");
const statusModel = require("../models/statusModel");
const userModel = require("../models/userModel");

// CRUD
async function createStatus(req, res) {
  try {
    let { status } = req.body;
    const newStatus = {
      userId: req.id,
      status: status,
    };
    let user = await userModel.findById(req.id);
    let addedStatus = await statusModel.create(newStatus);
    user.totalStatus = user.totalStatus + 1;
    await user.save();
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
      let lastStatus = status.status;
      let sentStatus = req.body;
      for (let key in sentStatus) {
        status[key] = sentStatus[key];
      }
      status.isEdited = true;
      status.lastEdit = lastStatus;
      status.uploadTime = Date.now();
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
// async function deleteStatusById(req, res) {
//   try {
//     let statusId = req.params.id;
//     // check if the user has that status with given id
//     let status = await statusModel.findById(statusId);
//     if (status && status.userId === req.id) {
//       let deletedStatus = await statusModel.findByIdAndDelete(statusId);

//       let deletedComments = await commentModel.find({ statusId: statusId });
//       for (let comment in deletedComments) {
//       }

//       // add tree structure

//       let user = await userModel.findById(req.id);
//       user.totalStatus = user.totalStatus - 1;
//       await user.save();

//       res.status(200).json({
//         message: "status deleted successfully",
//         data: deletedStatus,
//       });
//     } else {
//       res.status(501).json({
//         message: "Failed to delete the status..",
//       });
//     }
//   } catch (error) {
//     res.status(501).json({
//       message: "Failed to delete the status..",
//       error,
//     });
//   }
// }

async function deleteStatusById(req, res) {
  try {
    let statusId = req.params.id;
    let uid = req.body;
    let status = await statusModel.findById(statusId);

    if (status && status.userId === uid) {
      await deleteStatus(statusId);

      res.status(200).json({
        message: "status deleted successfully",
        data: status,
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

//get status by userId
async function getStatusByUserId(req, res) {
  try {
    let id = req.params.id;
    let user = await userModel.findById(id);
    if (user) {
      let status = await statusModel.find({ userId: id });
      res.status(200).json({
        message: "Fetched status of the user",
        data: status,
      });
    } else {
      res.status(501).json({
        message: "Enter correct user id",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to fetch the status..",
      error,
    });
  }
}

// get status of the users you follow
async function getStatusByFollowing(req, res) {
  try {
    let uid = req.id;
    let followingList = await followModel.find({ fromId: uid });
    let status = [];

    for (let following of followingList) {
      let user = following.toId;
      let userStatus = await statusModel.find({ userId: user });

      for (let item of userStatus) {
        status.push(item);
      }
    }
    res.status(200).json({
      message: "Fetched status from your following",
      data: status,
    });
  } catch (error) {
    res.status(501).json({
      message: "Failed to fetch status of your following list",
      error,
    });
  }
}

// recursion
const deleteComment = async (commentId) => {
  // Find the comment with the given ID
  const comment = await commentModel.findById(commentId);

  // If the comment doesn't exist, return
  if (!comment) {
    return;
  }

  // Delete all child comments
  for (const childId of comment.childCommentIds) {
    await deleteComment(childId);
  }

  // Delete the comment
  await commentModel.findByIdAndDelete(commentId);
};

const deleteStatus = async (statusId) => {
  // Find the status with the given ID
  const status = await statusModel.findById(statusId);

  // Delete all comments of the status
  for (const commentId of status.childCommentIds) {
    await deleteComment(commentId);
  }

  // Delete the status
  await statusModel.findByIdAndDelete(statusId);
};

module.exports.createStatus = createStatus;
module.exports.getAllStatus = getAllStatus;
module.exports.deleteStatusById = deleteStatusById;
module.exports.updateStatusById = updateStatusById;
module.exports.getStatusByUserId = getStatusByUserId;
module.exports.getStatusByFollowing = getStatusByFollowing;
