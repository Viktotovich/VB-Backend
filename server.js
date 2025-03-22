const express = require("express");
require("dotenv").config;

//Routers
const dashboardRouter = require("./routes/dashboardRouter");

//TODO: JWT, CORS, and CSRF protections (OPTIONAL: express cache)

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/dashboard", dashboardRouter);

app.listen(process.env.PORT, () => {
  console.log("Hey Ya");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Houston, we've got a problem", error: err });
});
