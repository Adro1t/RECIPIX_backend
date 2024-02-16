const User = require("../model/userModel");
const jwt = require("jsonwebtoken"); //for authentication

//for authorizartion
// const expressJwt = require("express-jwt");{old}
const { expressjwt: expressJwt } = require("express-jwt"); //{new}

const Token = require("../model/token");
const sendEmail = require("../utils/verifyEmail");
const crypto = require("crypto");

exports.postUser = async (req, res) => {
  try {
    const user = new User(req.body);

    /* checking if the username or email provided by the user during registration is already used by another user in the database. If the username or email is already used, it returns a response with a status code of 400 (Bad Request) and an error message indicating that the username or email is already used. This is done to ensure that each user has a unique username and email in the system. */
    const userByName = await User.findOne({ name: user.name });
    const userByEmail = await User.findOne({ email: user.email });

    if (userByName) {
      return res.status(400).json({ error: "Username already used" });
    }

    if (userByEmail) {
      return res.status(400).json({ error: "Email already used" });
    }

    const savedUser = await user.save();

    const token = new Token({
      token: crypto.randomBytes(16).toString("hex"),
      userId: savedUser._id,
    });

    await token.save();

    const url = `${process.env.FRONTEND_URL}\/email\/confirmation/${token.token}`;

    sendEmail({
      from: "no-reply@recipe.com.npu",
      to: savedUser.email,
      subject: "Email Verification Link",
      text: `Hello, \n\n Please verify your account by clicking the link below: \n http://${req.headers.host}\/user\/confirmation\/${token.token}`,
      html: `<center><h1>Confirm Your Email Account</h1></center>
      <p>Hello,</p><p>Please verify your account by clicking the link below:</p>
      <center><button><a href="${url}">Verify Account</a></button></center>`,
    });

    res.json({ users: savedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//confirm email after signup
exports.postConfirmation = async (req, res) => {
  try {
    //first find the matching token
    const token = await Token.findOne({ token: req.params.token });

    // if we found the valid token then find the valid user
    const user = await User.findOne({ _id: token.userId });
    // check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({ error: "already verified" });
    }
    //verify and save user
    user.isVerified = true;
    await user.save();
    res.json({ message: "email is finally verified" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//resend verificaiton email
exports.resendVerificationEmail = async (req, res) => {
  try {
    // at first find registered email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: "email provided not found in our system" });
    }
    //check if already verified
    if (user.isVerified) {
      return res.status(400).json({ error: "already verified" });
    }

    //create token to save in DataBase and send email verificaiton link
    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    await token.save();

    const url = process.env.FRONTEND_URL + "/email/confirmation/" + token.token;

    //send Email
    sendEmail({
      from: "no-reply@recipe.com.npu",
      to: user.email,
      subject: "Email Verification Link",
      text: `Hello, \n\n Please verify your account by clicking the link below: \n http://${req.headers.host}\/user\/confirmation\/${token.token}`,
      html: `<h1>Confirm your email account</h1>
              <button><a href="${url}">Verify Email</a></button>
        `,
    });

    res.json({ message: "verification link has been sent" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//Signin
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user using async/await
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ error: "not verified" });
    }

    if (!user.authenticate(password)) {
      return res.status(400).json({ error: "password error" });
    }

    // Generate JWT with email included
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // Set cookie and send response
    res.cookie("C", token, { expire: Date.now() + 1800000 });

    //return response with userinfo and token to frontend
    const { name, _id, role } = user;

    res.json({ token, user: { name, _id, email, role } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//SIGNOUT
exports.signOut = (req, res) => {
  res.clearCookie("C");
  res.json({ message: "SignOut Success" });
};

exports.userList = (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

exports.userById = (req, res, next, id) => {
  User.findById(id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => {
      res.status(400).json({ error: "failed to find" });
    });
};

exports.userDetails = (req, res) => {
  //to hide salt and password
  req.user.hashed_password = req.user.salt = undefined;
  res.json(req.user);
};

//for authorization

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

//forget password
exports.forgetPassword = async (req, res) => {
  try {
    //find registered user
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }

    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    await token.save();
    const url = process.env.FRONTEND_URL + "/reset/password/" + token.token;

    //send Email
    sendEmail({
      from: "no-reply@recipe.com.npu",
      to: user.email,
      subject: "Password Reset Link",
      text: `Hello, \n\n Please reset your password by clicking the link below: \n http://${req.headers.host}\/user\/password\/reset\/${token.token}`,
      html: `<h1>Reset your account password</h1>
      <button><a href="${url}">Reset Password</a></button>`,
    });

    res.json({ message: "password reset link has been sent" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//reset password
exports.resetPassword = async (req, res) => {
  try {
    // at first finding valid token
    const token = await Token.findOne({ token: req.params.token });
    if (!token) {
      return res.status(400).json({ error: "invalid link" });
    }

    // if token found find valid user
    const user = await User.findOne({
      _id: token.userId,
      email: req.body.email,
    });
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }

    //update password
    user.password = req.body.password;
    await user.save();

    res.json({ message: "password reset successful" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
