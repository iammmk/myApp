const mongoose = require("mongoose");
const DB_LINK = process.env.DB_LINK;
mongoose.set("strictQuery", false);
mongoose
  .connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => {
    console.log("Connected to chatRoomCollection !!!");
  });

//status Schema
const chatRoomSchema = new mongoose.Schema({
  members: {
    type: Array,
  },
});

const chatRoomModel = mongoose.model("chatRoomCollection", chatRoomSchema);
module.exports = chatRoomModel;
