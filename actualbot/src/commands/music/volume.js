const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { VolumeInterface } = require("discord.js");
const { MessageEmbed } = require("discord.js");

const client = require("../../index");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("volume")
		.setDescription("Adjust the song's volume")
		.addIntegerOption((option) =>
			option
				.setName("volume")
				.setDescription("Ex: 10 = 10%")
				.setMinValue(1)
				.setMaxValue(100)
				.setRequired(true)
		),

	execute: async (interaction) => {
		const { member, guild, options } = interaction;
		const voiceChannel = member.voice.channel;
		const volume = options.getInteger("volume");

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
			client.distube.setVolume(voiceChannel, volume);
			embed
				.setColor("Yellow")
				.setDescription(`🔊 Volume has been set to ${volume}`);
			return interaction.reply({ embeds: [embed], ephemeral: true });
		} catch (err) {
			console.log(err);
			embed.setColor("Red").setDescription("🙀 Something went wrong!.");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};
