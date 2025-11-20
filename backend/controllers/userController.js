const User = require("../models/userModel");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    req.session.user = { _id: user._id, email: user.email };
    res
      .status(200)
      .json({ message: "Logged in successfully", user: req.session.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);
    req.session.user = { _id: user._id, email: user.email };
    res.status(200).json({
      message: "User signed up and logged in",
      user: req.session.user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.clearCookie("connect.sid"); 
    res.json({ message: "Logged out successfully" });
  });
};

module.exports = { signupUser, loginUser, logoutUser };
