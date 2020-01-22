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
    res.render('authorized/user_editor', {user: req.session.user, routeString: req.baseUrl});
  } else {
    res.redirect('/login');
  }
});


router.post('/', uploadAvatarCloud.single('avatar'),
  (req, res, next) => {
    const avatarURL = req.file.url;
    //const avatarName = req.file.originalname;
    User.findOneAndUpdate({ _id: req.query.user_id }, {avatarURL})
      .then(user => {
        res.redirect('/main');
      })
      .catch(error => {
        console.log(error);
      });
      
  }); 



module.exports = router;
