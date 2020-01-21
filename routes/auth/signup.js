const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../../models/user')
const uploadAvatarCloud = require('../../config/cloudinary');


router.get('/', (req, res) => {
  res.render('auth/signup', {routeString: req.baseUrl});
})

router.post('/', uploadAvatarCloud.single('avatarURL'), (req, res, next) => {
  const { username, email, password } = req.body
  const passwordLength = 6
  if (password.length < passwordLength)
    return res.render('auth/signup', {
      message: `Password length should be not less than ${passwordLength}` , routeString: req.baseUrl
    })

  User.findOne({email})
    .then(foundUser => {
      if (foundUser)
        return res.render('auth/login', {
          message: `Account for ${foundUser.email} already exists, please login` , routeString: req.baseUrl
        });

      bcrypt
        .genSalt()
        .then(salt => bcrypt.hash(password, salt))
        .then(hash =>
          User.create({
            username: username,
            email: email,
            password: hash,
            avatarURL: req.file.url
          })
        )
        .then(newUser => {
          console.log(newUser);
          res.render('auth/login', {message:`Account for ${username} has been created. please Login`, routeString: req.baseUrl});
        });
    })
    .catch(err => next(err));
});

module.exports = router;
