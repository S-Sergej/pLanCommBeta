var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {type: String, required: true, unique: true},
	email: {type: String, required: true, unique: true},
	password: String,
	googleID: String,
	avatarURL: String
},
	{
		timestamps: true
	});

var User = mongoose.model("User", userSchema);

module.exports = User;