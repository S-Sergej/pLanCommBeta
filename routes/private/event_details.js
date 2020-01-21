const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const Event = require('../../models/Event')
const mongoose = require('mongoose')

router.get('/:id', (req, res, next) => {
  Event.findOne({ _id: req.params.id })
    .populate('subscribers')
    .then(theEvent => {
      res.render('authorized/event', { event: theEvent })
    })
    .catch(error => {
      next(error)
    })
})

router.post('/:id/subscribe', (req, res, next) => {
  const newSubscriber = req.session.user._id
  Event.findById(req.params.id, (err, theEvent) => {
    if (theEvent.subscribers.includes(newSubscriber)) {
      res.redirect(`/event/${req.params.id}`)
    } else {
      theEvent
        .update({ $push: { subscribers: newSubscriber } })
        //.populate('subscribers')
        .then(theEvent => {
          res.redirect(`/event/${req.params.id}`)
        })
        .catch(error => {
          next(error)
        })
    }
  })
})

router.post('/:id/unsubscribe', (req, res, next) => {
  const currentSubscriber_id = req.session.user._id //mongoose.Types.ObjectId(req.session.user._id)

  Event.findById(req.params.id, (err, theEvent) => {
    const updatedSubscribers = theEvent.subscribers.filter(
      subscriber => subscriber._id != currentSubscriber_id
    )
    theEvent
      .update({ subscribers: updatedSubscribers })
      .then(theEvent => {
        res.redirect(`/event/${req.params.id}`)
      })
      .catch(error => {
        next(error)
      })
  })
})

//if (theEvent.subscribers.includes(newSubscriber)) {

router.post('/:id/delete', (req, res, next) => {
  const current_user_id = req.session.user._id;
  Event.findById(req.params.id, (err, theEvent) => {
    if (theEvent.ownerid == current_user_id) {
      theEvent
      .remove({ _id: req.params.id })
      .then(theEvent => {
        res.redirect('/main')
      })
      .catch(error => {
        next(error)
      })    
    } else {
        res.redirect(`/event/${req.params.id}`)
    }
  })
})

module.exports = router
