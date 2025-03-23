const express = require("express");
require("dotenv").config();
require("./middleware/authenticate");

//middleware
const cookieparser = require("cookie-parser");
const cors = require("cors");

//JWT Middleware
const { requireUser } = require("./middleware/jwt/requireUser");
const { deserializeUser } = require("./middleware/jwt/deserializeUser");

//Routers
const dashboardRouter = require("./routes/dashboardRouter");
const apiRouter = require("./routes/apiRouter");

//TODO: JWT, CORS, and CSRF protections (OPTIONAL: express cache)
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(
  cors({
    credentials: true,
    origin: process.env.AUDIENCE,
  })
);
app.use(deserializeUser);

app.use("/api", apiRouter);
app.use("/dashboard", requireUser, dashboardRouter);

app.listen(process.env.PORT, () => {
  console.log("Hey Ya");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Houston, we've got a problem", error: err });
});
