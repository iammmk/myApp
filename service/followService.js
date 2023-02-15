const followModel = require("../models/followModel");
const userModel = require("../models/userModel");

async function followUserByUserId(req, res) {
  try {
    let id = req.params.id;
    let uid = req.id;
    let toUser = await userModel.findById(id);
    let fromUser = await userModel.findById(uid);

    // check if the userId passed is correct
    if (toUser && id != uid) {
      // check fromUser already follows toUser
      let followStatus = await followModel.find({
        $and: [{ toId: id }, { fromId: uid }],
      });

      if (!followStatus.length) {
        let followData = {
          toId: id,
          fromId: uid,
        };
        let addedFollow = await followModel.create(followData);

        toUser.followersCount = toUser.followersCount + 1;
        fromUser.followingCount = fromUser.followingCount + 1;

        await toUser.save();
        await fromUser.save();

        res.status(200).json({
          message: "You started following the user",
          data: addedFollow,
        });
      } else {
        res.status(501).json({
          message: "You are already following the user",
        });
      }
    } else {
      res.status(501).json({
        message: "Pass correct userId",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to follow the user",
      error,
    });
  }
}

async function unfollowUserByUserId(req, res) {
  try {
    let id = req.params.id;
    let uid = req.id;
    let toUser = await userModel.findById(id);
    let fromUser = await userModel.findById(uid);

    // check if the userId passed is correct
    if (toUser && id != uid) {
      // check fromUser already follows toUser
      let followStatus = await followModel.find({
        $and: [{ toId: id }, { fromId: uid }],
      });

      if (followStatus.length) {
        let unfollowData = followStatus[0];
        let unfollowDataId = unfollowData._id.toString();
        let unfollowDetails = await followModel.findByIdAndDelete(
          unfollowDataId
        );

        toUser.followersCount = toUser.followersCount - 1;
        fromUser.followingCount = fromUser.followingCount - 1;

        await toUser.save();
        await fromUser.save();

        res.status(200).json({
          message: "You've unfollowed the user",
          data: unfollowDetails,
        });
      } else {
        res.status(501).json({
          message: "You don't even follow the user",
        });
      }
    } else {
      res.status(501).json({
        message: "Pass correct userId",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to unfollow the user",
      error,
    });
  }
}

// get following list of the user
async function getFollowingByUserId(req, res) {
  try {
    let id = req.params.id;
    let user = await userModel.findById(id);

    // check if the userId passed is correct
    if (user) {
      let followingList = await followModel.find({ fromId: id });
      res.status(200).json({
        message: "Following list fetched",
        data: followingList,
      });
    } else {
      res.status(501).json({
        message: "Pass correct userId",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to fetch following list",
      error,
    });
  }
}

// get followers list of the user
async function getFollowersByUserId(req, res) {
  try {
    let id = req.params.id;
    let user = await userModel.findById(id);

    // check if the userId passed is correct
    if (user) {
      let followersList = await followModel.find({ toId: id });
      res.status(200).json({
        message: "Followers list fetched",
        data: followersList,
      });
    } else {
      res.status(501).json({
        message: "Pass correct userId",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to fetch followers list",
      error,
    });
  }
}

module.exports.followUserByUserId = followUserByUserId;
module.exports.unfollowUserByUserId = unfollowUserByUserId;
module.exports.getFollowersByUserId = getFollowersByUserId;
module.exports.getFollowingByUserId = getFollowingByUserId;
