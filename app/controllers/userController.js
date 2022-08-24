exports.getProfile = async (req, res) => {
  if (req.user) return res.render("profile", { user: req.user });
  res.render("/");
};