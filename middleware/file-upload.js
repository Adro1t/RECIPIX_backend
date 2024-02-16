const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: async (req, res, cb) => {
    let fileDestination = "public/uploads/recipes";

    //check if directory exists
    if (!fs.existsSync(fileDestination)) {
      fs.mkdirSync(fileDestination, { recursive: true });
      //recursive:true means it creates parent folder as well as sub-folder
      cb(null, fileDestination);
    } else {
      cb(null, fileDestination);
    }
  },
  filename: (req, file, cb) => {
    let filename = path.basename(file.originalname, path.extname(file.originalname)); //returns filename
    let ext = path.extname(file.originalname); //returns extension
    cb(null, filename + "_" + Date.now() + ext); //filename_date.ext
  },
});

// check if the file has a valid image file extension
let imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
    return cb(new Error("you can upload image files only"), false);
  } else {
    cb(null, true);
  }
};

//upload image

let upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 2000000, //2mb
  },
});

module.exports = upload;
