const mongoose = require("mongoose");
const DB_LINK = process.env.DB_LINK;
mongoose.set("strictQuery", false);
mongoose
  .connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => {
    console.log("Connected to statusCollection !!!");
  });

//status Schema
const statusSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  uploadedBy: { //username
    type: String,
  },
  userImage: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    validate: {
      validator: function () {
        return this.status.length <= 140;
      },
      message: "Max character limit is 140",
    },
  },
  childCommentIds: {
    type: [String],
    default: [],
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
  likedBy: {
    type: [String],
    default: [],
  },
  lastEdit: String,
  uploadTime: {
    type: Number, // check type
    default: Date.now,
  },
});

const statusModel = mongoose.model("statusCollection", statusSchema);
module.exports = statusModel;
