const express = require("express");
const chatRouter = express.Router();

const {
  createChat,
  getChatByChatRoomId,
  getAllChatRooms,
  getChatByUserIds,
} = require("../service/chatService");

const { protectRoute } = require("../service/authService");

chatRouter.use(protectRoute);

chatRouter.route("/").get(getChatByUserIds).post(createChat);

chatRouter.route("/chatRoom").get(getAllChatRooms);

chatRouter.route("/:chatRoomId").get(getChatByChatRoomId);

module.exports = chatRouter;
