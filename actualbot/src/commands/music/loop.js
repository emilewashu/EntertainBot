const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription("Display loop options.")
		.addStringOption((option) =>
			option
				.setName("options")
				.setDescription("off, song, queue")
				.addChoices(
					{ name: "off", value: "off" },
					{ name: "song", value: "song" },
					{ name: "queue", value: "queue" }
				)
				.setRequired(true)
		),

	async execute(interaction) {
		const { member, options, guild } = interaction;
		const voiceChannel = member.voice.channel;
		const option = options.getString("options");
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
				embed.setColor("Red").setDescription("There's no queue.");
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
			let mode = null;

			switch (option) {
				case "off":
					mode = 0;
					break;
				case "song":
					mode = 1;
					break;
				case "queue":
					mode = 2;
					break;
			}

			mode = await queue.setRepeatMode(mode);
			mode = mode ? (mode === 2 ? "Repeat queue" : "Repeat song") : "Off";

			embed
				.setColor("Orange")
				.setDescription(`🔁 Repeat mode has been set to \`${mode}\`. `);
			return interaction.reply({ embeds: [embed], ephemeral: true });
		} catch (err) {
			console.log(err);
			embed.setColor("Red").setDescription("🙀 Something went wrong!.");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};
