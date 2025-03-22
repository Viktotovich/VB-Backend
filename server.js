const express = require("express");
require("dotenv").config;
require("./middleware/passport");

//middleware
const passport = require("passport");

//Routers
const dashboardRouter = require("./routes/dashboardRouter");
const loginRouter = require("./routes/loginRouter");

//TODO: JWT, CORS, and CSRF protections (OPTIONAL: express cache)

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/login", loginRouter);

app.use(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  dashboardRouter
);

app.listen(process.env.PORT, () => {
  console.log("Hey Ya");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Houston, we've got a problem", error: err });
});
