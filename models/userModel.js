const mongoose = require("mongoose");
const DB_LINK =
  "mongodb+srv://iammmk:iamMMK991104@cluster0.mhv3qwj.mongodb.net/?retryWrites=true&w=majority";
mongoose.set("strictQuery", false);
mongoose
  .connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => {
    console.log("Connected to db !!!");
  });

const { isEmailValid } = require("../service/util");

// User schema
let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmailValid, "Invalid email address"],
  },
  bio: String,
  password: {
    type: String,
    minLength: [8, "Min 8 characters required."],
    required: true,
  },
  confirmPassword: {
    type: String,
    minLength: [8, "Min 8 characters required."],
    validate: {
      validator: function () {
        return this.password == this.confirmPassword;
      },
      message: "Password didn't matched !!",
    },
  },
  totalStatus: {
    type: Number,
    default: 0,
  },
});

userSchema.pre("save", function () {
  this.confirmPassword = undefined;
});

const userModel = mongoose.model("userscollection", userSchema);
module.exports = userModel;
