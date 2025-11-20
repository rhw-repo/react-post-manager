const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    next();
  } else {
    res.status(401).json({ error: "An error has occured" });
  }
};

module.exports = requireAuth;
