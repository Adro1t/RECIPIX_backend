const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema(
  {
    ingredientName: {
      type: String,
      // required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
  //createdAt,updateAt
);

module.exports = mongoose.model("Ingredient", ingredientSchema);
