const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { VolumeInterface } = require("discord.js");
const client = require("../../index");
const { MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription("Stop a song and removes EntertainBot."),

	execute: async (interaction) => {
		const { member, guild } = interaction;
		const voiceChannel = member.voice.channel;

		const embed = new EmbedBuilder();
		if (!voiceChannel) {
			embed.setDescription(
				"You must be in a voice channel to execute music commands."
			);
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		if (!member.voice.channelId == guild.members.me.voice.channelId) {
			embed.setDescription("Music player is already active.");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		try {
			const queue = await client.distube.getQueue(voiceChannel);

			if (!queue) {
				embed.setDescription("There's no queue.");
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
			await queue.stop(voiceChannel);
			embed.setColor("Red").setDescription("🛑 Queue has been stopped.");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		} catch (err) {
			console.log(err);
			embed.setColor("Red").setDescription("🙀 Something went wrong!.");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};
