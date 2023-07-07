const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const mongoose = require("mongoose");
const { Schema } = mongoose;
const port = 8080;

//Connection to MongoDb
const url =
	"mongodb+srv://eantiege:Apocalypse10@entertainbot.ajhyifg.mongodb.net/discordplaylists";
mongoose
	.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("Connected to MongoDB");

		// Start the server
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	})
	.catch((err) => {
		console.error("Error connecting to MongoDB:", err);
	});

const songSchema = new Schema({
	_id: Schema.Types.ObjectId,
	title: String,
	duration: String,
	url: String,
	thumbnail: String,
});
const monmodel = require("../src/schemas/guild");

app.get("/fetchall", async (req, res) => {
	try {
		const song = await monmodel.find({});
		res.send({ status: "ok", data: song });
	} catch (err) {
		console.log(err);
	}
});

app.post("/deleteUser", async (req, res) => {
	const { userid } = req.body;
	try {
		const song = await monmodel.findOne({});
		await monmodel.deleteOne({ _id: userid });
		res.send({ status: "Ok", data: "Deleted" });
	} catch (error) {
		console.log(error);
	}
});
