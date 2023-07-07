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
// app.use(express.json());
//paylaod too large error in uploading image
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(cors(corsOptions));

// import routers
const userRouter = require("./routers/userRouter");
const statusRouter = require("./routers/statusRouter");
const authRouter = require("./routers/authRouter");
const likeRouter = require("./routers/likeRouter");
const commentRouter = require("./routers/commentRouter");
const followRouter = require("./routers/followRouter");
const chatRouter = require("./routers/chatRouter");

app.use("", authRouter);
app.use("/user", userRouter);
app.use("/status", statusRouter);
app.use("/like", likeRouter);
app.use("/comment", commentRouter);
app.use("/follow", followRouter);
app.use("/chat", chatRouter);

let PORT = process.env.PORT || 3000;

//  app.listen creates an HTTP server internally. http.createServer(app) explicitly creates an HTTP server instance and then starts listening on that instance.
// app.listen(PORT, function () {
//   console.log(`server started at port ${PORT}`);
// });

const server = require("http").createServer(app);

server.listen(PORT, function () {
  console.log(`server started at port ${PORT}`);
});

// creating socket server
// const io = require("socket.io")(server, {
//   cors: {
//     // origin: "https://myappmmk.netlify.app",
//     origin: "http://localhost:8080",
//   },
// });

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // Add event listeners for socket events here
//   socket.on("upload-status", (status) => {
//     io.emit("receive-status", status);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });
