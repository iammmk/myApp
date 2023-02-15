const mongoose = require("mongoose");
const DB_LINK = process.env.DB_LINK;
mongoose.set("strictQuery", false);
mongoose
  .connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => {
    console.log("Connected to db !!!");
  });

const bcrypt = require("bcryptjs");
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
  joinedOn: {
    type: Date,
    default: Date.now(),
    //restrict updation from frontend
    // set(value) {
    //   return this.joinedOn || Date.now()
    // },
  },
  dob: Date, //handle format from frontend
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
  followersCount: {
    type: Number,
    default: 0,
  },
  followingCount: {
    type: Number,
    default: 0,
  },
});

// to added: username(like instagram)

// remove confirmPassword before save
userSchema.pre("save", function () {
  this.confirmPassword = undefined;
});

//middleware to convert password to hash before saving to db
userSchema.pre("save", async function (next) {
  //checks if the user document has been modified with respect to the password field, or if it is a new document that has not been saved to the database yet.
  if (!this.isModified("password") && !this.isNew) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

const userModel = mongoose.model("userscollection", userSchema);
module.exports = userModel;
