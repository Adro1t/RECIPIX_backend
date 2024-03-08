const Recipe = require("../model/recipeModel");
const Ingredient = require("../model/ingredientModel");

//post recipe
exports.postRecipe = async (req, res) => {
  try {
    const exception = [
      "/",
      "\r\n",
      "\r",
      "\n",
      "a",
      "all",
      "and",
      "adjust",
      "approximately",
      "as",
      "bag",
      "boneless",
      "black",
      "brown",
      "brewed",
      "beaten",
      "broken",
      "bell",
      "batter",
      "boiled",
      "canned",
      "chopped",
      "cooked",
      "cooking",
      "cooled",
      "chilled",
      "cloves",
      "crushed",
      "cubed",
      "cup",
      "can",
      "cups",
      "cold",
      "condensed",
      "consistency",
      "chowmein",
      "diced",
      "dried",
      "dipping",
      "dusting",
      "dumpling",
      "drizzle",
      "desired",
      "extract",
      "evaporated",
      "finely",
      "frying",
      "fresh",
      "frozen",
      "full",
      "for",
      "g",
      "grated",
      "garnish",
      "granulated",
      "green",
      "grilling",
      "ground",
      "greasing",
      "garam",
      "heavy",
      "ice",
      "inch",
      "into",
      "julienned",
      "liqueur",
      "large",
      "minced",
      "mashed",
      "medium",
      "mix",
      "napa",
      "of",
      "or",
      "only",
      "optional",
      "pure",
      "pound",
      "pack",
      "pods",
      "purpose",
      "powder",
      "paste",
      "puree",
      "pinch",
      "pizza",
      "part",
      "pieces",
      "ripe",
      "red",
      "rose",
      "roasted",
      "sheets",
      "sliced",
      "sized",
      "size",
      "standard",
      "strong",
      "skinless",
      "sliced",
      "stir",
      "small",
      "sauteing",
      "sprinkle",
      "sweetened",
      "shredded",
      "strands",
      "taste",
      "thighs",
      "thinly",
      "teaspoon",
      "tablespoon",
      "tablespoons",
      "to",
      "wrapper",
      "whole",
      "yolk",
    ];
    let x = [];
    const array = req.body.ingredients.split(",");
    for (const item of array) {
      const words = item.split(" ");

      for (const word of words) {
        if (isNaN(parseInt(word)) && !exception.includes(word)) {
          x.push(word);
          const existingIngredient = await Ingredient.findOne({
            ingredientName: word,
          });
          if (existingIngredient) {
            continue;
          }
          let ingredient = new Ingredient({ ingredientName: word });
          ingredient.save();
        }
      }
    }

    let recipe = new Recipe({
      recipe_name: req.body.recipe_name,
      ingredients: req.body.ingredients,
      description: req.body.description,
      prep_time: req.body.prep_time,
      cook_time: req.body.cook_time,
      total_time: parseInt(req.body.prep_time) + parseInt(req.body.cook_time),
      instructions: req.body.instructions,
      image: req.file.path,
      category: req.body.category,
      owner: req.body.owner,
      ingredientArray: x,
    });

    await recipe.save();
    res.json({ recipe });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//display all recipes
exports.recipeList = async (req, res) => {
  try {
    // let order = req.query.order ? req.query.order : "asc";
    // let sortBy = req.query.order ? req.query.sortBy : "_id";
    let limit = req.query.order ? parseInt(req.query.limit) : 200;

    const { order = "asc", sortBy = "_id" } = req.query;
    const recipes = await Recipe.find()
      .populate("category")
      .populate("owner")
      .sort([[sortBy, order]])
      .limit(limit);
    res.json(recipes);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//finding recipe by id
exports.recipeById = async (req, res, next, id) => {
  try {
    let recipe = await Recipe.findById(id)
      .populate("category")
      .populate("owner");
    req.recipe = recipe;
    next();
  } catch (error) {
    return res.status(400).json({ error: "recipe not found" });
  }
};

//single recipe
exports.recipeDetails = async (req, res) => {
  res.json(req.recipe);
};

//delete recipe
exports.deleteRecipe = async (req, res) => {
  try {
    let recipe = req.recipe;
    await recipe.deleteOne();
    res.json({ message: "recipe removed successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//edit/update recipe
exports.updateRecipe = async (req, res) => {
  try {
    let recipe = req.recipe;
    recipe.recipe_name = req.body.recipe_name;
    recipe.ingredients = req.body.ingredients;
    recipe.description = req.body.description;
    recipe.prep_time = req.body.prep_time;
    recipe.cook_time = req.body.cook_time;
    recipe.instructions = req.body.instructions;
    recipe.category = req.body.category;
    recipe.owner = req.body.owner;
    recipe.image = req.file.path;
    let updatedRecipe = await recipe.save();
    if (!updatedRecipe) {
      return res.status(400).json({ error: "failed to update recipe" });
    }
    res.json({ updatedRecipe });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//to filter recipe by category and times
exports.listBySearch = async (req, res) => {
  try {
    let limit = req.body.limit ? parseInt(req.body.limit) : 200;
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.SortBy ? req.body.sortBy : "_id";
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    for (let key in req.body.filters) {
      if (req.body.filters[key].length > 0) {
        if (key == "total_time") {
          findArgs[key] = {
            //greater than time
            $gte: req.body.filters[key][0],
            //less than time
            $lte: req.body.filters[key][1],
          };
        } else {
          findArgs[key] = req.body.filters[key];
        }
      }
    }
    const recipes = await Recipe.find(findArgs)
      .populate("category")
      .populate("owner")
      .sort([[sortBy, order]])
      .limit(limit)
      .skip(skip);
    res.json({
      size: recipes.length,
      recipes,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

//List related to same category
exports.relatedList = async (req, res) => {
  let singleRecipe = await Recipe.findById(req.params.recipeId);
  let limit = req.query.limit ? parseInt(req.query.limit) : 5;
  if (!singleRecipe) {
    return res
      .status(400)
      .json({ error: `Recipe with ID ${req.params.id} not found` });
  }
  let recipe = await Recipe.find({
    _id: { $ne: singleRecipe },
    category: singleRecipe.category,
  })
    .limit(limit)
    .populate("category", "category_Name");
  if (!recipe) {
    return res.status(400).json({ error: "something 2 went wrong" });
  }
  res.send(recipe);
};
