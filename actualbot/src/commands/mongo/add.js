const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const client = require("../../index");

//Mongo
const mongoose = require("mongoose");
const Song = require("../../schemas/guild");
const { ObjectId } = require("mongodb");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("add2playlist")
		.setDescription("Adds current song playing to a playlist."),
	async execute(interaction) {
		const { member, guild } = interaction;
		const voiceChannel = member.voice.channel;
		const embed = new EmbedBuilder();

		try {
			const queue = await client.distube.getQueue(voiceChannel);
			if (!queue) {
				embed.setDescription("There's no queue.");
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}

			const currentSong = queue.songs[0];
			let guildProfile = await Song.findOne({
				title: currentSong.name,
			});

			if (!guildProfile) {
				guildProfile = await new Song({
					_id: new ObjectId(),
					title: currentSong.name,
					duration: currentSong.formattedDuration,
					url: currentSong.url,
					thumbnail: currentSong.thumbnail,
				});

				await guildProfile.save().catch(console.log(console.error()));
				embed
					.setColor("Green")
					.setDescription(`🎵 Added "${currentSong.name} to the playlist.`);
				return interaction.reply({ embeds: [embed], ephemeral: true });
			} else {
				return interaction.reply("Nope!");
			}
		} catch (err) {
			console.log(err);
			embed.setColor("Red").setDescription("🙀 Something went wrong!.");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};
