const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("./config/passport");
require("dotenv").config();

// Port
var PORT = process.env.PORT || 5000;

// database models
const db = require("./models");

// create express app & configure the middleware needed to read content req body and public folder
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// we are using sessions to keep track of our user's login status
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
require("./routes/api-routes")(app);
require("./routes/html-routes")(app);

// // test url
// app.get("/test", (req, res) => {
//   res.send("Welcome to the nodejs + MySQL authentication app");
// });

// Listen to and show activities on th terminal. Also syncing our database and logging a message to the user upon success
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server running on PORT ${PORT} and DB is synced. Visit http://localhost/${PORT} in your browser`
    );
  });
});
