const db = require("../models");
const passport = require("../config/passport");

module.exports = app => {
  app.post(
    "/api/login",
    passport.authenticate("local", async (req, res) => {
      // send the user the route to the members page
      res.json("/members");
    })
  );

  // Route for signing up. If successful, proceed to log the user in
  app.post("/api/signup", async (req, res) => {
    console.log(req.body);
    try {
      const { email, password } = req.body;
      const newUser = await db.User.create({
        email,
        password
      });

      if (newUser) {
        res.redirect(307, "/api/login");
      }
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  });

  // logout
  app.get("/logout", async (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // getting some data about the user
  app.get("/api/user_data", async (req, res) => {
    if (!req.user) {
      // user is not logged in
      res.json({});
    } else {
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
};
