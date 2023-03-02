const statusModel = require("../models/statusModel");
const commentModel = require("../models/commentModel");
const userModel = require("../models/userModel");
const cloudinary = require("../utils/cloudinary");
const notificationModel = require("../models/notificationModel");

async function getAllUsers(req, res) {
  try {
    let users = await userModel.find({});
    res.status(200).json({
      message: "Got all users !",
      data: users,
    });
  } catch (error) {
    res.status(501).json({
      message: "Failed to get users",
      error,
    });
  }
}

async function getUserByUserId(req, res) {
  try {
    let id = req.params.id;
    let user = await userModel.findById(id);
    if (user) {
      res.status(200).json({
        message: "Got the user",
        data: user,
      });
    } else {
      res.status(501).json({
        message: "Pass correct user id",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to get the user",
      error,
    });
  }
}

// User Profile info
async function getUserProfile(req, res) {
  try {
    let id = req.id;
    let user = await userModel.findById(id);
    res.status(200).json({
      message: "Got the profile",
      data: user,
    });
  } catch (error) {
    res.status(501).json({
      message: "Login first",
      error,
    });
  }
}

// Update profile
async function updateUserProfile(req, res) {
  try {
    let id = req.id;
    let user = await userModel.findById(id);

    console.log(user)
    const profilePhoto = await cloudinary.uploader.upload(req.body.pImage, {
      folder: "users",
      // width: 300,
      // crop: "scale"
    });
    const cp = await cloudinary.uploader.upload(req.body.coverPhoto, {
      folder: "coverphoto",
      // width: 300,
      // crop: "scale"
    });

    if (user) {
      let updateObj = req.body;
      for (let key in updateObj) {
        if (key === "pImage") {
          user["pImage"] = profilePhoto.secure_url;
        } else if (key === "coverPhoto") {
          user["coverPhoto"] = cp.secure_url;
        } else {
          user[key] = updateObj[key];
        }
      }
      let updatedUser = await user.save();

      // update profile pic in status
      let allStatus = await statusModel.find({ userId: id });
      for (let status of allStatus) {
        status["userImage"] = updatedUser["pImage"];
        await status.save();
      }

      // update profile pic in comment
      let allComments = await commentModel.find({ userId: id });
      for (let comment of allComments) {
        comment["userImage"] = updatedUser["pImage"];
        await comment.save();
      }

      // update profile pic in notification
      let allNotifications = await notificationModel.find({ fromId: id });
      for (let notification of allNotifications) {
        notification["fromImage"] = updatedUser["pImage"];
        await notification.save();
      }

      res.status(200).json({
        message: "User updated successfully !",
        data: updatedUser,
      });
    } else {
      res.status(501).json({
        mesaage: "wrong id passed",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to update user",
      error,
    });
  }
}

// delete profile--> needs to include many edge cases
// async function deleteUserProfile(req, res) {
//   try {
//     let id = req.id;
//     let user = await userModel.findByIdAndDelete(id);
//     await statusModel.deleteMany({ userId: id });
//     await likeModel.deleteMany({ userId: id });
//     //remove follower/following
//     await followModel.deleteMany({ toId: id });
//     await followModel.deleteMany({ fromId: id });
//     await commentModel.deleteMany({ userId: id });
//     await commentModel.deleteMany({ mainStatusByUserId: id });

//     res.status(200).json({
//       mesaage: "user deleted successfully",
//       data: user,
//     });
//   } catch (error) {
//     res.status(501).json({
//       message: "Failed to delete user",
//       error,
//     });
//   }
// }

// module.exports.getAllUsers = getAllUsers;
module.exports.getUserByUserId = getUserByUserId;
module.exports.getUserProfile = getUserProfile;
module.exports.updateUserProfile = updateUserProfile;
// module.exports.deleteUserProfile = deleteUserProfile;
