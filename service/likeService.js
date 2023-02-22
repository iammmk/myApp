const statusModel = require("../models/statusModel");
const likeModel = require("../models/likeModel");
const userModel = require("../models/userModel");
const commentModel = require("../models/commentModel");

async function addLike(req, res) {
  try {
    let id = req.params.id;
    let uid = req.id;

    //check if the status/comment exists
    let content =
      (await statusModel.findById(id)) || (await commentModel.findById(id));
    if (content) {
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

        let status =
          (await statusModel.findById(id)) || (await commentModel.findById(id));

        status.totalLikes = status.totalLikes + 1;
        status.likedBy.push(uid);
        await status.save();
        res.status(200).json({
          message: "Added new like !!",
          data: addedLike,
        });
      } else {
        res.status(501).json({
          message: "Status/comment already liked by user !!",
        });
      }
    } else {
      res.status(501).json({
        message: "enter correct status/comment id",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to like the status/comment",
      error,
    });
  }
}

// fetch list of users liked the status/comment
async function getLikesByStatusId(req, res) {
  try {
    let id = req.params.id;
    let users = [];
    //check if statusId provided exists
    let status =
      (await statusModel.findById(id)) || (await commentModel.findById(id));
    if (status) {
      let userList = await likeModel.find({ statusId: id });
      for (let item of userList) {
        let uid = item.userId;
        let user = await userModel.findById(uid);
        users.push(user);
      }
      res.status(200).json({
        message: "Fetched list of users who liked the status/comment",
        data: users,
      });
    } else {
      res.status(501).json({
        message: "Pass correct status/comment id",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to fetch users who liked the status/comment",
      error,
    });
  }
}

async function removeLike(req, res) {
  try {
    let id = req.params.id;
    let uid = req.id;

    //check if the status/comment exists
    let content =
      (await statusModel.findById(id)) || (await commentModel.findById(id));
    if (content) {
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

        let status =
          (await statusModel.findById(id)) || (await commentModel.findById(id));
        status.totalLikes = status.totalLikes - 1;
        status.likedBy = status.likedBy.filter((element) => element !== uid);
        await status.save();

        res.status(200).json({
          message: "Unliked",
          data: unlikedStatus,
        });
      } else {
        res.status(501).json({
          message: "You can't unlike this status/comment",
        });
      }
    } else {
      res.status(501).json({
        message: "enter correct status/comment id",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to unlike the status/comment",
      error,
    });
  }
}

// fetch status/comments liked by a user
async function statusLikedByUserId(req, res) {
  try {
    let uid = req.params.id;
    //check if the userId provided exists
    let user = await userModel.findById(uid);
    if (user) {
      let likedStatus = await likeModel.find({ userId: uid });
      res.status(200).json({
        mesaage: "Liked status/comment by user fetched successfully",
        data: likedStatus,
      });
    } else {
      res.status(501).json({
        message: "Pass correct userId",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to load liked status/comment",
      error,
    });
  }
}

module.exports.addLike = addLike;
module.exports.getLikesByStatusId = getLikesByStatusId;
module.exports.removeLike = removeLike;
module.exports.statusLikedByUserId = statusLikedByUserId;
