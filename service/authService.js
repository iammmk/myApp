const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "HiMmKhAn1999";

async function signup(req, res) {
  try {
    let user = req.body;
    let newUser = await userModel.create({
      name: user.name,
      email: user.email,
      password: user.password,
      confirmPassword: user.confirmPassword,
    });
    res.status(200).json({
      message: "Signup successful !",
      data: newUser,
    });
  } catch (error) {
    res.status(501).json({
      message: "Failed to signup user.",
      error,
    });
  }
}

async function login(req, res) {
  try {
    let { email, password } = req.body;
    let user = await userModel.find({ email: email });
    if (user.length) {
      let loginUser = user[0];
      if (loginUser.password === password) {
        let token = jwt.sign({ id: loginUser["_id"] }, SECRET_KEY);
        res.cookie("jwt", token, { httpOnly: true });
        res.status(200).json({
          message: "Login successful !",
          data: loginUser,
        });
      } else {
        res.status(501).json({
          message: "Incorrect email or password.",
        });
      }
    } else {
      res.status(501).json({
        message: "Incorrect email or password.",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to login user.",
      error,
    });
  }
}

async function logout(req, res) {
  try {
    res.clearCookie("jwt");
    // res.redirect("/");
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(501).json({
      error,
    });
  }
}

// middlewares
// async function isLoggedIn(req, res, next) {
//   try {
//     let token = req.cookies.jwt;
//     let payload = jwt.verify(token, SECRET_KEY);
//     if (payload) {
//       // let id = payload.id;
//       // let user = await userModel.findById(id);
//       next();
//     } else {
//       res.status(501).json({
//         message: "login first.",
//       });
//     }
//   } catch (error) {
//     res.status(501).json({
//       message: "login first.",
//       error,
//     });
//   }
// }

async function protectRoute(req, res, next) {
  try {
    const token = req.cookies.jwt;
    const payload = jwt.verify(token, SECRET_KEY);
    if (payload) {
      req.id = payload.id;
      next();
    } else {
      res.status(501).json({
        message: "Not allowed.",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Not allowed.",
      error,
    });
  }
}

module.exports.signup = signup;
module.exports.login = login;
module.exports.logout = logout;
// module.exports.isLoggedIn = isLoggedIn;
module.exports.protectRoute = protectRoute;
