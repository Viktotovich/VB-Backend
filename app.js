const express = require("express");
require("dotenv").config();

// JWT and Cookies with XSS protection for modern browsers
const cookieParser = require("cookie-parser");

//Routers
const indexRouter = require("./routes/adminRouter");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Important middleware
app.use(cookieParser());

//Might need refactoring since we're going to use JWT
//TODO: JWT, CORS, and CSRF protections (OPTIONAL: express cache)

app.use("/dashboard", indexRouter);

app.listen(process.env.PORT, () => {
  console.log("Hey Ya");
  console.log(process.env.PORT);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Houston, we've got a problem: " + err);
});
