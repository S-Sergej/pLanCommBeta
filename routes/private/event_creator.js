const express = require('express');
const router = express.Router();
const Event = require('../../models/Event');
const User = require('../../models/user');


router.get('/', (req, res) => {
  if(req.session.user){
  res.render('authorized/event_create')
} else {
  res.redirect('/login');
  }
});


router.post('/', (req, res, n) => {
  if(!req.session.user) {
    return res.render('auth/login', {message: 'Session is no longer valid. Please re-login'})
  }
  const { eventname, eventdate} = req.body;
  const ownerid = req.session.user._id;
  const ownername = req.session.user.username;
  const subscribers = [ownerid];

  Event.create({eventname, eventdate, ownerid, ownername, subscribers})
    .then(() => {
      res.redirect('/main')
    })
    .catch(err => {
      next(err)
    })
})

module.exports = router;