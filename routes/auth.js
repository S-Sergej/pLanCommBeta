const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  const passwordLength = 6;

  if (password.length < passwordLength)
    return res.render("auth/signup", {
      message: `Password length should be not less than ${passwordLength}`
    });

  User.findOne({ username })
    .then(foundUser => {
      if (foundUser)
        return res.render("auth/login", {
          message: `Username ${foundUser.username} is already exists, please login`
        });

      bcrypt
        .genSalt()
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ username: username, password: hash }))
        .then(newUser => {
          console.log(newUser);
          req.session.user = newUser; // add newUser to session
          res.redirect("/");
        });
    })
    .catch(err => next(err));
});





router.get("/google", passport.authenticate("google", 
  {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);

router.get("/google/callback", passport.authenticate("google", 
{
    successRedirect: "/authorized/authorized_main",
    failureRedirect: "/" // here you would redirect to the login page using traditional login approach
  }), function(req, res) {
    console.log("logged in by google")
    res.redirect('/');
  }

);

module.exports = router;