const notificationModel = require("../models/notificationModel");
const userModel = require("../models/userModel");

async function getNotifications(req, res) {
  try {
    let uid = req.id; //reciever's userId
    let user = await userModel.findById(uid);
    if (user) {
      let allNotifications = await notificationModel.find({ toId: uid });
      res.status(200).json({
        message: "notifications fetched",
        data: allNotifications,
      });
    } else {
      res.status(404).json({
        message: "incorrect user id",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to fetch notifications ",
      error,
    });
  }
}

// mark notification as read
async function editNotificationCount(req, res) {
  try {
    let uid = req.id;
    let user = await userModel.findById(uid);
    if (user) {
      user.newNotificationCount = 0;
      await user.save();
      res.status(200).json({
        message: "no new notification",
      });
    } else {
      res.status(404).json({
        message: "user doen't exist",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to delete notification count",
      error,
    });
  }
}

// clear notifications
async function clearNotifications(req, res) {
  try {
    let uid = req.id;
    let user = await userModel.findById(uid);
    if (user) {
      let allNotifications = await notificationModel.deleteMany({ toId: uid });
      res.status(200).json({
        message: "notifications deleted",
        data: allNotifications,
      });
    } else {
      res.status(404).json({
        message: "user doen't exist",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to clear notifications",
      error,
    });
  }
}

module.exports.getNotifications = getNotifications;
module.exports.editNotificationCount = editNotificationCount;
module.exports.clearNotifications = clearNotifications;
