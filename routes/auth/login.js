const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../../models/user');
const passport = require('passport');

router.get('/', (req, res) => {
  res.render('auth/login')
});


router.post('/', (req, res, next) => {
  const { email, password } = req.body
  User.findOne({ email })
    .then(foundUser => {
      if (!foundUser)
        return res.render('auth/login.hbs', {
          message: 'Invalid credentials, please Check User or Password'
        })
      bcrypt.compare(password, foundUser.password).then(exist => {
        if (!exist)
          return res.render('auth/login.hbs', {
            message: 'Invalid credentials, please Check User or Password'
          });

        req.session.user = foundUser;
        res.redirect('/main');
      })
    })
    .catch(err => next(err));
})


//google auth
router.get('/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/main',
    failureRedirect: '/login' // here you would redirect to the login page using traditional login approach
  })
);


module.exports = router;
