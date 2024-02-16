const mongoose = require("mongoose");
const uuidv1 = require("uuidv1");
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    saved_recipes: {
      type: ObjectId,
      ref: "Recipe",
    },
  },
  { timestamps: true }
);

//virtual fields
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) == this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto.createHmac("sha1", this.salt).update(password).digest("hex");
    } catch (error) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
