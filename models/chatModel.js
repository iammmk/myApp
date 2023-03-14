const mongoose = require("mongoose");
const DB_LINK = process.env.DB_LINK;
mongoose.set("strictQuery", false);
mongoose
  .connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => {
    console.log("Connected to chatCollection !!!");
  });

//status Schema
const chatSchema = new mongoose.Schema({
  chatRoomId: {
    type: String,
  },
  chat: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
  },
  chatTime: {
    type: Number,
    default: Date.now,
  },
});

const chatModel = mongoose.model("chatCollection", chatSchema);
module.exports = chatModel;
