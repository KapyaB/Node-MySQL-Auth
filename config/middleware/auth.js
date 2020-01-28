const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function(req, res, next) {
  // Get the token from the request header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "Unauthorised Access" });
  }

  // verify the token
  try {
    // decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // take the req object and assign a value to user
    req.user = decoded.user;
    next();
  } catch (err) {
    // invalid token
    res.status(401).json({ msg: "Invalid token" });
  }
};
