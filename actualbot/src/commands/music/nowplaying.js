const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const client = require("../../index");
const { execute } = require("./play");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("nowplaying")
		.setDescription("Find what song is currently playing."),

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
			const song = queue.songs[0];
			embed
				.setColor("Blue")
				.setDescription(
					`🎵 Currently Playing: \`${song.name}\` - \`${song.formattedDuration}\`\nLink: ${song.url}`
				)
				.setThumbnail(song.thumbnail);
			return interaction.reply({ embeds: [embed], ephemeral: true });
		} catch (err) {
			console.log(err);
			embed.setColor("Red").setDescription("🙀 Something went wrong!.");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};
