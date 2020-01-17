const express = require('express');
const router = express.Router();
const User = require('../models/User');
const uploadAvatarCloud = require('../config/cloudinary');


router.get('/authorized/profile_settings', (req, res, next) => {
  User.findOne({ _id: req.query.user_id })
  .then((user) =>{
    res.render('profile_settings', {user});
  })
  .catch((error) => {console.log(error);});
});

router.post('/authorized/profile_settings', uploadAvatarCloud.single('avatar'),
  (req, res, next) => {
    const avatarPath = req.file.url;
    const avatarName = req.file.originalname;
    User.update({ _id: req.query.user_id }, {avatarPath, avatarName})
      .then(user => {
        res.redirect('auth/authorized_main');
      })
      .catch(error => {
        console.log(error);
      });
  });


module.exports = router;
