const Ingredient = require("../model/ingredientModel");

exports.postIngredient = async (req, res) => {
  try {
    const ingredient = new Ingredient(req.body);

    await ingredient.save();
    res.json({ ingredient });
  } catch (error) {
    console.error("Error creating ingredient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//to fetch
exports.getIngredientList = (req, res) => {
  Ingredient.find()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json({ error: "failed to fetch" });
    });
};

//single category by id
exports.getSingleIngredrient = (req, res, next, id) => {
  Ingredient.findById(id)
    .then((ingredient) => {
      req.ingredient = ingredient;
      next();
    })
    .catch((error) => {
      res.status(400).json({ error: "failed to find ingredient" });
    });
};

//to fetch categpry data related to single id
exports.getIngredientDetail = (req, res) => {
  res.json(req.ingredient);
};

//update category
exports.updateIngredient = (req, res) => {
  let ingredient = req.ingredient;
  ingredient.ingredientName = req.body.ingredientName;
  ingredient
    .save()
    .then((result) => {
      res.json({ result });
    })
    .catch((error) => {
      res.status(400).json({ error: "failed to update" });
    });
};

//to delete category
// exports.deleteCategory = (req, res) => {
//   let category = req.category;
//   category
//     .remove()
//     .then((result) => {
//       res.json({ message: "category delete sucessfully" });
//     })
//     .catch((error) => {
//       res.status(400).json({ error: "failed to delete" });
//     });
// };

// To delete a category
exports.deleteIngredient = (req, res) => {
  let ingredient = req.ingredient;

  ingredient
    .deleteOne()
    .then((result) => {
      res.json({ message: "Ingredient deleted successfully" });
    })
    .catch((error) => {
      res.status(400).json({ error: "Failed to delete ingredient" });
    });
};
