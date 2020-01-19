const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const uploadAvatarCloud = require('../config/cloudinary');
const Event = require("../models/Event");



router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

const loginCheck = () => {
  return (req, res, next) => (req.session.user ? next() : res.redirect("/"));
};


router.get("/login", (req, res) => {
  res.render("auth/login");
});


router.get("/event_editor",  loginCheck(), (req, res) => {
  const loggedUser = req.session.user;
  res.render("authorized/event_editor");
});


router.post("/signup", uploadAvatarCloud.single("avatarURL"), (req, res, next) => {
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
                  message: `Username ${foundUser.username} already exists, please login`
                });

              bcrypt
                .genSalt()
                .then(salt => bcrypt.hash(password, salt))
                .then(hash => User.create({
                  username: username,
                  email: email,
                  password: hash,
                  avatarURL: req.file.url,
                }))
                .then(newUser => {
                  console.log(newUser);
                
                  req.session.user = newUser; // add newUser to session
                  res.redirect("/auth/main");
                });
            })
            .catch(err => next(err));
        });

      router.post("/login", (req, res, next) => {
        const {email, password} = req.body;
        User.findOne({email})
          .then(foundUser => {
            if (!foundUser)
              return res.render("auth/login", {
                message: "Invalid credentials, please Check User or Password"
              });
            bcrypt.compare(password, foundUser.password).then(exist => {
              if (!exist)
                return res.render("auth/login", {
                  message: "Invalid credentials, please Check User or Password"
                }); 

              req.session.user = foundUser;
              res.redirect("/auth/main");
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

      /*router.post("/event_editor"), (req, res, next) => {
        const {eventname, eventdate} = req.body;
        if (eventname.length < 6)
        return res.render ("authorized/event_editor", {
          message : "Invaldid eventname, please use at least 6 credentials"
        }).then(newEvent => {
        console.log(newEvent);
        res.redirect("/authorized/main");
      })
      .catch(err => next(err));
      }; */

      router.post('/event_editor', (req, res) => {
        const {eventname, eventdate} = req.body;
        const owner = req.session.user;
        Event.create({ eventname, eventdate, owner }).then(() => {
            res.redirect('/auth/main')
        })
            .catch(err => {
                next(err);
            });
    });




router.get("/google", passport.authenticate("google", {
  scope: [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email"
  ]
}));
      
router.get("/google/callback", passport.authenticate("google", {
  successRedirect: "/auth/main",
  failureRedirect: "/" // here you would redirect to the login page using traditional login approach
}));
    
router.get("/main", loginCheck(), (req, res, next) => {
  const loggedIn = req.session.user;
  Event.find().populate()
  .then(allEvents => {
      res.render('authorized/main', {events: allEvents});
  })
  .catch(error => {next(error)}
  );
});



module.exports = router;
