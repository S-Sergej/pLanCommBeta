const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Event = require('../../models/Event');


router.get('/:id', (req, res, next) =>{
  Event.findOne({'_id': req.params.id})
  .then(theEvent => {
      res.render('authorized/event', {event: theEvent});
  })
  .catch(error => {next(error)}
  );
});

module.exports = router;