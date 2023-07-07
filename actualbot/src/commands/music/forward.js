const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("forward")
		.setDescription("Forward the current song")
		.addIntegerOption((option) =>
			option
				.setName("seconds")
				.setDescription("Amount of seconds to forward ")
				.setMinValue(1)
				.setRequired(true)
		),

	execute: async (interaction) => {
		const { member, guild, options } = interaction;
		const voiceChannel = member.voice.channel;
		const seconds = options.getInteger("seconds");

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
			queue.currentTime += seconds;
			await queue.seek(queue.currentTime);
			embed
				.setColor("Green")
				.setDescription(`⏩ Forwarded song by \`${seconds}s\`. `);
			return interaction.reply({ embeds: [embed], ephemeral: true });
		} catch (err) {
			console.log(err);
			embed.setColor("Red").setDescription("🙀 Something went wrong!.");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};
