const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("bestfootballteam")
		.setDescription("Provides information about the best NFL team."),
	async execute(interaction) {
		return interaction.reply(
			`The Baltimore Ravens are the best team in the NFL.`
		);
	},
};
