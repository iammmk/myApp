const followModel = require("../models/followModel");
const userModel = require("../models/userModel");
const notificationModel = require("../models/notificationModel");

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

        //push new notification
        let notification = {
          toId: id,
          fromId: uid,
          fromUsername: fromUser.username,
          fromImage: fromUser.pImage,
          activity: "follow",
        };
        let addedNotification = await notificationModel.create(notification);
        // update notification count
        toUser.newNotificationCount = toUser.newNotificationCount + 1;
        await toUser.save();

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
      let result = [];
      let followingList = await followModel.find({ fromId: id });
      for (let item of followingList) {
        let uid = item.toId;
        let people = await userModel.findById(uid);
        result.push(people);
      }
      res.status(200).json({
        message: "Following list fetched",
        data: result,
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
      let result = [];
      let followersList = await followModel.find({ toId: id });
      for (let item of followersList) {
        let uid = item.fromId;
        let people = await userModel.findById(uid);
        result.push(people);
      }
      res.status(200).json({
        message: "Followers list fetched",
        data: result,
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

// get users not followed by user
async function getFollowSuggestion(req, res) {
  try {
    let uId = req.id; //ownerId

    const search = req.query.search || "";
    const regex = new RegExp(search, "i"); // create a case-insensitive regular expression from the search string

    let SuggestionList = [];
    let allUsers = await userModel.find({});
    for (let item of allUsers) {
      if (
        item._id != uId &&
        // check if the username or name matches the search string
        (regex.test(item.name) || regex.test(item.username))
      ) {
        let isFollowing = await followModel.find({
          $and: [{ toId: item._id }, { fromId: uId }],
        });
        if (!isFollowing.length) {
          let unfollowedUser = await userModel.findById(item._id);
          SuggestionList.push(unfollowedUser);
        }
      }
    }

    res.status(200).json({
      message: "Suggestion list fetched",
      data: SuggestionList,
    });
  } catch (error) {
    res.status(501).json({
      message: "Failed to fetch follow suggestion",
      error,
    });
  }
}

module.exports.followUserByUserId = followUserByUserId;
module.exports.unfollowUserByUserId = unfollowUserByUserId;
module.exports.getFollowersByUserId = getFollowersByUserId;
module.exports.getFollowingByUserId = getFollowingByUserId;
module.exports.getFollowSuggestion = getFollowSuggestion;
