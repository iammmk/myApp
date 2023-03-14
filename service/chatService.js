const chatRoomModel = require("../models/chatRoomModel");
const chatModel = require("../models/chatModel");

async function createChat(req, res) {
  try {
    const senderId = req.id;
    const { receiverId, chat } = req.body;

    const chatRoom = await chatRoomModel.findOne({
      members: { $all: [senderId, receiverId] },
    });

    const newChat = {
      chatRoomId: chatRoom
        ? chatRoom._id
        : (await chatRoomModel.create({ members: [senderId, receiverId] }))._id,
      chat,
      senderId,
    };

    const createdChat = await chatModel.create(newChat);

    res.status(200).json({
      message: "new chat created !!",
      data: createdChat,
    });
  } catch (error) {
    res.status(501).json({
      message: "Failed to send message",
      error,
    });
  }
}

async function getChatByUserIds(req, res) {
  try {
    const { senderId, receiverId } = req.body;
    const chatRoom = await chatRoomModel.findOne({
      members: { $all: [senderId, receiverId] },
    });
    const chatRoomId = chatRoom
      ? chatRoom._id
      : (await chatRoomModel.create({ members: [senderId, receiverId] }))._id;

    const chats = await chatModel.find({ chatRoomId: chatRoomId });
    res.status(200).json({
      message: "fetched chats",
      data: chats,
    });
  } catch (error) {
    res.status(501).json({
      message: "Failed to get chat",
      error,
    });
  }
}

async function getChatByChatRoomId(req, res) {
  try {
    let chatRoomId = req.params.chatRoomId;
    let chatRoom = await chatRoomModel.findById(chatRoomId);
    if (chatRoom) {
      let allChats = await chatModel.find({ chatRoomId: chatRoomId });
      res.status(200).json({
        message: "Fetched all chats",
        data: allChats,
      });
    } else {
      res.status(404).json({
        message: "chatroom doesn't exist",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Failed to get chats",
      error,
    });
  }
}

// get chatrooms for a user
async function getAllChatRooms(req, res) {
  try {
    let uid = req.id;
    let chatrooms = await chatRoomModel.find({ members: { $in: [uid] } });
    res.status(200).json({
      message: "Fetched all chatrooms",
      data: chatrooms,
    });
  } catch (error) {
    res.status(501).json({
      message: "Failed to get chatrooms",
      error,
    });
  }
}

module.exports.createChat = createChat;
module.exports.getChatByChatRoomId = getChatByChatRoomId;
module.exports.getAllChatRooms = getAllChatRooms;
module.exports.getChatByUserIds = getChatByUserIds;
