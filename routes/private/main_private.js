const express = require('express');
const router = express.Router();
const User = require('../../models/user')
const Event = require('../../models/Event')


router.get('/', (req, res) => {
  if(req.session.user) {
    const loginUser = req.session.user;
    Event.find().populate()
    .then(allEvents => {
      User.find()
      .then(Gamers => {
      res.status(200).render('authorized/main', {events: allEvents, loginUser: req.session.user, users:Gamers,  routeString: req.baseUrl});
    })});
  } else {
    res.status(402).redirect('/login');
  }
});

module.exports = router;
