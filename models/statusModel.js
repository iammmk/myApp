const mongoose = require("mongoose");
const DB_LINK =
  "mongodb+srv://iammmk:iamMMK991104@cluster0.mhv3qwj.mongodb.net/?retryWrites=true&w=majority";
mongoose.set("strictQuery", false);
mongoose
  .connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => {
    console.log("Connected to db !!!");
  });

//status Schema
const statusSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  totalLikes: {
    type: Number,
    default: 0,
  },
  totalComments: {
    type: Number,
    default: 0,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  lastEdit: String,
  uploadTime: {
    type: Number, // check type
    default: Date.now(),
  },
});

const statusModel = mongoose.model("statuscollection", statusSchema);
module.exports = statusModel;
