const commentModel = require("../models/commentModel");
const followModel = require("../models/followModel");
const likeModel = require("../models/likeModel");
const statusModel = require("../models/statusModel");
const userModel = require("../models/userModel");

// CRUD
async function createStatus(req, res) {
  try {
    let { status } = req.body;
    let uid = req.id;
    let user = await userModel.findById(uid);
    const newStatus = {
      userId: uid,
      uploadedBy: user.username,
      userImage: user.pImage,
      status: status,
    };
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

// async function getAllStatus(req, res) {
//   try {
//     let status = await statusModel.find({});
//     res.status(200).json({
//       message: "Got all status !!",
//       data: status,
//     });
//   } catch (error) {
//     res.status(501).json({
//       message: "Failed to get status",
//       error,
//     });
//   }
// }

// API for front page status (status by following + own status)
async function getAllStatus(req, res) {
  try {
    let uid = req.id;
    let followingList = await followModel.find({ fromId: uid });
    let status = [];
    // status by following
    for (let following of followingList) {
      let user = following.toId;
      let userStatus = await statusModel.find({ userId: user });
      for (let item of userStatus) {
        status.push(item);
      }
    }
    // own status
    let ownStatus = await statusModel.find({ userId: uid });
    for (let item of ownStatus) {
      status.push(item);
    }
    res.status(200).json({
      message: "Fetched all status",
      data: status,
    });
  } catch (error) {
    res.status(501).json({
      message: "Failed to fetch status",
      error,
    });
  }
}

// shorten the code
// update status/comment by their Id
async function updateContentById(req, res) {
  try {
    let contentId = req.params.id;
    let uid = req.id;
    // check if the user has that status/comment with given id
    let content =
      (await statusModel.findById(contentId)) ||
      (await commentModel.findById(contentId));

    if (content && content.userId === uid) {
      let lastContent = content.status || content.comment;
      let sentContent = req.body;
      for (let key in sentContent) {
        content[key] = sentContent[key];
      }
      content.isEdited = true;
      content.lastEdit = lastContent;
      content.uploadTime = Date.now();
      let updatedContent = await content.save();
      res.status(200).json({
        message: "Content updated successfully",
        data: updatedContent,
      });
    } else {
      res.status(501).json({
        message: "Failed to update the content",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to update the content",
      error,
    });
  }
}

async function deleteStatusById(req, res) {
  try {
    let statusId = req.params.id;
    let uid = req.id;
    let status = await statusModel.findById(statusId);

    if (status && status.userId === uid) {
      await deleteStatus(statusId);
      let user = await userModel.findById(uid);
      user.totalStatus = user.totalStatus - 1;
      await user.save();

      res.status(200).json({
        message: "Deleted",
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

//get status by statusId
async function getStatusByStatusId(req, res) {
  try {
    let statusId = req.params.id;
    let status = await statusModel.findById(statusId);
    if (status) {
      res.status(200).json({
        message: "Status Fetched",
        data: status,
      });
    } else {
      res.status(501).json({
        message: "status id incorrect",
        data: status,
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to fetch the status",
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
// async function getStatusByFollowing(req, res) {
//   try {
//     let uid = req.id;
//     let followingList = await followModel.find({ fromId: uid });
//     let status = [];

//     for (let following of followingList) {
//       let user = following.toId;
//       let userStatus = await statusModel.find({ userId: user });

//       for (let item of userStatus) {
//         status.push(item);
//       }
//     }
//     res.status(200).json({
//       message: "Fetched status from your following",
//       data: status,
//     });
//   } catch (error) {
//     res.status(501).json({
//       message: "Failed to fetch status of your following list",
//       error,
//     });
//   }
// }

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
  await likeModel.deleteMany({ statusId: commentId });
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
  await likeModel.deleteMany({ statusId: statusId });
};

// async function getName(uname) {
//   try {
//     let user = await userModel.find({ username: uname });
//     if (user.length) {
//       return user[0].name;
//     } else {
//       res.status(501).json({
//         message: "user doesnt exist",
//       });
//     }
//   } catch (error) {
//     res.status(501).json({
//       message: "Failed to find user",
//       error,
//     });
//   }
// }

module.exports.createStatus = createStatus;
module.exports.getAllStatus = getAllStatus;
module.exports.deleteStatusById = deleteStatusById;
module.exports.updateContentById = updateContentById;
module.exports.getStatusByUserId = getStatusByUserId;
module.exports.getStatusByStatusId = getStatusByStatusId;
