module.exports = (_, res) => {
  res.status(404).render("errors/error-404");
};