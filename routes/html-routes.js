// use path to use relative routes
const path = require("path");

const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = app => {
  app.get("/", async (req, res) => {
    // already has an account
    if (req.user) {
      res.redirect("/members");
    }

    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", async (rea, res) => {
    // already has an account
    if (req.user) {
      res.redirect("/members");
    }

    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // members area; erstricted route.
  app.get("/members", isAuthenticated, async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });
};
