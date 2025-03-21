require("dotenv").config();
const jwt = require("jsonwebtoken");
const db = require("../db");
const passport = require("passport");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class Auth {
  async genPassword(password) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return { hash };
  }

  async validatePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

module.exports = new Auth();

/*
    Let's talk about bcrypt for a second, it does a really cool thing where
    you don't have to store the salt in the database - the random salt is already
    in the hash itself. 

    Does it make it less secure? Absolutely not. But it does save us a 
    lot of rows of our DB
*/
