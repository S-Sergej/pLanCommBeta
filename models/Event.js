const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require("../models/User");

const eventSchema = new Schema({
  eventname: String,
  eventdate: Date,
  owner: [{type: Schema.Types.ObjectId, ref: "User"}]
  },
  {
    timestamps: true
  }
);

const Event = mongoose.model("Event", eventSchema);

  module.exports = Event;