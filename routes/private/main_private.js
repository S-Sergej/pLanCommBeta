const express = require('express');
const router = express.Router();
const User = require('../../models/user')



router.get('/', (req, res) => {
  if(req.session.user) {
    res.render('authorized/main', {username: req.session.user.username});
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
