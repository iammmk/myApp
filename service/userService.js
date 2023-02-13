const userModel = require("../models/userModel");
const statusModel= require("../models/statusModel")


// async function createUser(req, res) {
//   try {
//     let userData = req.body;
//     let user = await userModel.create(userData);
//     res.status(200).json({
//       message: "New user created",
//       data: user,
//     });
//   } catch (error) {
//     res.status(501).json({
//       message: "Failed to get users",
//       error,
//     });
//   }
// }

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

// User Profile info
async function getUserProfile(req, res) {
  try {
    let id = req.id;
    let user = await userModel.findById(id);
    if (user) {
      res.status(200).json({
        message: "Got the user !",
        data: user,
      });
    } else {
      res.status(501).json({
        message: "Incorrect Id .",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to get users",
      error,
    });
  }
}

//Get user's status
async function getUserStatus(req, res) {
  try {
    let userId = req.id;
    let status = await statusModel.find({ userId: userId });
    res.status(200).json({
      message: "Got user's status !!",
      data: status,
    });
  } catch (error) {
    res.status(501).json({
      message: "Failed to get user's status",
      error,
    });
  }
}

// Update profile
async function updateUserProfile(req, res) {
  try {
    let id = req.id;
    let user = await userModel.findById(id);

    if (user) {
      let updateObj = req.body;
      for (let key in updateObj) {
        user[key] = updateObj[key];
      }
      let updatedUser = await user.save();
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

// delete profile
async function deleteUserProfile(req, res) {
  try {
    let id = req.id;
    let user = await userModel.findByIdAndDelete(id);
    if (user) {
      res.status(200).json({
        mesaage: "user deleted successfully",
        data: user,
      });
    } else {
      res.status(501).json({
        mesaage: "wrong id passed",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to delete user",
      error,
    });
  }
}

// module.exports.createUser = createUser;
module.exports.getAllUsers = getAllUsers;
module.exports.getUserProfile = getUserProfile;
module.exports.getUserStatus = getUserStatus;
module.exports.updateUserProfile = updateUserProfile;
module.exports.deleteUserProfile = deleteUserProfile;
// module.exports.updateProfilePhoto = updateProfilePhoto;
