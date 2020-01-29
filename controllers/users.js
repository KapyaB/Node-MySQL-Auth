const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const ejs = require("ejs");

const db = require("../models");
const User = db.User;

// sign jwt token
const signToken = user => {
  // create token payload
  const payload = {
    user: {
      id: user.uuid
    }
  };
  // sign the token
  return JWT.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 86400 } // 24 hours
  );
};

// generate errors to sent to from end
const createError = errMsg => {
  return {
    errors: [{ error: errMsg }]
  };
};

// actual users controller
module.exports = {
  // signup
  signUp: async (req, res, next) => {
    // the request body is coming from JOI validator
    let { username, email, password } = req.value.body;

    // check if user already exists by email
    let foundUser = await User.findOne({
      where: {
        email: email
      }
    });

    if (foundUser) {
      return res.status(403).json(createError("Email address taken"));
    }

    // all good

    // hash password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    // save new user
    const newUser = await User.create({
      username,
      email,
      password
    });

    // create email verification token
    // send token

    // respond with a verification email sent msg

    // tell user they can noe log in (if no verification is required)
    res.status(200).json({
      newUser,
      msg: "Sign up successful!"
    });
  },

  // Sign in
  signIn: async (req, res, next) => {
    const { email, password } = req.value.body;
    try {
      // find user
      const user = await User.findOne({
        where: { email: email }
      });

      // no user with provided email
      if (!user) {
        return res
          .status(400)
          .json(
            createError(
              "Incorrect credentials. Please check your email and/or password"
            )
          );
      }

      // handle unverified email address here

      // compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      // wrong password
      if (!isMatch) {
        return res
          .status(400)
          .json(
            createError(
              "Incorrect credentials. Please check your email and/or password"
            )
          );
      }

      // reactivate account if wasn't
      await User.update({ isActive: true }, { where: { email: email } });

      // generate access token
      const token = signToken(user);
      // send back token
      res.status(200).json(token);
    } catch (err) {
      console.error(err.message);
      res.staus(500).send("internal Server error");
    }
  },

  // Get user
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id);

      // user not found
      if (!user) {
        return res.status(400).json(createError("User not found"));
      }

      return res.status(200).json(user);
    } catch (err) {
      console.error(err.message);
      res.staus(500).send("internal Server error");
    }
  }
};
