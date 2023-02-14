const mongoose = require("mongoose");
const DB_LINK =
  "mongodb+srv://iammmk:iamMMK991104@cluster0.mhv3qwj.mongodb.net/?retryWrites=true&w=majority";
mongoose.set("strictQuery", false);
mongoose
  .connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => {
    console.log("Connected to db !!!");
  });

//like Schema
const likeSchema = new mongoose.Schema({
  statusId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
//   likeTime: {
//     type: String,
//     default: Date.now(),
//   },
});

const likeModel = mongoose.model("likescollection", likeSchema);
module.exports = likeModel;
