const router = require("express").Router();
const userRouter = require("./user.router");

router.get("/", (req, res) => {
  if (req.user) return res.render("index", { user: req.user });
  res.render("index");
});

router.use("/users", userRouter);

module.exports = router;