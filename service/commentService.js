const statusModel = require("../models/statusModel");
const commentModel = require("../models/commentModel");

async function getComments(req, res) {
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

async function addComment(req, res) {
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

async function updateComment(req, res) {
  try {
    let id = req.params.id;
    let uid = req.id;
    let selectedComment = await commentModel.findById(id);

    if (selectedComment && selectedComment.userId === uid) {
      for (let key in req.body) {
        selectedComment[key] = req.body[key];
      }
      selectedComment.commentTime = Date.now();
      selectedComment.isEdited = true;
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
    let id = req.params.id; //commentId
    let uid = req.id; //userId

    // check if the comment is made by the user
    let selectedComment = await commentModel.findById(id);
    if (selectedComment && selectedComment.userId === uid) {
      let deletedComment = await commentModel.findByIdAndDelete(id);

      //update comment counts of the status
      let status = await statusModel.findById(deletedComment.statusId);
      status.totalComments = status.totalComments - 1;

      await status.save();
      res.status(200).json({
        message: "comment deleted",
        data: deletedComment,
      });
    } else {
      res.status(501).json({
        message: "Pass correct comment id",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to delete the comment",
      error,
    });
  }
}

module.exports.addComment = addComment;
module.exports.getComments = getComments;
module.exports.updateComment = updateComment;
module.exports.removeComment = removeComment;
