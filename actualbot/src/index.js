const fs = require("node:fs");
const path = require("node:path");
const {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	Partials,
} = require("discord.js");
const { clientId, guildId, token, mongodb } = require("./config.json");
const mongoose = require("mongoose");
const config = require("./config.json");

//Music Declarations
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
//

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.distube = new DisTube(client, {
	leaveOnStop: false,
	emitNewSongOnly: true,
	emitAddSongWhenCreatingQueue: false,
	emitAddListWhenCreatingQueue: false,
	plugins: [new SpotifyPlugin()],
});
module.exports = client;

client.commands = new Collection();
client.config = require("./config.json");
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
}

client.once(Events.ClientReady, () => {
	console.log("EntertainBot is ready!");
});

//Executes /command entered
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error("There is an error:" + error);
	}
});
(async () => {
	try {
		await mongoose.connect(config.mongodb, {
			keepAlive: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		if (mongoose.connect) {
			console.log("MongoDB connection was successful!");
		}
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
	}
})();

client.login(token);
