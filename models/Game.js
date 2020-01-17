const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
	gamename: String
},
	{
		timestamps: true
	});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;