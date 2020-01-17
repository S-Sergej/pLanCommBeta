const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatlogSchema = new Schema({
  input: String,
},
	{
		timestamps: true
	});

const Chatlog = mongoose.model("Chatlog", chatlogSchema);

module.exports = Chatlog;