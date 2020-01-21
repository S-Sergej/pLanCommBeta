const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require("../models/user");

const eventSchema = new Schema({
  eventname: String,
  eventdate: Date,
  ownerid: {type: Schema.Types.ObjectId, ref: "User"},
  ownername: String,
  subscribers: [{type: Schema.Types.ObjectId, ref: "User"}]
},
  {
    timestamps: true
  }
);

const Event = mongoose.model("Event", eventSchema);

  module.exports = Event;