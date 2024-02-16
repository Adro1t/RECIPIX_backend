const Category = require("../model/categoryModel");

exports.postCategory = async (req, res) => {
  try {
    const existingCategory = await Category.findOne({ category_Name: req.body.category_Name });
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }
    const category = new Category(req.body);

    await category.save();
    res.json({ category });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//to fetch
exports.getCategoryList = (req, res) => {
  Category.find()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json({ error: "failed to fetch" });
    });
};

//single category by id
exports.getSingleCategory = (req, res, next, id) => {
  Category.findById(id)
    .then((category) => {
      req.category = category;
      next();
    })
    .catch((error) => {
      res.status(400).json({ error: "failed to find category" });
    });
};

//to fetch categpry data related to single id
exports.getCategoryDetail = (req, res) => {
  res.json(req.category);
};

//update category
exports.updateCategory = (req, res) => {
  let category = req.category;
  category.category_Name = req.body.category_Name;
  category
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
exports.deleteCategory = (req, res) => {
  let category = req.category;

  category
    .deleteOne()
    .then((result) => {
      res.json({ message: "Category deleted successfully" });
    })
    .catch((error) => {
      res.status(400).json({ error: "Failed to delete category" });
    });
};
