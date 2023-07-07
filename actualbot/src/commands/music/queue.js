const {
	SlashCommandBuilder,
	EmbedBuilder,
	VoiceChannel,
	GuildEmoji,
	PermissionFlagsBits,
} = require("discord.js");
const { VolumeInterface } = require("discord.js");
const { MessageEmbed } = require("discord.js");

const client = require("../../index");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Get list of your currently active queue."),

	execute: async (interaction) => {
		const { options, member, guild, channel } = interaction;
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
			embed
				.setColor("Purple")
				.setDescription(
					`${queue.songs.map(
						(song, id) =>
							`\n**${id + 1}. ** ${song.name} - ${song.formattedDuration}`
					)}`
				);
			return interaction.reply({ embeds: [embed], ephemeral: true });
		} catch (err) {
			console.log(err);
			embed.setColor("Red").setDescription("🙀 Something went wrong!.");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};
