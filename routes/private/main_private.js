const express = require('express');
const router = express.Router();
const User = require('../../models/user')
const Event = require('../../models/Event')


router.get('/', (req, res) => {
  if(req.session.user) {
    const ownername = req.session.user.username;
    //console.log(User.findById().populate());
    Event.find().populate()
    .then(allEvents => {
      User.find()
      .then(Gamers => {
      res.render('authorized/main', {events: allEvents, username: ownername, users:Gamers});
    })});
  } else {
    res.redirect('/login');
  }
});
/*
router.get('/', (res, next) => {
  User.find()
  .then(Gamers => {
    console.log(users)
  res.redirect('/authorized/main', {users: Gamers});
  })
  .catch(error => {next(error)}
  );
});
*/
module.exports = router;
