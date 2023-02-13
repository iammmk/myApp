const express = require("express");
const authRouter = express.Router();

const { signup, login } = require("../service/authService");

authRouter.route("/signup").post(signup);
authRouter.route("/login").post(login);


module.exports = authRouter;