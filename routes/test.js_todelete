const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get('/', (req, res, next) =>{
  User.find()
  .then(Gamers => {
      res.render('index', {users: Gamers});
  })
  .catch(error => {next(error)}
  );
});

module.exports = router;
