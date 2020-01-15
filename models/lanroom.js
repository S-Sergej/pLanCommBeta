const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lanroomSchema = new Schema({
  roomname: String,
  },
  {
    timestamps: true
  }
);

const Lanroom = mongoose.model("Lanroom", lanroomSchema);

  module.exports = Lanroom;