const User = require("../models/user");

exports.getProfile = async (_, res) => {
  const users = await User.findOne(1);
  res.json({ users });
};