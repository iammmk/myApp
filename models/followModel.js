const mongoose = require("mongoose");
const DB_LINK = process.env.DB_LINK;
mongoose.set("strictQuery", false);
mongoose
  .connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => {
    console.log("Connected to db !!!");
  });

//follow Schema
const followSchema = new mongoose.Schema({
  // toId= whom user is following
  toId: {
    type: String,
    required: true,
  },
  // fromId= user who is following
  fromId: {
    type: String,
    required: true,
  },
  //   followTime: {
  //     type: String,
  //     default: Date.now(),
  //   },
});

const followModel = mongoose.model("followscollection", followSchema);
module.exports = followModel;
