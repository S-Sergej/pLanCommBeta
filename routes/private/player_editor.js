const express = require('express');
const router = express.Router();
const User = require("../../models/user");
const uploadAvatarCloud = require('../../config/cloudinary');


/*router.get('/', (req, res, next) => {
  User.findOne({ _id: req.query.user_id })
  .then((user) =>{
    res.render('authorized/user_editor', {user});
  })
  .catch((error) => {console.log(error);});
}); */

router.get('/', (req, res) => {
  if(req.session.user) {
    res.render('authorized/user_editor', {username: req.session.user.username});
  } else {
    res.redirect('/login');
  }
});


router.post('/authorized/user_editor', uploadAvatarCloud.single('avatar'),
  (req, res, next) => {
    const avatarPath = req.file.url;
    const avatarName = req.file.originalname;
    User.update({ _id: req.query.user_id }, {avatarPath, avatarName})
      .then(user => {
        res.redirect('authorized/main');
      })
      .catch(error => {
        console.log(error);
      });
  });



module.exports = router;
