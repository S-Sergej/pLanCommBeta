const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

const loginCheck = () => {
  return (req, res, next) => (req.session.user ? next() : res.redirect("/"));
};


router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/authorized_main", loginCheck(), (req, res) => {
  const loggedUser = req.session.user;
  res.render("authorized/authorized_main");
});


router.post("/signup", (req, res, next) => {
      const {
        username,
        email,
        password
      } = req.body;
      const passwordLength = 6;

      if (password.length < passwordLength)
        return res.render("auth/signup", {
          message: `Password length should be not less than ${passwordLength}`
        });

          User.findOne({
              username
            })
            .then(foundUser => {
              if (foundUser)
                return res.render("auth/login", {
                  message: `Username ${foundUser.username} is already exists, please login`
                });

              bcrypt
                .genSalt()
                .then(salt => bcrypt.hash(password, salt))
                .then(hash => User.create({
                  username: username,
                  email: email,
                  password: hash
                }))
                .then(newUser => {
                  console.log(newUser);
                  req.session.user = newUser; // add newUser to session
                  res.render("authorized/authorized_main");
                });
            })
            .catch(err => next(err));
        });

      router.post("/login", (req, res, next) => {
        const {
          username,
          password
        } = req.body;
        User.findOne({
            username
          })
          .then(foundUser => {
            if (!foundUser)
              return res.render("auth/login", {
                message: "Invalid credentials"
              }); // User not found

            bcrypt.compare(password, foundUser.password).then(exist => {
              if (!exist)
                return res.render("auth/login", {
                  message: "Invalid credentials"
                }); // The password doesn't match

              // Log the user in
              req.session.user = foundUser;
              res.redirect("/authorized/authorized_main");
            });
          })
          .catch(err => next(err));
      });

      router.get("/logout", (req, res, next) => {
        req.session.destroy(err => {
          if (err) {
            next(err);
          } else {
            res.clearCookie("connect.sid");
            res.redirect("/");
          }
        });
      });



      router.get("/google", passport.authenticate("google", {
        scope: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email"
        ]
      }));
      router.get("/google/callback", passport.authenticate("google", {
        successRedirect: "/authorized/authorized_main",
        failureRedirect: "/" // here you would redirect to the login page using traditional login approach
      }));
    

      module.exports = router;