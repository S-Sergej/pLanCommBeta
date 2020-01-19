const express = require('express');
const router  = express.Router();
const User = require("../models/User");


/* GET home page */
router.get("/", (req, res, next) => {
  const loggedIn = req.session.user;
  User.find()
  .then(Gamers => {

      res.render('index', {users: Gamers});
  })
  .catch(error => {next(error)}
  );
});


module.exports = router;
