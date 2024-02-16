const express = require("express");
require("dotenv").config();

const db = require("./db/connection");
const bodyParser = require("body-parser");

const morgan = require("morgan");
// const expressValidator = require("express-validator");
const cookieParser = require("cookie-parser");

const cors = require("cors");

const path = require("path");

const categoryRoute = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");
const recipeRoute = require("./routes/recipeRoute");

const app = express();

app.get("/", (req, res) => {
  res.send("hello from ess server");
});

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cookieParser());

/* setting up a static file server for serving files from the directory `public/uploads/recipes`. */
app.use("/public/uploads/recipes", express.static(path.join(__dirname, "public/uploads/recipes")));

// route
app.use("/category", categoryRoute);
app.use("/user", userRoute);
app.use("/recipe", recipeRoute);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
