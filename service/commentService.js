const statusModel = require("../models/statusModel");
const commentModel = require("../models/commentModel");
const likeModel = require("../models/likeModel");
const userModel = require("../models/userModel");
const notificationModel = require("../models/notificationModel");

//get comments of a status
async function getCommentByStatusId(req, res) {
  try {
    let id = req.params.id; //statusId

    let status = await statusModel.findById(id);
    if (status) {
      let comments = await commentModel.find({ statusId: id });

      res.status(200).json({
        message: "Fetched comments",
        data: comments,
      });
    } else {
      res.status(501).json({
        message: "Pass coreect status id",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to fetch comments ",
      error,
    });
  }
}

//get a particular comment by commentId of the comment
async function getCommentByCommentId(req, res) {
  try {
    let id = req.params.id;
    let comment = await commentModel.findById(id);
    if (comment) {
      res.status(200).json({
        message: "Got the comment",
        data: comment,
      });
    } else {
      res.status(501).json({
        message: "Pass correct comment Id",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to fetch the comment",
      error,
    });
  }
}

//get child comments of a comment
async function getChildCommentsByCommentId(req, res) {
  try {
    let id = req.params.id; //commentId
    let comment = await commentModel.findById(id);
    if (comment) {
      let comments = await commentModel.find({ statusId: id });

      res.status(200).json({
        message: "Fetched comments",
        data: comments,
      });
    } else {
      res.status(501).json({
        message: "Pass correct comment id",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to fetch comments of the comment",
      error,
    });
  }
}

//add comment to a status/comment
async function addCommentByStatusId(req, res) {
  try {
    let id = req.params.id; // parent status/comment id
    let uid = req.id;

    let user = await userModel.findById(uid);
    let parent =
      (await statusModel.findById(id)) || (await commentModel.findById(id));

    if (parent) {
      let mainStatusByUserId = parent.mainStatusByUserId || parent.userId; // main status is uploaded by
      const newComment = {
        statusId: id,
        userId: uid,
        uploadedBy: user.username,
        userImage: user.pImage,
        comment: req.body.comment,
        mainStatusByUserId: mainStatusByUserId,
      };
      let addedComment = await commentModel.create(newComment);

      parent.childCommentIds.push(addedComment._id);
      parent.totalComments = parent.totalComments + 1;
      await parent.save();

      //push new notification
      if (parent.userId !== uid) {
        let notification = {
          toId: parent.userId,
          fromId: uid,
          fromUsername: user.username,
          fromImage: user.pImage,
          activity: "add comment",
          contentId: addedComment._id,
        };
        let addedNotification = await notificationModel.create(notification);
        // update notification count
        let receiver = await userModel.findById(parent.userId);
        receiver.newNotificationCount = receiver.newNotificationCount + 1;
        await receiver.save();
      }

      res.status(200).json({
        message: "Added new comment",
        data: addedComment,
      });
    } else {
      res.status(501).json({
        message: "Pass correct id !!",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to comment on the status",
      error,
    });
  }
}

//add comment to a comment
// async function addCommentByCommentId(req, res) {
//   try {
//     let id = req.params.id; // comment id where user wants to add comment
//     let uid = req.id;

//     let comment = await commentModel.findById(id);
//     if (comment) {
//       const newComment = {
//         statusId: id,
//         userId: uid,
//         comment: req.body.comment,
//         mainStatusByUserId: comment.mainStatusByUserId,
//       };
//       let addedComment = await commentModel.create(newComment);

//       comment.childCommentIds.push(addedComment._id);
//       comment.totalComments = comment.totalComments + 1;
//       await comment.save();

//       res.status(200).json({
//         message: "Added a new comment to the comment !!",
//         data: addedComment,
//       });
//     } else {
//       res.status(501).json({
//         message: "Pass correct comment id !!",
//       });
//     }
//   } catch (error) {
//     res.status(501).json({
//       message: "Failed to comment on the comment",
//       error,
//     });
//   }
// }

// moved to updateContentByContentId
// async function updateComment(req, res) {
//   try {
//     let id = req.params.id;
//     let uid = req.id;
//     let selectedComment = await commentModel.findById(id);

//     if (selectedComment && selectedComment.userId === uid) {
//       let lastComment = selectedComment.comment;
//       for (let key in req.body) {
//         selectedComment[key] = req.body[key];
//       }
//       selectedComment.commentTime = Date.now();
//       selectedComment.isEdited = true;
//       selectedComment.lastEdit = lastComment;
//       let updatedComment = await selectedComment.save();
//       res.status(200).json({
//         message: "Comment updated !!",
//         data: updatedComment,
//       });
//     } else {
//       res.status(501).json({
//         message: "Pass correct comment id",
//       });
//     }
//   } catch (error) {
//     res.status(501).json({
//       message: "Failed to update the comment",
//       error,
//     });
//   }
// }

async function removeComment(req, res) {
  try {
    let commentId = req.params.id; //commentId
    let uid = req.id; //userId

    // check if comment id is correct and the comment is made by the user
    let comment = await commentModel.findById(commentId);
    if (comment?.userId === uid || comment?.mainStatusByUserId === uid) {
      await deleteComment(commentId);

      res.status(200).json({
        message: "Deleted",
        data: comment,
      });
    } else {
      res.status(501).json({
        message: "Failed to delete the comment",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to delete the comment",
      error,
    });
  }
}

// recursion method
const deleteComment = async (commentId) => {
  // Find the comment with the given ID
  const comment = await commentModel.findById(commentId);

  // Delete all child comments
  for (const childId of comment.childCommentIds) {
    await deleteComment(childId);
  }

  // Decrement the total comments count of the parent status/comment
  const parentComment =
    (await statusModel.findById(comment.statusId)) ||
    (await commentModel.findById(comment.statusId));
  parentComment.totalComments -= 1;

  //drop commentId from parant's childCommentIds array
  parentComment.childCommentIds = parentComment.childCommentIds.filter(
    (element) => element !== commentId
  );
  await parentComment.save();

  // Delete the comment
  await commentModel.findByIdAndDelete(commentId);
  await likeModel.deleteMany({ statusId: commentId });
};

module.exports.addCommentByStatusId = addCommentByStatusId;
// module.exports.addCommentByCommentId = addCommentByCommentId;
module.exports.getCommentByStatusId = getCommentByStatusId;
module.exports.getCommentByCommentId = getCommentByCommentId;
module.exports.getChildCommentsByCommentId = getChildCommentsByCommentId;
// module.exports.updateComment = updateComment;
module.exports.removeComment = removeComment;
