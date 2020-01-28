// This is the middleware that restricts user access to routes. requiring that the user be lgged in first
module.exports = (req, res, next) => {
  // if user is logged in, continue with the reques to the restricted route
  if (req.user) {
    return next();
  }

  // user isn't logged in, redirect to login page
  return res.redirect("/");
};
