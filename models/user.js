const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate')

const userSchema = new Schema({
	username: {type: String, required: true, unique: true},
	email: {type: String, required: true, unique: true},
	password: String,
	googleID: String
},
	{
		timestamps: true
	});

	userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

module.exports = User;