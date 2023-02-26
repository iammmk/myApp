const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config(); //to use .env file data

const corsOptions = {
  // origin: "https://myappmmk.netlify.app",
  origin: "http://localhost:8080",
  credentials: true,
};

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

// import routers
const userRouter = require("./routers/userRouter");
const statusRouter = require("./routers/statusRouter");
const authRouter = require("./routers/authRouter");
const likeRouter = require("./routers/likeRouter");
const commentRouter = require("./routers/commentRouter");
const followRouter = require("./routers/followRouter");

app.use("", authRouter);
app.use("/user", userRouter);
app.use("/status", statusRouter);
app.use("/like", likeRouter);
app.use("/comment", commentRouter);
app.use("/follow", followRouter);

let PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log(`server started at port ${PORT}`);
});
