const statusModel = require("../models/statusModel");
const commentModel = require("../models/commentModel");

//get comments of a status
async function getCommentByStatusId(req, res) {
  try {
    let id = req.params.id; //statusId

    let comments = await commentModel.find({ statusId: id });
    if (comments) {
      res.status(200).json({
        message: "Fetched comments of the status",
        data: comments,
      });
    } else {
      res.status(501).json({
        message: "Pass coreect status id",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to fetch comments of the status",
      error,
    });
  }
}

//get comments of a comment
async function getCommentByCommentId(req, res) {
  try {
    let id = req.params.id; //commentId

    let comments = await commentModel.find({ statusId: id });
    if (comments) {
      res.status(200).json({
        message: "Fetched comments of the comment",
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

//add comment to a status
async function addCommentByStatusId(req, res) {
  try {
    let id = req.params.id;
    let uid = req.id;

    let status = await statusModel.findById(id);
    if (status) {
      const newComment = {
        statusId: id,
        userId: uid,
        comment: req.body.comment,
      };
      let addedComment = await commentModel.create(newComment);

      status.childCommentIds.push(addedComment._id);
      status.totalComments = status.totalComments + 1;
      await status.save();

      res.status(200).json({
        message: "Added new comment to the status !!",
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
async function addCommentByCommentId(req, res) {
  try {
    let id = req.params.id; // comment id where user wants to add comment
    let uid = req.id;

    let comment = await commentModel.findById(id);
    if (comment) {
      const newComment = {
        statusId: id,
        userId: uid,
        comment: req.body.comment,
      };
      let addedComment = await commentModel.create(newComment);

      comment.childCommentIds.push(addedComment._id);
      comment.totalComments = comment.totalComments + 1;
      await comment.save();

      res.status(200).json({
        message: "Added a new comment to the comment !!",
        data: addedComment,
      });
    } else {
      res.status(501).json({
        message: "Pass correct comment id !!",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to comment on the comment",
      error,
    });
  }
}

async function updateComment(req, res) {
  try {
    let id = req.params.id;
    let uid = req.id;
    let selectedComment = await commentModel.findById(id);

    if (selectedComment && selectedComment.userId === uid) {
      let lastComment = selectedComment.comment;
      for (let key in req.body) {
        selectedComment[key] = req.body[key];
      }
      selectedComment.commentTime = Date.now();
      selectedComment.isEdited = true;
      selectedComment.lastEdit = lastComment;
      let updatedComment = await selectedComment.save();
      res.status(200).json({
        message: "Comment updated !!",
        data: updatedComment,
      });
    } else {
      res.status(501).json({
        message: "Pass correct comment id",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to update the comment",
      error,
    });
  }
}

async function removeComment(req, res) {
  try {
    let commentId = req.params.id; //commentId
    let uid = req.id; //userId

    // check if comment id is correct and the comment is made by the user
    let comment = await commentModel.findById(commentId);
    if (comment && comment.userId === uid) {
      await deleteComment(commentId);

      res.status(200).json({
        message: "comment deleted",
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
  await parentComment.save();

  // Delete the comment
  await commentModel.findByIdAndDelete(commentId);
};

module.exports.addCommentByStatusId = addCommentByStatusId;
module.exports.addCommentByCommentId = addCommentByCommentId;
module.exports.getCommentByStatusId = getCommentByStatusId;
module.exports.getCommentByCommentId = getCommentByCommentId;
module.exports.updateComment = updateComment;
module.exports.removeComment = removeComment;
