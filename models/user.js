const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate')

const userSchema = new Schema({
	username: {type: String, unique: true},
	email: {type: String, unique: true},
	password: {type: String},
	googleID: String
},
	{
		timestamps: true
	});

	userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

module.exports = User;