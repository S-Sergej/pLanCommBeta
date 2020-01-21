const express = require('express');
const router = express.Router();
const User = require('../../models/user')
const Event = require('../../models/Event')


router.get('/', (req, res) => {
  if(req.session.user) {
    const owner = req.session.user._id;
    console.log(owner);
    Event.find().populate('owner')
    .then(allEvents => {
      res.render('authorized/main', {events: allEvents, username: req.session.user.username});
    })
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
