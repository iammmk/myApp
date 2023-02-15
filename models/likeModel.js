const mongoose = require("mongoose");
const DB_LINK = process.env.DB_LINK;
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
