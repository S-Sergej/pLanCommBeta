const express = require('express');
const router = express.Router();
const User = require("../../models/user");

/*router.get('/', (req, res) => {
  if(req.session.user) {
    res.render('authorized/user_details', {username: req.session.user.username});
  } else {
    res.redirect('/login');
  }
}); */
router.get("/", (req, res, next) => {
  User.find()
  .then(Gamers => {
  res.render('authorized/user_details', {users: Gamers, user: req.session.user, routeString: req.baseUrl});
  })
  .catch(error => {next(error)}
  );
});









module.exports = router;