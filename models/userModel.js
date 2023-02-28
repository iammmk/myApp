const mongoose = require("mongoose");
const DB_LINK = process.env.DB_LINK;
mongoose.set("strictQuery", false);
mongoose
  .connect(DB_LINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then((db) => {
    console.log("Connected to usersCollection !!!");
  });

const bcrypt = require("bcryptjs");
const { isEmailValid, isUsernameValid } = require("../utils/validation");

// User schema
let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function () {
        return this.name.length <= 50;
      },
      message: "Max character limit of name is 50",
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: [isUsernameValid, "Invalid username"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: [isEmailValid, "Invalid email address"],
  },
  bio: String,
  joinedOn: {
    type: Number,
    default: Date.now,
  },
  dob: {
    type: Date,
    default: null
  }, //handle format from frontend
  password: {
    type: String,
    minLength: [8, "Min 8 characters required."],
    required: true,
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function () {
        return this.password == this.confirmPassword;
      },
      message: "Password didn't matched !!",
    },
    // required: true, //restrict in frontend as we're using pre.save with conf pass
  },
  totalStatus: {
    type: Number,
    default: 0,
  },
  followersCount: {
    type: Number,
    default: 0,
  },
  // followersList: {
  //   type: [String],
  //   default: [],
  // },
  followingCount: {
    type: Number,
    default: 0,
  },
  newNotificationCount: {
    type: Number,
    default: 0,
  },
  // followingList: {
  //   type: [String],
  //   default: [],
  // },
  //profile pic of user
  pImage: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/128/552/552721.png",
  },
});

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

const userModel = mongoose.model("usersCollection", userSchema);
module.exports = userModel;
