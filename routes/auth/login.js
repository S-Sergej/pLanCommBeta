const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

router.get('/', (req, res) => {
  res.render('auth/login')
})

router.post('/', (req, res, next) => {
  const { email, password } = req.body
  User.findOne({ email })
    .then(foundUser => {
      if (!foundUser) {
        res.status(403).render('auth/login', {
          message: 'Invalid credentials, please Check User or Password'
        })
      } else {
        bcrypt.compare(password, foundUser.password).then(passwordRight => {
          if (!passwordRight) {
            res.status(403).render('auth/login', {
              message: 'Invalid credentials, please Check User or Password'
            })
          } else {
            req.session.user = foundUser;
            //debugger;
            res.status(304).redirect('/main');
          }
        })
      }
    })
    .catch(err => next(err))
})

//google auth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login', // here you would redirect to the login page using traditional login approach
    session: false
  }),
  (req, res, next) => {
    req.session.user = req.user
    res.redirect('/main')
  }
)

module.exports = router
