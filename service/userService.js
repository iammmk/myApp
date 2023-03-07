const statusModel = require("../models/statusModel");
const commentModel = require("../models/commentModel");
const userModel = require("../models/userModel");
const cloudinary = require("../utils/cloudinary");
const notificationModel = require("../models/notificationModel");

// get users by search
async function getAllUsers(req, res) {
  try {
    const search = req.query.search;

    // Return empty array if search parameter is empty
    if (!search.trim()) {
      return res.status(200).json({
        message: "Got all suggestions !",
        data: [],
      });
    }

    const regex = new RegExp(search, "i"); // create a case-insensitive regular expression from the search string
    const result = [];
    let users = await userModel.find({});
    for (let item of users) {
      if (
        // check if the username or name matches the search string
        regex.test(item.name) ||
        regex.test(item.username)
      ) {
        result.push(item);
      }
    }
    res.status(200).json({
      message: "Got all suggestions !",
      data: result,
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

    const profilePhoto =
      req.body.pImage &&
      (await cloudinary.uploader.upload(req.body.pImage, {
        folder: "users",
        // width: 300,
        // crop: "scale"
      }));
    const cp =
      req.body.coverPhoto &&
      (await cloudinary.uploader.upload(req.body.coverPhoto, {
        folder: "coverphoto",
        // width: 300,
        // crop: "scale"
      }));

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

      if (req.body.pImage) {
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

// reset cover / profile photo
async function resetUserPhoto(req, res) {
  try {
    let id = req.id;
    let user = await userModel.findById(id);

    if (user) {
      let updateObj = req.body;
      for (let key in updateObj) {
        user[key] = updateObj[key];
      }
      let updatedUser = await user.save();

      if (updateObj.pImage) {
        // reset profile pic in status
        let allStatus = await statusModel.find({ userId: id });
        for (let status of allStatus) {
          status["userImage"] = updatedUser["pImage"];
          await status.save();
        }

        // reset profile pic in comment
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
      }

      res.status(200).json({
        message: "User photo updated successfully !",
        data: updatedUser,
      });
    } else {
      res.status(404).json({
        message: "User doesn't exist",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to reset user photo",
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

module.exports.getAllUsers = getAllUsers;
module.exports.getUserByUserId = getUserByUserId;
module.exports.getUserProfile = getUserProfile;
module.exports.updateUserProfile = updateUserProfile;
module.exports.resetUserPhoto = resetUserPhoto;
// module.exports.deleteUserProfile = deleteUserProfile;
