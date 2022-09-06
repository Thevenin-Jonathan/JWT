const app = require("./app/app");

const PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
  console.log(`Server started ! (http://localhost:${PORT})`);
})