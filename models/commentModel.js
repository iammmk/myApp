const mongoose = require("mongoose");
const DB_LINK =
  "mongodb+srv://iammmk:iamMMK991104@cluster0.mhv3qwj.mongodb.net/?retryWrites=true&w=majority";
mongoose.set("strictQuery", false);
mongoose
  .connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => {
    console.log("Connected to db !!!");
  });

//comment Schema
const commentSchema = new mongoose.Schema({
  statusId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  
  commentTime: {
    type: Number, // check type 
    default: Date.now(),
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
});

const commentModel = mongoose.model("commentscollection", commentSchema);
module.exports = commentModel;
