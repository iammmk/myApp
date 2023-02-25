const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SECRET_KEY = process.env.SECRET_KEY;

async function signup(req, res) {
  try {
    let user = req.body;
    let newUser = await userModel.create({
      name: user.name,
      username: user.username,
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
    const { email, username, password } = req.body;

    // check1: if user exists with the email or username
    // check2: compare the password with the hash from the db
    const user =
      (await userModel.findOne({ email: email })) ||
      (await userModel.findOne({ username: username }));
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, SECRET_KEY);
      res.cookie("jwt", token, { httpOnly: true });
      res.status(200).json({
        message: "Login successful!",
        data: user,
      });
    } else {
      res.status(401).json({
        message: "Incorrect credentials",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to login user.",
    });
  }
}

async function logout(req, res) {
  try {
    res.clearCookie("jwt",{ httpOnly: true });
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
