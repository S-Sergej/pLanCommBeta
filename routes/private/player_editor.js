const express = require('express');
const router = express.Router();
const User = require("../../models/user");
const uploadAvatarCloud = require('../../config/cloudinary');


router.get('/authorized/user_editor', (req, res, next) => {
  User.findOne({ _id: req.query.user_id })
  .then((user) =>{
    res.render('user_editor', {user});
  })
  .catch((error) => {console.log(error);});
});

router.post('/authorized/user_editor', uploadAvatarCloud.single('avatar'),
  (req, res, next) => {
    const avatarPath = req.file.url;
    const avatarName = req.file.originalname;
    User.update({ _id: req.query.user_id }, {avatarPath, avatarName})
      .then(user => {
        res.redirect('auth/main');
      })
      .catch(error => {
        console.log(error);
      });
  });



module.exports = router;
