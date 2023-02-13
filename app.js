const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());


// import routers
const userRouter = require("./routers/userRouter");
const statusRouter = require("./routers/statusRouter");
const authRouter = require("./routers/authRouter");
// const { isLoggedIn } = require("./service/authService");


app.use("", authRouter)
app.use("/user", userRouter);
app.use("/status", statusRouter);


let port = 3000;

app.listen(port, function () {
  console.log("server started at port 3000");
});
