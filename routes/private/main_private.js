const express = require('express');
const router = express.Router();
const User = require('../../models/user')
const Event = require('../../models/Event')


router.get('/', (req, res) => {
  if(req.session.user) {
    const owner = req.session.user;
    Event.find().populate()
    .then(allEvents => {
      res.render('authorized/main', {events: allEvents, user: owner, routeString: req.baseUrl});
    })
  } else {
    res.redirect('/login');
  }
});



module.exports = router;
