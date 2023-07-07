const { Schema, model } = require("mongoose");

let songSchema = new Schema({
	_id: Schema.Types.ObjectId,
	title: String,
	duration: String,
	url: String,
	thumbnail: String,
});

module.exports = model("Song", songSchema, "playlist1");
