const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const recipeSchema = new mongoose.Schema(
  {
    recipe_name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    ingredients: {
      type: String,
      required: true,
    },
    ingredientArray: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    prep_time: {
      type: Number,
      required: true,
    },
    cook_time: {
      type: Number,
      required: true,
    },
    total_time: {
      type: Number,
      required: true,
      default: 0,
    },
    instructions: {
      type: String,
      required: true,
    },

    category: {
      type: ObjectId,
      required: true,
      ref: "Category",
    },
    rating: {
      type: Number,
      default: 0,
    },
    owner: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
