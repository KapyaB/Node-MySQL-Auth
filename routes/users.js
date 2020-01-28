const express = require("express");
const router = require("express-promise-router")();
const usersController = require("../controllers/users");
const passport = require("passport");
const passportConf = require("../config/passport");
const auth = require("../config/middleware/auth");

const { validateBody, schemas } = require("../helpers/routeHelpers");
const passportJwt = passport.authenticate("jwt", { session: false });

// sign up
router
  .route("/signup")
  .post(validateBody(schemas.signUpSchema), usersController.signUp);
