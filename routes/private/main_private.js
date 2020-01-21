const express = require('express');
const router = express.Router();
const User = require('../../models/user')
const Event = require('../../models/Event')


router.get('/', (req, res) => {
  if(req.session.user) {
    const ownername = req.session.user.username;
    console.log(User.findById().populate());
    Event.find().populate()
    .then(allEvents => {
      res.render('authorized/main', {events: allEvents, username: ownername});
    })
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
