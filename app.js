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

//TODO: CSRF TOKENS as we are storing JWT in cookies
//TODO: Basic Express cache
const app = express();

//Escape dots - no example.net.hacker.com
//Escape resource paths example.net/api => example.net
//Prevent subdomain hijacking
const allowedOriginPattern = new RegExp(
  `^${process.env.AUDIENCE.replace(/\./g, "\\.").replace(/\/$/, "")}(/.*)?$`
);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

//might be over-engineered, try to do it with just the normal domain
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || allowedOriginPattern.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    //https://expressjs.com/en/resources/middleware/cors.html
  })
);

app.get("/", (req, res) => res.json({ message: "Nothing here" }));
app.use("/api", apiRouter);
app.use("/dashboard", deserializeUser, requireUser, dashboardRouter);

app.listen(process.env.PORT, () => {
  console.log("Hey Ya");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Houston, we've got a problem", error: err });
});
