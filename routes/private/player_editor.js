const express = require('express');
const router = express.Router();
const User = require("../../models/user");
const uploadAvatarCloud = require('../../config/cloudinary');

router.get('/:id', (req, res) => {
  User.findOne({_id: req.session.user})
  .then(theUser => {
  res.render('authorized/user_editor', {user: theUser, loginUser: req.session.user, routeString: req.baseUrl});
  })
});


router.post('/', uploadAvatarCloud.single('avatar'),
  (req, res, next) => {
    const avatarURL = req.file.url;
    User.findOneAndUpdate({ _id: req.session.user }, {avatarURL})
      .then(user => {
        res.redirect('/main');
      })
      .catch(error => {
        console.log(error);
      });
  }); 



module.exports = router;
