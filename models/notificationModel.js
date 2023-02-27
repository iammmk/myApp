const mongoose = require("mongoose");
const DB_LINK = process.env.DB_LINK;
mongoose.set("strictQuery", false);
mongoose
  .connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => {
    console.log("Connected to notificationsCollection !!!");
  });

//notification Schema
const notificationSchema = new mongoose.Schema({
  // toId: notification receiver
  toId: {
    type: String,
    required: true,
  },
  // fromId: notification from the user
  fromId: {
    type: String,
    required: true,
  },
  fromUsername: {
    type: String,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  // status/comment id
  contentId: {
    type: String,
  },
  time: {
    type: Number,
    default: Date.now,
  },
});

const notificationModel = mongoose.model(
  "notificationsCollection",
  notificationSchema
);
module.exports = notificationModel;
