const express = require("express");
require("dotenv").config();
const passport = require("passport");

//sessions
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");

//Routers
const indexRouter = require("./routes/adminRouter");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Might need refactoring since we're going to use JWT
//TODO: JWT, CORS, and CSRF protections (OPTIONAL: express cache)
app.use(
  expressSession({
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.session());

app.use("/dashboard", indexRouter);

app.listen(process.env.PORT, () => {
  console.log("Hey Ya");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Houston, we've got a problem: " + err);
});
