const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    req.session.destroy(function(err) {
      if(err) {
        next(err);
      } else {
        res.clearCookie("connect.sid");
        res.redirect('/');
      }
    });
});

module.exports = router;
