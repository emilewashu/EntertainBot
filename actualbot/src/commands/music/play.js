const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { VolumeInterface } = require("discord.js");
const { MessageEmbed } = require("discord.js");

const client = require("../../index");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play a song.")
		.addStringOption((option) =>
			option
				.setName("query")
				.setDescription("Provide the name or url for the song")
				.setRequired(true)
		),
	execute: async (interaction) => {
		const { options, member, guild, channel } = interaction;

		const query = options.getString("query");
		const voiceChannel = member.voice.channel;

		const embed = new EmbedBuilder();
		if (!voiceChannel) {
			embed.setDescription(
				"You must be in a voice channel to execute music commands."
			);
			return interaction.replay({ embeds: [embed], ephemeral: true });
		}
		if (!member.voice.channelId == guild.members.me.voice.channelId) {
			embed.setDescription("Music player is already active.");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		try {
			const queue = await client.distube.getQueue(voiceChannel);
			client.distube.play(voiceChannel, query, {
				textChannel: channel,
				member: member,
			});
			return interaction.reply({ content: " 🎶 Request Received" });
		} catch (err) {
			console.log(err);
			embed.setColor("Red").setDescription("🙀 Something went wrong!.");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};
