const statusModel = require("../models/statusModel");
const likeModel = require("../models/likeModel");
const userModel = require("../models/userModel");

async function addLike(req, res) {
  try {
    let id = req.params.id;
    let uid = req.id;

    //check if the status is already liked by the user
    let selectedStatus = await likeModel.find({
      $and: [{ userId: uid }, { statusId: id }],
    });

    if (!selectedStatus.length) {
      const newLike = {
        statusId: id,
        userId: uid,
      };
      let addedLike = await likeModel.create(newLike);

      let status = await statusModel.findById(id);
      status.totalLikes = status.totalLikes + 1;

      await status.save();
      res.status(200).json({
        message: "Added new like !!",
        data: addedLike,
      });
    } else {
      res.status(501).json({
        message: "Status already liked by user !!",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to like the status",
      error,
    });
  }
}

// fetch list of users liked the status
async function getLikesByStatusId(req, res) {
  try {
    let id = req.body.statusId;
    //check if statusId provided exists
    let status = await statusModel.findById(id);
    if (status) {
      let userList = await likeModel.find({ statusId: id });
      res.status(200).json({
        message: "Fetched list of users who liked the status",
        data: userList,
      });
    } else {
      res.status(501).json({
        message: "Pass correct status id",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to fetch users who liked the status",
      error,
    });
  }
}

async function removeLike(req, res) {
  try {
    let id = req.params.id;
    let uid = req.id;

    let selectedStatus = await likeModel.find({
      $and: [{ userId: uid }, { statusId: id }],
    });

    //check if the status is already liked
    if (selectedStatus.length) {
      let removeLikeFromStatus = selectedStatus[0];
      let removeLikeFromStatusId = removeLikeFromStatus._id.toString();
      let unlikedStatus = await likeModel.findByIdAndDelete(
        removeLikeFromStatusId
      );

      let status = await statusModel.findById(id);
      status.totalLikes = status.totalLikes - 1;
      await status.save();

      res.status(200).json({
        message: "Unliked the status",
        data: unlikedStatus,
      });
    } else {
      res.status(501).json({
        message: "You can't unlike this status",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to unlike the status",
      error,
    });
  }
}

// fetch status liked by a user
async function statusLikedByUserId(req, res) {
  try {
    let uid = req.params.id;
    //check if the userId provided exists
    let user = await userModel.findById(uid);
    if (user) {
      let likedStatus = await likeModel.find({ userId: uid });
      res.status(200).json({
        mesaage: "Liked status fetched successfully",
        data: likedStatus,
      });
    } else {
      res.status(501).json({
        message: "Pass correct userId",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to load liked status",
      error,
    });
  }
}

module.exports.addLike = addLike;
module.exports.getLikesByStatusId = getLikesByStatusId;
module.exports.removeLike = removeLike;
module.exports.statusLikedByUserId = statusLikedByUserId;
